import { createClient } from "@/lib/supabase/client";
import { LoginCredentials, SignUpCredentials } from "@/types/auth.types";

export class AuthService {
  private supabase = createClient();

  async signInWithEmail({ email, password }: LoginCredentials) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  }

  async signUp({ email, password }: SignUpCredentials) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }
}

export const authService = new AuthService();
