declare module "@supabase/auth-js" {
  export interface SignInWithPasswordCredentials {
    email: string;
    password: string;
  }

  export interface AuthTokenResponsePassword {
    data: { session: any; user: any };
    error: any;
  }

  export interface AuthUserResponse {
    data: { user: any };
    error: any;
  }

  export class GoTrueClient {
    signInWithPassword(
      credentials: SignInWithPasswordCredentials
    ): Promise<AuthTokenResponsePassword>;
    signUp(credentials: {
      email: string;
      password: string;
    }): Promise<AuthTokenResponsePassword>;
    signOut(): Promise<{ error: any }>;
    getUser(jwt?: string): Promise<AuthUserResponse>;
    getSession(): Promise<{ data: { session: any }; error: any }>;
    setSession(params: {
      access_token: string;
      refresh_token: string;
    }): Promise<{ data: { session: any }; error: any }>;
    exchangeCodeForSession(
      code: string
    ): Promise<{ data: { session: any }; error: any }>;
    resetPasswordForEmail(
      email: string,
      options?: { redirectTo?: string }
    ): Promise<{ data: any; error: any }>;
    updateUser(
      attributes: { password?: string; email?: string; data?: any },
      options?: { emailRedirectTo?: string }
    ): Promise<{ data: { user: any }; error: any }>;
    onAuthStateChange(
      callback: (
        event: string,
        session: any
      ) => void
    ): { data: { subscription: { unsubscribe: () => void } } };
    admin: any;
  }

  export class AuthAdminApi {}

  export default GoTrueClient;
  export const AuthClient: typeof GoTrueClient;
}
