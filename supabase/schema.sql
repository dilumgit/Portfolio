-- =====================================================
-- PORTFOLIO CMS - COMPLETE DATABASE SCHEMA
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT '',
  professional_title TEXT NOT NULL DEFAULT '',
  tagline TEXT,
  about_me TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  profile_image_url TEXT,
  hero_heading TEXT,
  hero_subtitle TEXT,
  hero_description TEXT,
  hero_cta_text TEXT,
  hero_cta_url TEXT,
  hero_secondary_cta_text TEXT,
  hero_secondary_cta_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert a default profile row
INSERT INTO profiles (full_name, professional_title)
VALUES ('Your Name', 'AI & Machine Learning Engineer')
ON CONFLICT DO NOTHING;

-- =====================================================
-- EDUCATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  grade TEXT,
  logo_url TEXT,
  location TEXT,
  relevant_coursework TEXT[],
  achievements TEXT[],
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUALIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS qualifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  institution TEXT,
  issuing_organization TEXT,
  issue_date TEXT,
  description TEXT,
  certificate_url TEXT,
  credential_id TEXT,
  logo_url TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SKILL CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER CHECK (level >= 0 AND level <= 100),
  icon_url TEXT,
  years_of_experience INTEGER,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  image_url TEXT,
  category TEXT,
  technologies TEXT[],
  github_url TEXT,
  live_url TEXT,
  documentation_url TEXT,
  paper_url TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  key_features TEXT[],
  challenges TEXT,
  solutions TEXT,
  results TEXT,
  my_role TEXT,
  team_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECT IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESEARCH TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  abstract TEXT,
  research_area TEXT,
  research_question TEXT,
  methodology TEXT,
  technologies TEXT[],
  publication_status TEXT,
  conference_journal TEXT,
  publication_date TEXT,
  paper_url TEXT,
  doi TEXT,
  github_url TEXT,
  dataset_url TEXT,
  image_url TEXT,
  description TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CERTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date TEXT,
  expiry_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  description TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EXPERIENCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo_url TEXT,
  employment_type TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  location TEXT,
  description TEXT,
  responsibilities TEXT[],
  technologies TEXT[],
  achievements TEXT[],
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  organization TEXT,
  image_url TEXT,
  certificate_url TEXT,
  url TEXT,
  category TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SOCIAL LINKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('site_title', 'Portfolio | AI & ML Engineer'),
  ('meta_description', 'Personal portfolio showcasing AI, ML, and software engineering projects'),
  ('meta_keywords', 'AI, Machine Learning, Software Engineer, Portfolio'),
  ('site_url', 'https://yoursite.com'),
  ('google_analytics_id', '')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESUME TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS resume (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE research ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: All tables (anyone can read portfolio data)
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can read education" ON education FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read qualifications" ON qualifications FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read skill_categories" ON skill_categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read skills" ON skills FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read project_images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public can read research" ON research FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read certifications" ON certifications FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read experience" ON experience FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read achievements" ON achievements FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read services" ON services FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read social_links" ON social_links FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read resume" ON resume FOR SELECT USING (is_active = true);

-- PUBLIC INSERT: Contact messages (anyone can submit contact form)
CREATE POLICY "Public can insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- SERVICE ROLE (Admin) can do everything — service role bypasses RLS by default
-- The admin dashboard uses the service role key via createAdminClient()

-- =====================================================
-- STORAGE BUCKETS (Run in Supabase Storage settings)
-- =====================================================
-- Create these buckets in your Supabase Storage dashboard:
-- 1. "portfolio-images" (public) - for profile photos, project images, etc.
-- 2. "resume" (public) - for CV/resume files

-- Or run these SQL commands:
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resume', 'resume', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public access
CREATE POLICY "Public can read portfolio-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Public can read resume" ON storage.objects
  FOR SELECT USING (bucket_id = 'resume');

-- =====================================================
-- SAMPLE DATA (Optional - Remove in production)
-- =====================================================

-- Update profile with sample data
UPDATE profiles SET
  full_name = 'Alex Johnson',
  professional_title = 'AI & Machine Learning Engineer',
  tagline = 'Building intelligent systems that make a difference',
  about_me = 'I am a passionate AI/ML engineer with expertise in deep learning, natural language processing, and computer vision. I love building systems that push the boundaries of what is possible with artificial intelligence.',
  location = 'San Francisco, CA',
  email = 'alex@example.com',
  github_url = 'https://github.com/alexjohnson',
  linkedin_url = 'https://linkedin.com/in/alexjohnson',
  hero_subtitle = 'AI & ML Engineer',
  hero_cta_text = 'View My Work',
  hero_cta_url = '#projects',
  hero_secondary_cta_text = 'Get In Touch',
  hero_description = 'Passionate about building intelligent systems that solve real-world problems.'
WHERE id = (SELECT id FROM profiles LIMIT 1);

-- Sample education
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, is_current, description, grade, is_visible, display_order)
VALUES
  ('Stanford University', 'Master of Science', 'Artificial Intelligence', '2022-09', NULL, true, 'Focusing on deep learning, NLP, and computer vision.', '4.0/4.0', true, 0),
  ('University of California, Berkeley', 'Bachelor of Science', 'Computer Science', '2018-09', '2022-05', false, 'Graduated with honors. Specialized in algorithms and machine learning.', '3.9/4.0', true, 1)
ON CONFLICT DO NOTHING;

-- Sample skill categories
INSERT INTO skill_categories (name, description, display_order, is_visible)
VALUES
  ('Machine Learning', 'ML frameworks and algorithms', 0, true),
  ('Programming Languages', 'Core programming languages', 1, true),
  ('Deep Learning', 'Neural network frameworks', 2, true),
  ('Cloud & DevOps', 'Cloud platforms and tools', 3, true)
ON CONFLICT DO NOTHING;

-- Sample skills (will need the category IDs - run after inserting categories)
-- You can add skills through the admin dashboard after setup.

-- Sample services
INSERT INTO services (title, description, icon, display_order, is_visible)
VALUES
  ('Machine Learning', 'Building and deploying ML models for classification, regression, and clustering.', '🤖', 0, true),
  ('Deep Learning', 'Neural networks for computer vision, NLP, and generative AI.', '🧠', 1, true),
  ('Software Engineering', 'Full-stack development with modern frameworks and best practices.', '💻', 2, true),
  ('Data Science', 'Data analysis, visualization, and insight extraction.', '📊', 3, true),
  ('Research', 'Academic and applied AI/ML research.', '🔬', 4, true),
  ('Generative AI', 'LLMs, diffusion models, and AI-powered applications.', '✨', 5, true),
  ('NLP', 'Natural language processing and text analysis.', '💬', 6, true),
  ('Computer Vision', 'Image recognition, object detection, and visual AI.', '👁️', 7, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE! 
-- =====================================================
-- Next steps:
-- 1. Go to Supabase Authentication → Users → Create a new user (your admin account)
-- 2. Update .env.local with your Supabase URL, anon key, and service role key
-- 3. Run: npm run dev
-- 4. Visit http://localhost:3000/admin/login
-- =====================================================
