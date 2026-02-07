// Environment configuration for Nova Angola
// Set these values in your .env.local or environment variables

export const ENV = {
  // Gemini AI Configuration
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models",

  // Supabase Configuration
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",

  // Backend API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.novaangola.local",

  // App Configuration
  APP_NAME: "Nova Angola",
  APP_VERSION: "1.0.0",
};

// Validate required environment variables
export const validateEnv = () => {
  const required = ["GEMINI_API_KEY", "SUPABASE_URL", "SUPABASE_ANON_KEY"];
  const missing = required.filter((key) => !ENV[key as keyof typeof ENV]);

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(", ")}. Some features may not work correctly.`
    );
  }
};
