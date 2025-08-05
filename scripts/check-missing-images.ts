import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Carrega variáveis de ambiente do .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!');
  console.error('Certifique-se que o arquivo .env.local existe com:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface MissingImage {
  image_name: string;
  image_url: string;
  monster_name: string;
}

/**
 * Verifica se uma imagem existe no storage do Supabase
 */
async function checkImageExists(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Erro ao verificar imagem: ${imageUrl}`, error);
    return false;
  }
}

/**
 * Extrai nomes de monstros únicos de todos os registros
 */
async function getAllMonsterNames(): Promise<string[]> {
  try {
    const { data: records, error } = await supabase
      .from('records')
      .select('data')
      .not('data', 'is', null);

    if (error) {
      console.error('Erro ao buscar registros:', error);
      return [];
    }

    const monsterNames = new Set<string>();

    records?.forEach((record) => {
      const data = record.data;
      if (data && data['Killed Monsters'] && Array.isArray(data['Killed Monsters'])) {
        data['Killed Monsters'].forEach((monster: any) => {
          if (monster.Name) {
            monsterNames.add(monster.Name);
          }
        });
      }
    });

    return Array.from(monsterNames);
  } catch (error) {
    console.error('Erro ao extrair nomes de monstros:', error);
    return [];
  }
}

/**
 * Gera URL da imagem baseada no nome do monstro
 */
function generateImageUrl(monsterName: string): string {
  const imageName = monsterName.toLowerCase().replace(/\s+/g, '_');
  return `https://pdscifxfuisrczpvofat.supabase.co/storage/v1/object/public/imagens-tibia/${imageName}.gif`;
}

/**
 * Salva ou atualiza imagem ausente na tabela
 */
async function saveMissingImage(missingImage: MissingImage): Promise<void> {
  try {
    // Verifica se a imagem já está registrada
    const { data: existing, error: selectError } = await supabase
      .from('missing_images')
      .select('id, detection_count')
      .eq('image_name', missingImage.image_name)
      .eq('is_resolved', false)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Erro ao verificar imagem existente:', selectError);
      return;
    }

    if (existing) {
      // Atualiza registro existente
      const { error: updateError } = await supabase
        .from('missing_images')
        .update({
          last_detected_at: new Date().toISOString(),
          detection_count: existing.detection_count + 1
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Erro ao atualizar registro:', updateError);
      } else {
        console.log(`Atualizado: ${missingImage.monster_name} (${existing.detection_count + 1}x)`);
      }
    } else {
      // Cria novo registro
      const { error: insertError } = await supabase
        .from('missing_images')
        .insert({
          image_name: missingImage.image_name,
          image_url: missingImage.image_url,
          monster_name: missingImage.monster_name
        });

      if (insertError) {
        console.error('Erro ao inserir registro:', insertError);
      } else {
        console.log(`Registrado: ${missingImage.monster_name}`);
      }
    }
  } catch (error) {
    console.error('Erro ao salvar imagem ausente:', error);
  }
}

/**
 * Verifica se imagens previamente ausentes agora existem e as marca como resolvidas
 */
async function checkResolvedImages(): Promise<void> {
  try {
    const { data: missingImages, error } = await supabase
      .from('missing_images')
      .select('*')
      .eq('is_resolved', false);

    if (error) {
      console.error('Erro ao buscar imagens ausentes:', error);
      return;
    }

    if (!missingImages || missingImages.length === 0) {
      console.log('📋 Nenhuma imagem ausente registrada anteriormente');
      return;
    }

    console.log(`🔄 Verificando ${missingImages.length} imagens previamente ausentes...`);
    
    let resolvedCount = 0;

    for (const missing of missingImages) {
      const exists = await checkImageExists(missing.image_url);
      
      if (exists) {
        // Marca como resolvida
        const { error: updateError } = await supabase
          .from('missing_images')
          .update({ is_resolved: true })
          .eq('id', missing.id);

        if (updateError) {
          console.error(`Erro ao marcar como resolvida: ${missing.monster_name}`, updateError);
        } else {
          console.log(`✅ Resolvida: ${missing.monster_name} (${missing.image_name})`);
          resolvedCount++;
        }
      }

      // Delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`🎉 ${resolvedCount} imagens foram resolvidas!`);
  } catch (error) {
    console.error('Erro ao verificar imagens resolvidas:', error);
  }
}

/**
 * Função principal para verificar imagens ausentes
 */
export async function checkMissingImages(): Promise<void> {
  console.log('🔍 Iniciando verificação de imagens ausentes...');
  
  // Primeiro verifica se imagens previamente ausentes agora existem
  await checkResolvedImages();
  
  const monsterNames = await getAllMonsterNames();
  console.log(`\n📊 Encontrados ${monsterNames.length} monstros únicos`);

  if (monsterNames.length === 0) {
    console.log('❌ Nenhum monstro encontrado nos registros');
    return;
  }

  const missingImages: MissingImage[] = [];
  let checkedCount = 0;

  console.log('🔍 Verificando existência das imagens...');

  for (const monsterName of monsterNames) {
    const imageUrl = generateImageUrl(monsterName);
    const imageName = monsterName.toLowerCase().replace(/\s+/g, '_') + '.gif';
    
    checkedCount++;
    console.log(`🔍 [${checkedCount}/${monsterNames.length}] Verificando: ${monsterName}`);
    
    const exists = await checkImageExists(imageUrl);
    
    if (!exists) {
      const missingImage: MissingImage = {
        image_name: imageName,
        image_url: imageUrl,
        monster_name: monsterName
      };
      
      missingImages.push(missingImage);
      await saveMissingImage(missingImage);
    }

    // Delay para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Verificação concluída:`);
  console.log(`📊 Total verificado: ${monsterNames.length}`);
  console.log(`❌ Imagens ausentes: ${missingImages.length}`);
  
  if (missingImages.length > 0) {
    console.log('\n🚨 Imagens ausentes encontradas:');
    missingImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img.monster_name} (${img.image_name})`);
    });
  }
}

// Se executado diretamente
if (require.main === module) {
  checkMissingImages()
    .then(() => {
      console.log('🎉 Script finalizado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro no script:', error);
      process.exit(1);
    });
}