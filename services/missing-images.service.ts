import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface MissingImage {
  id?: string;
  image_name: string;
  image_url: string;
  monster_name: string;
  first_detected_at?: string;
  last_detected_at?: string;
  detection_count?: number;
  is_resolved?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Busca todas as imagens ausentes não resolvidas
 */
export async function getMissingImages(): Promise<MissingImage[]> {
  try {
    const { data, error } = await supabase
      .from('missing_images')
      .select('*')
      .eq('is_resolved', false)
      .order('detection_count', { ascending: false });

    if (error) {
      console.error('Erro ao buscar imagens ausentes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar imagens ausentes:', error);
    return [];
  }
}

/**
 * Marca uma imagem como resolvida
 */
export async function markImageAsResolved(imageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('missing_images')
      .update({ is_resolved: true })
      .eq('id', imageId);

    if (error) {
      console.error('Erro ao marcar imagem como resolvida:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao marcar imagem como resolvida:', error);
    return false;
  }
}

/**
 * Registra uma nova imagem ausente ou atualiza existente
 */
export async function reportMissingImage(
  imageName: string,
  imageUrl: string,
  monsterName: string
): Promise<boolean> {
  try {
    // Verifica se já existe
    const { data: existing, error: selectError } = await supabase
      .from('missing_images')
      .select('id, detection_count')
      .eq('image_name', imageName)
      .eq('is_resolved', false)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Erro ao verificar imagem existente:', selectError);
      return false;
    }

    if (existing) {
      // Atualiza existente
      const { error: updateError } = await supabase
        .from('missing_images')
        .update({
          last_detected_at: new Date().toISOString(),
          detection_count: existing.detection_count + 1
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Erro ao atualizar registro:', updateError);
        return false;
      }
    } else {
      // Cria novo
      const { error: insertError } = await supabase
        .from('missing_images')
        .insert({
          image_name: imageName,
          image_url: imageUrl,
          monster_name: monsterName
        });

      if (insertError) {
        console.error('Erro ao inserir registro:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao reportar imagem ausente:', error);
    return false;
  }
}

/**
 * Busca estatísticas das imagens ausentes
 */
export async function getMissingImagesStats(): Promise<{
  total: number;
  resolved: number;
  pending: number;
  mostDetected: MissingImage[];
}> {
  try {
    const { data: allImages, error: allError } = await supabase
      .from('missing_images')
      .select('*');

    if (allError) {
      console.error('Erro ao buscar estatísticas:', allError);
      return { total: 0, resolved: 0, pending: 0, mostDetected: [] };
    }

    const total = allImages?.length || 0;
    const resolved = allImages?.filter(img => img.is_resolved).length || 0;
    const pending = total - resolved;

    const mostDetected = allImages
      ?.filter(img => !img.is_resolved)
      ?.sort((a, b) => b.detection_count - a.detection_count)
      ?.slice(0, 5) || [];

    return {
      total,
      resolved,
      pending,
      mostDetected
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { total: 0, resolved: 0, pending: 0, mostDetected: [] };
  }
}