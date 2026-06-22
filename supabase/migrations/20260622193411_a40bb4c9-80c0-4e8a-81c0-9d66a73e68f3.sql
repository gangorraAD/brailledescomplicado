DROP POLICY IF EXISTS "Public upload book-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update book-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete book-images" ON storage.objects;

CREATE POLICY "Authenticated upload book-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'book-images');

CREATE POLICY "Authenticated update book-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'book-images')
WITH CHECK (bucket_id = 'book-images');

CREATE POLICY "Authenticated delete book-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'book-images');