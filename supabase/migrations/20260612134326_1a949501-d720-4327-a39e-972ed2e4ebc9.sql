DO $$ BEGIN
  CREATE TYPE public.material_kind AS ENUM ('documento','atividade','imagem','audio','video','outro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  kind public.material_kind NOT NULL DEFAULT 'documento',
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text,
  is_public boolean NOT NULL DEFAULT false,
  recipient_id uuid,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT materials_target_check CHECK (is_public = true OR recipient_id IS NOT NULL)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.materials TO authenticated;
GRANT ALL ON public.materials TO service_role;

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins veem todos os materiais"
ON public.materials FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins inserem materiais"
ON public.materials FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND created_by = auth.uid());

CREATE POLICY "Admins atualizam materiais"
ON public.materials FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem materiais"
ON public.materials FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuarios aprovados veem materiais visiveis"
ON public.materials FOR SELECT TO authenticated
USING (
  public.is_approved(auth.uid())
  AND (is_public = true OR recipient_id = auth.uid())
);

CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON public.materials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies bucket privado 'materials'
CREATE POLICY "Admins upload materials"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update materials"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete materials"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read materials"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Aprovados leem materiais autorizados"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'materials'
  AND public.is_approved(auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.materials m
    WHERE m.file_path = storage.objects.name
      AND (m.is_public = true OR m.recipient_id = auth.uid())
  )
);