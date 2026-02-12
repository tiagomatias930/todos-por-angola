import { createClient } from "@supabase/supabase-js";
import { ENV } from "@/src/config/env";

// Initialize Supabase client
// Use ENV values with hardcoded fallbacks to prevent "Invalid supabaseUrl" crashes
const supabaseUrl =
  ENV.SUPABASE_URL && ENV.SUPABASE_URL.startsWith("http")
    ? ENV.SUPABASE_URL
    : "https://tsvshwlgkmbiugxyjzzy.supabase.co";

const supabaseAnonKey =
  ENV.SUPABASE_ANON_KEY && ENV.SUPABASE_ANON_KEY.length > 0
    ? ENV.SUPABASE_ANON_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdnNod2xna21iaXVneHlqenp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NjE1NDQsImV4cCI6MjA4NjQzNzU0NH0.PReWpXGmJgEP8plHs8zgSCJtosLz7GmLPIWNUuynckM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types for database queries
export interface RiskArea {
  id: string;
  latitude: number;
  longitude: number;
  category: "infraestrutura" | "seguranca" | "saude";
  description: string;
  imageUrl?: string;
  confirmationCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  province?: string;
  createdAt: string;
  updatedAt: string;
}

// Reusable Supabase queries
export const db = {
  // Risk Areas
  async getRiskAreas(
    filters?: {
      category?: string;
      latitude?: number;
      longitude?: number;
      radius?: number;
    }
  ) {
    let query = supabase.from("risk_areas").select("*");

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching risk areas:", error);
    return data as RiskArea[] | null;
  },

  async createRiskArea(area: Omit<RiskArea, "id" | "createdAt" | "updatedAt">) {
    const { data, error } = await supabase
      .from("risk_areas")
      .insert([area])
      .select()
      .single();

    if (error) console.error("Error creating risk area:", error);
    return data as RiskArea | null;
  },

  async updateRiskArea(id: string, updates: Partial<RiskArea>) {
    const { data, error } = await supabase
      .from("risk_areas")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) console.error("Error updating risk area:", error);
    return data as RiskArea | null;
  },

  // User Profiles
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) console.error("Error fetching user profile:", error);
    return data as UserProfile | null;
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) console.error("Error updating user profile:", error);
    return data as UserProfile | null;
  },

  // Confirmations
  async confirmRiskArea(riskAreaId: string, userId: string) {
    const { data, error } = await supabase
      .from("confirmations")
      .insert([{ riskAreaId, userId }])
      .select()
      .single();

    if (error) console.error("Error confirming risk area:", error);
    return data;
  },

  // Upload image to Supabase Storage
  async uploadImage(
    file: { uri: string; name: string; type: string },
    userId: string
  ) {
    const fileName = `${userId}/${Date.now()}_${file.name}`;

    try {
      // Convert URI to blob
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from("risk_images")
        .upload(fileName, blob, {
          contentType: file.type,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("risk_images")
        .getPublicUrl(fileName);

      return publicData?.publicUrl || "";
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  },
};
