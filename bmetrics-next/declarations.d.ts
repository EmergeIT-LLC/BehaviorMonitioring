declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare module 'js-cookies' {
    interface Cookies {
      set(name: string, value: string, options?: {
        expires?: number | Date;
        path?: string;
        domain?: string;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
      }): void;
  
      get(name: string): string | undefined;
      getJSON(name: string): any;
      remove(name: string, options?: { path?: string }): void;
    }
  
    const cookies: Cookies;
    export default cookies;
}