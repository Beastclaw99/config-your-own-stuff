-- Add new fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[],
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Add comments
COMMENT ON COLUMN public.profiles.location IS 'Professional''s location for job matching';
COMMENT ON COLUMN public.profiles.phone IS 'Contact phone number';
COMMENT ON COLUMN public.profiles.portfolio_urls IS 'Array of portfolio image URLs';
COMMENT ON COLUMN public.profiles.is_available IS 'Whether the professional is currently available for work';
COMMENT ON COLUMN public.profiles.verification_status IS 'Status of professional verification (pending, verified, rejected)';
COMMENT ON COLUMN public.profiles.hourly_rate IS 'Professional''s hourly rate';
COMMENT ON COLUMN public.profiles.years_experience IS 'Years of professional experience';
COMMENT ON COLUMN public.profiles.bio IS 'Professional''s biography';
COMMENT ON COLUMN public.profiles.certifications IS 'Array of professional certifications';

-- Create storage bucket for portfolio images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for portfolio images
CREATE POLICY "Portfolio images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Users can upload their own portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  auth.uid() = owner
);

CREATE POLICY "Users can update their own portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-images' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images' AND
  auth.uid() = owner
); 