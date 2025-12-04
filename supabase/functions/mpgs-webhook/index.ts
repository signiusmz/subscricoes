import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface WebhookPayload {
  order?: {
    id: string;
    amount: string;
    currency: string;
    status?: string;
  };
  transaction?: {
    id: string;
    type?: string;
    amount?: string;
    currency?: string;
  }[];
  result?: string;
  response?: {
    gatewayCode?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const payload: WebhookPayload = await req.json();
    console.log('Received webhook:', payload);

    if (!payload.order?.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload - missing order ID' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const orderId = payload.order.id;
    const transactionId = payload.transaction?.[0]?.id || '';
    const amount = parseFloat(payload.order.amount || '0');
    const currency = payload.order.currency || 'MZN';
    const result = payload.result || 'UNKNOWN';

    const status = result === 'SUCCESS' ? 'completed' : 
                   result === 'FAILURE' ? 'failed' : 
                   'pending';

    const { data: existingPayment, error: fetchError } = await supabase
      .from('subscription_payments')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching payment:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (existingPayment) {
      const { error: updateError } = await supabase
        .from('subscription_payments')
        .update({
          transaction_id: transactionId,
          status: status,
          gateway_response: payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPayment.id);

      if (updateError) {
        console.error('Error updating payment:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update payment' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (status === 'completed') {
        const { error: companyError } = await supabase
          .from('companies')
          .update({
            is_trial_active: false,
            trial_end_date: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPayment.company_id);

        if (companyError) {
          console.error('Error updating company:', companyError);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment updated successfully',
          orderId: orderId,
          status: status
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.log('Payment not found for order:', orderId);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment record not found',
          orderId: orderId
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
