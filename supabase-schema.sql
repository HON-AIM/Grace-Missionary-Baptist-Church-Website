-- GMBC Admin Panel - Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Announcements Table
-- Migration for existing DB: ALTER TABLE announcements ADD COLUMN image TEXT, ADD COLUMN is_pinned BOOLEAN DEFAULT false;
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image TEXT,
  is_pinned BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sermons Table
-- Migration for existing DB:
--   ALTER TABLE sermons ADD COLUMN thumbnail TEXT;
--   ALTER TABLE sermons RENAME COLUMN speaker TO pastor;
--   ALTER TABLE sermons RENAME COLUMN passage TO scripture;
--   ALTER TABLE sermons ADD COLUMN youtube_url TEXT;
--   ALTER TABLE sermons DROP COLUMN audio_url;
--   ALTER TABLE sermons DROP COLUMN series;
--   ALTER TABLE sermons DROP COLUMN video_url;
CREATE TABLE sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  pastor TEXT NOT NULL,
  scripture TEXT DEFAULT '',
  youtube_url TEXT,
  description TEXT DEFAULT '',
  thumbnail TEXT,
  date DATE NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Gallery Table
-- Migration for existing DB:
--   ALTER TABLE gallery ADD COLUMN caption TEXT DEFAULT '';
--   ALTER TABLE gallery DROP COLUMN title;
--   ALTER TABLE gallery DROP COLUMN description;
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Sunday Service',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Events Table
-- Migration for existing DB:
--   ALTER TABLE events ADD COLUMN flyer TEXT;
--   ALTER TABLE events DROP COLUMN type;
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  flyer TEXT,
  date DATE NOT NULL,
  time TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Homepage Content Table
CREATE TABLE homepage_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Homepage Settings Table (single row)
CREATE TABLE homepage_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title TEXT DEFAULT '',
  hero_subtitle TEXT DEFAULT '',
  weekly_scripture TEXT DEFAULT '',
  weekly_scripture_ref TEXT DEFAULT '',
  pastor_message TEXT DEFAULT '',
  announcement_banner TEXT DEFAULT '',
  announcement_banner_active BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_homepage_settings_updated_at
  BEFORE UPDATE ON homepage_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON homepage_settings
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public can read homepage settings" ON homepage_settings
  FOR SELECT
  USING (true);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sermons_updated_at
  BEFORE UPDATE ON sermons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON homepage_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can do everything
CREATE POLICY "Allow all for authenticated users" ON announcements
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON sermons
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON gallery
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON events
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON homepage_content
  USING (true)
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies: Public can only read published content
CREATE POLICY "Public can read published announcements" ON announcements
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published sermons" ON sermons
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read published events" ON events
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read gallery" ON gallery
  FOR SELECT
  USING (true);

CREATE POLICY "Public can read active homepage content" ON homepage_content
  FOR SELECT
  USING (is_active = true);
