import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TawkToService } from '../../utils/tawkToService';

interface TawkToChatProps {
  showOnLanding?: boolean;
  customPosition?: 'br' | 'bl' | 'cr' | 'cl';
}

export const TawkToChat: React.FC<TawkToChatProps> = ({ 
  showOnLanding = true, 
  customPosition = 'br' 
}) => {
  const { user, company } = useAuth();

  useEffect(() => {
    // Initialize Tawk.to when component mounts
    const initializeTawkTo = () => {
      // Set custom style
      TawkToService.setWidgetStyle({
        visibility: {
          desktop: {
            position: customPosition,
            xOffset: 20,
            yOffset: 20
          },
          mobile: {
            position: customPosition,
            xOffset: 10,
            yOffset: 10
          }
        }
      });

      // Set up event listeners
      TawkToService.onLoad(() => {
        console.log('Tawk.to chat loaded successfully');
        
        // If user is logged in, set their information
        if (user && company) {
          TawkToService.initializeWithUser({
            name: user.name,
            email: user.email,
            company: company.name,
            plan: company.plan,
            userId: user.id
          });

          // Add relevant tags
          const tags = [
            `plan_${company.plan}`,
            `role_${user.role}`,
            company.isTrialActive ? 'trial_user' : 'paid_user'
          ];
          TawkToService.addTags(tags);
        }
      });

      TawkToService.onChatStarted(() => {
        console.log('Chat started');
        
        // Track chat start event
        if (user && company) {
          TawkToService.addEvent('chat_started', {
            userId: user.id,
            companyId: company.id,
            plan: company.plan,
            timestamp: new Date().toISOString()
          });
        }
      });

      TawkToService.onChatEnded(() => {
        console.log('Chat ended');
        
        // Track chat end event
        if (user && company) {
          TawkToService.addEvent('chat_ended', {
            userId: user.id,
            companyId: company.id,
            timestamp: new Date().toISOString()
          });
        }
      });

      TawkToService.onStatusChange((status) => {
        console.log('Tawk.to status changed:', status);
      });
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeTawkTo, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [user, company, customPosition]);

  // Update user info when user or company changes
  useEffect(() => {
    if (user && company && TawkToService.isReady()) {
      TawkToService.setVisitorInfo({
        name: user.name,
        email: user.email,
        company: company.name,
        plan: company.plan,
        userId: user.id,
        companyId: company.id,
        role: user.role,
        isTrialActive: company.isTrialActive,
        lastUpdate: new Date().toISOString()
      });

      // Update tags
      const tags = [
        `plan_${company.plan}`,
        `role_${user.role}`,
        company.isTrialActive ? 'trial_user' : 'paid_user'
      ];
      TawkToService.addTags(tags);
    }
  }, [user, company]);

  // This component doesn't render anything visible
  // The chat widget is injected by the Tawk.to script
  return null;
};

// Hook for easy access to Tawk.to functions
export const useTawkTo = () => {
  const { user, company } = useAuth();

  const showChat = () => TawkToService.showWidget();
  const hideChat = () => TawkToService.hideWidget();
  const toggleChat = () => TawkToService.toggleWidget();
  const maximizeChat = () => TawkToService.maximizeWidget();
  const minimizeChat = () => TawkToService.minimizeWidget();

  const sendEvent = (event: string, metadata?: any) => {
    const eventData = {
      ...metadata,
      userId: user?.id,
      companyId: company?.id,
      timestamp: new Date().toISOString()
    };
    TawkToService.addEvent(event, eventData);
  };

  const updateUserInfo = (additionalInfo?: any) => {
    if (user && company) {
      TawkToService.setVisitorInfo({
        name: user.name,
        email: user.email,
        company: company.name,
        plan: company.plan,
        userId: user.id,
        companyId: company.id,
        role: user.role,
        isTrialActive: company.isTrialActive,
        ...additionalInfo,
        lastUpdate: new Date().toISOString()
      });
    }
  };

  return {
    showChat,
    hideChat,
    toggleChat,
    maximizeChat,
    minimizeChat,
    sendEvent,
    updateUserInfo,
    isReady: TawkToService.isReady(),
    isEngaged: TawkToService.isVisitorEngaged(),
    status: TawkToService.getStatus()
  };
};