export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: TelegramInitData;
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
      backgroundColor?: string;
      textColor?: string;
      hintColor?: string;
      linkColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
    };
    isExpanded: boolean;
    isClosingConfirmationEnabled: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    BackButton: {
      isVisible: boolean;
      show(): void;
      hide(): void;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
    };
    MainButton: {
      isVisible: boolean;
      text: string;
      color: string;
      show(): void;
      hide(): void;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
    };
    showAlert(message: string): void;
    ready(): void;
  }

  interface TelegramInitData {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat_instance?: string;
    query_id?: string;
    auth_date?: string;
    hash?: string;
  }
}
