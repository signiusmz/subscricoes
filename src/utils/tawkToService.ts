/**
 * Tawk.to Chat Service
 * Utility functions to interact with Tawk.to chat widget
 */

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

export class TawkToService {
  /**
   * Check if Tawk.to is loaded and ready
   */
  static isReady(): boolean {
    return typeof window !== 'undefined' && window.Tawk_API && window.Tawk_API.isVisitorEngaged !== undefined;
  }

  /**
   * Show the chat widget
   */
  static showWidget(): void {
    if (this.isReady()) {
      window.Tawk_API.showWidget();
    }
  }

  /**
   * Hide the chat widget
   */
  static hideWidget(): void {
    if (this.isReady()) {
      window.Tawk_API.hideWidget();
    }
  }

  /**
   * Toggle chat widget visibility
   */
  static toggleWidget(): void {
    if (this.isReady()) {
      window.Tawk_API.toggle();
    }
  }

  /**
   * Maximize the chat widget
   */
  static maximizeWidget(): void {
    if (this.isReady()) {
      window.Tawk_API.maximize();
    }
  }

  /**
   * Minimize the chat widget
   */
  static minimizeWidget(): void {
    if (this.isReady()) {
      window.Tawk_API.minimize();
    }
  }

  /**
   * Set visitor information
   */
  static setVisitorInfo(info: {
    name?: string;
    email?: string;
    hash?: string;
    [key: string]: any;
  }): void {
    if (this.isReady()) {
      window.Tawk_API.setAttributes(info);
    }
  }

  /**
   * Add event listener for chat events
   */
  static onLoad(callback: () => void): void {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onLoad = callback;
    }
  }

  /**
   * Add event listener for chat status change
   */
  static onStatusChange(callback: (status: string) => void): void {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onStatusChange = callback;
    }
  }

  /**
   * Add event listener for chat start
   */
  static onChatStarted(callback: () => void): void {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onChatStarted = callback;
    }
  }

  /**
   * Add event listener for chat end
   */
  static onChatEnded(callback: () => void): void {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onChatEnded = callback;
    }
  }

  /**
   * Add event listener for new message
   */
  static onChatMessageVisitor(callback: (message: any) => void): void {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onChatMessageVisitor = callback;
    }
  }

  /**
   * Add event listener for agent message
   */
  static onChatMessageAgent(callback: (message: any) => void): void {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onChatMessageAgent = callback;
    }
  }

  /**
   * Get visitor information
   */
  static getVisitorInfo(): any {
    if (this.isReady()) {
      return window.Tawk_API.getVisitorInfo();
    }
    return null;
  }

  /**
   * Check if visitor is engaged in chat
   */
  static isVisitorEngaged(): boolean {
    if (this.isReady()) {
      return window.Tawk_API.isVisitorEngaged();
    }
    return false;
  }

  /**
   * Get current chat status
   */
  static getStatus(): string {
    if (this.isReady()) {
      return window.Tawk_API.getStatus();
    }
    return 'offline';
  }

  /**
   * Initialize Tawk.to with user context
   */
  static initializeWithUser(user: {
    name: string;
    email: string;
    company?: string;
    plan?: string;
    userId?: string;
  }): void {
    this.onLoad(() => {
      this.setVisitorInfo({
        name: user.name,
        email: user.email,
        company: user.company,
        plan: user.plan,
        userId: user.userId,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Send custom event to Tawk.to
   */
  static addEvent(event: string, metadata?: any): void {
    if (this.isReady()) {
      window.Tawk_API.addEvent(event, metadata);
    }
  }

  /**
   * Add tags to the conversation
   */
  static addTags(tags: string[]): void {
    if (this.isReady()) {
      window.Tawk_API.addTags(tags);
    }
  }

  /**
   * Remove tags from the conversation
   */
  static removeTags(tags: string[]): void {
    if (this.isReady()) {
      window.Tawk_API.removeTags(tags);
    }
  }

  /**
   * Set custom style for the widget
   */
  static setWidgetStyle(style: {
    visibility?: {
      desktop?: {
        position?: 'br' | 'bl' | 'cr' | 'cl';
        xOffset?: number;
        yOffset?: number;
      };
      mobile?: {
        position?: 'br' | 'bl' | 'cr' | 'cl';
        xOffset?: number;
        yOffset?: number;
      };
    };
    [key: string]: any;
  }): void {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.customStyle = style;
    }
  }
}