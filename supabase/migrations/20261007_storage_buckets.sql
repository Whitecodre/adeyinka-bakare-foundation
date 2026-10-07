-- Enable storage extension
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('public-images', 'public-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']),
  ('public-media', 'public-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'application/pdf']),
  ('private-documents', 'private-documents', false, 104857600, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('news-images', 'news-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('programme-images', 'programme-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('event-images', 'event-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('testimonial-media', 'testimonial-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']),
  ('content-images', 'content-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('social-icons', 'social-icons', true, 524288, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('logo-assets', 'logo-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('admin-uploads', 'admin-uploads', false, 104857600, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for public-images bucket
-- Allow anyone to view public images
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public-images');

-- Allow authenticated users to upload public images
CREATE POLICY "Authenticated users can upload public images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-images');

-- Allow image uploaders to update their own images
CREATE POLICY "Image uploaders can update their own public images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'public-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow image uploaders to delete their own images
CREATE POLICY "Image uploaders can delete their own public images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policies for public-media bucket
-- Allow anyone to view public media
CREATE POLICY "Public media is viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public-media');

-- Allow authenticated users to upload public media
CREATE POLICY "Authenticated users can upload public media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-media');

-- Allow media uploaders to update their own media
CREATE POLICY "Media uploaders can update their own public media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-media' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'public-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow media uploaders to delete their own media
CREATE POLICY "Media uploaders can delete their own public media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policies for private-documents bucket
-- Only allow authenticated users to view private documents
CREATE POLICY "Authenticated users can view private documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'private-documents');

-- Allow authenticated users to upload private documents
CREATE POLICY "Authenticated users can upload private documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'private-documents');

-- Allow document uploaders to update their own documents
CREATE POLICY "Document uploaders can update their own private documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'private-documents' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'private-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow document uploaders to delete their own documents
CREATE POLICY "Document uploaders can delete their own private documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'private-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Grant admin users full access to all buckets
CREATE POLICY "Admins have full access to all storage"
ON storage.objects FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- Additional policies for new buckets (news-images, programme-images, event-images, testimonial-media, content-images, social-icons, logo-assets, admin-uploads)
-- These follow the same pattern as public-images for public buckets and private-documents for private buckets

-- News Images (public)
CREATE POLICY "News images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Image uploaders can update their own news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'news-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Image uploaders can delete their own news images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Programme Images (public)
CREATE POLICY "Programme images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'programme-images');

CREATE POLICY "Authenticated users can upload programme images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'programme-images');

CREATE POLICY "Image uploaders can update their own programme images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'programme-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'programme-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Image uploaders can delete their own programme images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'programme-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Event Images (public)
CREATE POLICY "Event images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Image uploaders can update their own event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Image uploaders can delete their own event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Testimonial Media (public)
CREATE POLICY "Testimonial media is viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'testimonial-media');

CREATE POLICY "Authenticated users can upload testimonial media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonial-media');

CREATE POLICY "Media uploaders can update their own testimonial media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'testimonial-media' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'testimonial-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Media uploaders can delete their own testimonial media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonial-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Content Images (public)
CREATE POLICY "Content images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-images');

CREATE POLICY "Authenticated users can upload content images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images');

CREATE POLICY "Image uploaders can update their own content images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'content-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Image uploaders can delete their own content images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Social Icons (public)
CREATE POLICY "Social icons are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'social-icons');

CREATE POLICY "Authenticated users can upload social icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'social-icons');

CREATE POLICY "Image uploaders can update their own social icons"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'social-icons' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'social-icons' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Image uploaders can delete their own social icons"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'social-icons' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Logo Assets (public)
CREATE POLICY "Logo assets are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logo-assets');

CREATE POLICY "Authenticated users can upload logo assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logo-assets');

CREATE POLICY "Image uploaders can update their own logo assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logo-assets' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'logo-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Image uploaders can delete their own logo assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logo-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admin Uploads (private)
CREATE POLICY "Authenticated users can view admin uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'admin-uploads');

CREATE POLICY "Authenticated users can upload admin uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'admin-uploads');

CREATE POLICY "Uploaders can update their own admin uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'admin-uploads' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'admin-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Uploaders can delete their own admin uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'admin-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
