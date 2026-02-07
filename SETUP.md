# Nova Angola – Setup Guide

This guide walks you through setting up **Nova Angola** with Gemini AI and Supabase backend.

## Prerequisites

- Node.js 18+ and npm 8+
- Expo CLI (optional): `npm install -g expo-cli`
- A Gemini API key (free tier available)
- A Supabase project (free tier available)

## Step 1: Clone and Install

```bash
git clone https://github.com/tiagomatias930/todos-por-angola.git
cd todos-por-angola/mapazzz
npm install
```

## Step 2: Configure Gemini AI

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click **"Get API Key"** and create a new API key
3. Copy the key and save it (you'll need it next)

## Step 3: Setup Supabase

1. Go to [Supabase](https://supabase.com/) and sign up
2. Create a new project (free tier is sufficient)
3. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxx.supabase.co`)
   - **Anon Key** (under "Project API keys")

### Create Database Tables

In your Supabase dashboard, run the following SQL to create tables:

```sql
-- Risk Areas Table
CREATE TABLE risk_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('infraestrutura', 'seguranca', 'saude')),
  description TEXT,
  image_url TEXT,
  confirmation_count INTEGER DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  province TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Confirmations Table (tracks user validations)
CREATE TABLE confirmations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  risk_area_id UUID NOT NULL REFERENCES risk_areas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(risk_area_id, user_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE risk_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;

-- Create Storage Bucket for Images
INSERT INTO storage.buckets (id, name) VALUES ('risk_images', 'risk_images');

-- Set public access to images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'risk_images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'risk_images' AND auth.role() = 'authenticated');
```

## Step 4: Create .env.local File

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in your credentials:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 5: Run the App

```bash
# Start Expo development server
npx expo start

# Options:
# - Press 'a' to open Android Emulator
# - Press 'i' to open iOS Simulator (macOS only)
# - Press 'w' to open web version
# - Press 'j' to open Expo debugger
```

## Step 6: Test the Features

### 1. **Health Assistant**
- Navigate to "Saúde & Primeiros Socorros"
- Enter sample symptoms like "Febre alta, dor de cabeça"
- Gemini will analyze and provide health guidance

### 2. **Risk Reporting**
- Tap the alert button in the map
- Capture an image of a risk area
- Describe the issue
- Gemini will classify the image and save to Supabase

### 3. **Risk Map**
- View reported areas on the interactive map
- Filter by category
- Tap areas to see details and confirm

## Troubleshooting

### "GEMINI_API_KEY not configured"
- Ensure you've added the key to `.env.local`
- Restart the Expo server (press 'r' in terminal)

### "Supabase connection failed"
- Check that `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are correct
- Verify your Supabase project is active (check dashboard)

### Image upload fails
- Ensure the `risk_images` storage bucket exists in Supabase
- Check that the user is authenticated
- Verify the bucket has public read access

## Next Steps

1. **Customize the app** with your branding (logos, colors, text)
2. **Set up authentication** by configuring email verification in Supabase
3. **Add more AI features** using Gemini for other use cases
4. **Deploy** to production (EAS Build recommended for Expo apps)

## Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev/)

## Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/tiagomatias930/todos-por-angola/issues)
2. Review Expo, Gemini, and Supabase documentation
3. Check the `.env.example` file for required configuration

---

**Happy building! 🚀 Nova Angola is ready to make a difference.**
