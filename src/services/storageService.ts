import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    return data;
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async downloadFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;
    return data;
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },

  async listFiles(bucket: string, path: string = '') {
    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) throw error;
    return data;
  },

  async createFileAttachment(
    companyId: string,
    entityType: string,
    entityId: string,
    fileName: string,
    fileType: string | null,
    fileSize: number | null,
    storagePath: string,
    uploadedBy: string | null
  ) {
    const { data, error } = await supabase
      .from('file_attachments')
      .insert({
        company_id: companyId,
        entity_type: entityType,
        entity_id: entityId,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        storage_path: storagePath,
        uploaded_by: uploadedBy,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFileAttachments(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from('file_attachments')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteFileAttachment(id: string) {
    const { data: attachment, error: fetchError } = await supabase
      .from('file_attachments')
      .select('storage_path')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!attachment) throw new Error('Attachment not found');

    const pathParts = attachment.storage_path.split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');

    await this.deleteFile(bucket, filePath);

    const { error: deleteError } = await supabase
      .from('file_attachments')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
  },
};
