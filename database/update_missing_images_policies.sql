-- Atualizar políticas RLS para permitir acesso de scripts
DROP POLICY IF EXISTS "Allow authenticated users to view missing images" ON missing_images;
DROP POLICY IF EXISTS "Allow authenticated users to insert missing images" ON missing_images;
DROP POLICY IF EXISTS "Allow authenticated users to update missing images" ON missing_images;

CREATE POLICY "Allow all to view missing images" ON missing_images
    FOR SELECT USING (true);

CREATE POLICY "Allow all to insert missing images" ON missing_images
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all to update missing images" ON missing_images
    FOR UPDATE USING (true);