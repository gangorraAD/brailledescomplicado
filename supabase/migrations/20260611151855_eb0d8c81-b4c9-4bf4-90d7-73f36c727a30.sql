-- Lock down user_roles: only admins can insert/update/delete
CREATE POLICY "Admins inserem papéis"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam papéis"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem papéis"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Lock down book-images storage bucket: read-only public; only admins write
DROP POLICY IF EXISTS "Public can upload book images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update book images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete book images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload book images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update book images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete book images" ON storage.objects;
DROP POLICY IF EXISTS "book-images insert" ON storage.objects;
DROP POLICY IF EXISTS "book-images update" ON storage.objects;
DROP POLICY IF EXISTS "book-images delete" ON storage.objects;

CREATE POLICY "Admins enviam imagens do livro"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'book-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam imagens do livro"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'book-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'book-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem imagens do livro"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'book-images' AND public.has_role(auth.uid(), 'admin'));

-- Restrict SECURITY DEFINER helper functions: only authenticated callers
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_approved(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_approved(uuid) TO authenticated, service_role;