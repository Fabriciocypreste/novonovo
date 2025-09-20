import { createClient } from '@supabase/supabase-js';

// These would be set in your environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_plan: 'starter' | 'professional' | 'enterprise' | null;
          subscription_status: 'active' | 'inactive' | 'trial' | 'cancelled' | null;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_plan?: 'starter' | 'professional' | 'enterprise' | null;
          subscription_status?: 'active' | 'inactive' | 'trial' | 'cancelled' | null;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_plan?: 'starter' | 'professional' | 'enterprise' | null;
          subscription_status?: 'active' | 'inactive' | 'trial' | 'cancelled' | null;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          theme: string | null;
          project_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          theme?: string | null;
          project_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          theme?: string | null;
          project_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string;
          content_type: 'post' | 'video' | 'landing_page' | 'image';
          platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | null;
          content_data: any | null;
          scheduled_at: string | null;
          status: 'draft' | 'scheduled' | 'published' | 'archived';
          engagement_estimate: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          title: string;
          content_type: 'post' | 'video' | 'landing_page' | 'image';
          platform?: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | null;
          content_data?: any | null;
          scheduled_at?: string | null;
          status?: 'draft' | 'scheduled' | 'published' | 'archived';
          engagement_estimate?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          title?: string;
          content_type?: 'post' | 'video' | 'landing_page' | 'image';
          platform?: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin' | null;
          content_data?: any | null;
          scheduled_at?: string | null;
          status?: 'draft' | 'scheduled' | 'published' | 'archived';
          engagement_estimate?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'starter' | 'professional' | 'enterprise';
          status: 'active' | 'inactive' | 'trial' | 'cancelled';
          current_period_start: string;
          current_period_end: string;
          trial_ends_at: string | null;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: 'starter' | 'professional' | 'enterprise';
          status?: 'active' | 'inactive' | 'trial' | 'cancelled';
          current_period_start: string;
          current_period_end: string;
          trial_ends_at?: string | null;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: 'starter' | 'professional' | 'enterprise';
          status?: 'active' | 'inactive' | 'trial' | 'cancelled';
          current_period_start?: string;
          current_period_end?: string;
          trial_ends_at?: string | null;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper functions
export const authHelpers = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
};

export const dbHelpers = {
  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Project operations
  async getProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createProject(project: Database['public']['Tables']['projects']['Insert']) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    return { data, error };
  },

  // Content operations
  async getContentItems(projectId: string) {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createContentItem(contentItem: Database['public']['Tables']['content_items']['Insert']) {
    const { data, error } = await supabase
      .from('content_items')
      .insert(contentItem)
      .select()
      .single();
    return { data, error };
  },

  // Subscription operations
  async getSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  async createSubscription(subscription: Database['public']['Tables']['subscriptions']['Insert']) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    return { data, error };
  },

  async updateSubscription(subscriptionId: string, updates: Database['public']['Tables']['subscriptions']['Update']) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', subscriptionId)
      .select()
      .single();
    return { data, error };
  },
};
