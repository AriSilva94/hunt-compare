import { createClient } from "@/lib/supabase/client";
import { 
  DatabaseCharacter, 
  CreateCharacterDTO, 
  UpdateCharacterDTO,
  SavedCharacter,
  TibiaCharacter 
} from "@/types/character.types";
import { characterService } from "@/services/character.service";

interface ICharactersService {
  createCharacter(userId: string, characterData: CreateCharacterDTO): Promise<DatabaseCharacter>;
  getUserCharacters(userId: string): Promise<DatabaseCharacter[]>;
  updateCharacter(id: string, userId: string, data: UpdateCharacterDTO): Promise<DatabaseCharacter>;
  deleteCharacter(id: string, userId: string): Promise<void>;
  setActiveCharacter(id: string, userId: string): Promise<void>;
  getUserCharactersWithRefresh(userId: string): Promise<DatabaseCharacter[]>;
}

export class CharactersService implements ICharactersService {
  private readonly MAX_CHARACTERS = 5;
  private readonly UPDATE_INTERVAL_SECONDS = 3 * 60 * 60; // 3 horas em segundos

  async createCharacter(userId: string, characterData: CreateCharacterDTO): Promise<DatabaseCharacter> {
    const supabase = createClient();

    // Verificar se usuário já atingiu o limite
    const { count, error: countError } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      throw new Error(`Erro ao verificar personagens: ${countError.message}`);
    }

    if (count !== null && count >= this.MAX_CHARACTERS) {
      throw new Error(`Você já atingiu o limite de ${this.MAX_CHARACTERS} personagens`);
    }

    // Verificar se personagem já existe para este usuário
    const { data: existing, error: existingError } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', userId)
      .eq('name', characterData.name)
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Erro ao verificar personagem existente: ${existingError.message}`);
    }

    if (existing) {
      throw new Error('Este personagem já está cadastrado');
    }

    // Se é o primeiro personagem, definir como ativo
    const isFirstCharacter = count === 0;

    const { data: character, error } = await supabase
      .from('characters')
      .insert({
        user_id: userId,
        name: characterData.name,
        level: characterData.level,
        vocation: characterData.vocation,
        world: characterData.world,
        sex: characterData.sex,
        avatar_url: characterData.avatar_url,
        is_active: isFirstCharacter || characterData.is_active || false
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar personagem: ${error.message}`);
    }

    return character;
  }

  async getUserCharacters(userId: string): Promise<DatabaseCharacter[]> {
    const supabase = createClient();

    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar personagens: ${error.message}`);
    }

    return characters || [];
  }

  async updateCharacter(id: string, userId: string, data: UpdateCharacterDTO): Promise<DatabaseCharacter> {
    const supabase = createClient();

    const { data: character, error } = await supabase
      .from('characters')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar personagem: ${error.message}`);
    }

    return character;
  }

  async deleteCharacter(id: string, userId: string): Promise<void> {
    const supabase = createClient();

    // Verificar se o personagem a ser removido é o ativo
    const { data: character, error: getError } = await supabase
      .from('characters')
      .select('is_active')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (getError) {
      throw new Error(`Erro ao buscar personagem: ${getError.message}`);
    }

    // Remover personagem
    const { error: deleteError } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) {
      throw new Error(`Erro ao remover personagem: ${deleteError.message}`);
    }

    // Se o personagem removido era o ativo, ativar o primeiro disponível
    if (character.is_active) {
      const { data: remainingCharacters, error: remainingError } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!remainingError && remainingCharacters && remainingCharacters.length > 0) {
        await this.setActiveCharacter(remainingCharacters[0].id, userId);
      }
    }
  }

  async setActiveCharacter(id: string, userId: string): Promise<void> {
    const supabase = createClient();

    // Desativar todos os personagens do usuário
    const { error: deactivateError } = await supabase
      .from('characters')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (deactivateError) {
      throw new Error(`Erro ao desativar personagens: ${deactivateError.message}`);
    }

    // Ativar o personagem selecionado
    const { error: activateError } = await supabase
      .from('characters')
      .update({ is_active: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (activateError) {
      throw new Error(`Erro ao ativar personagem: ${activateError.message}`);
    }
  }

  async getUserCharactersWithRefresh(userId: string): Promise<DatabaseCharacter[]> {
    const characters = await this.getUserCharacters(userId);
    
    // Verificar quais personagens precisam ser atualizados
    const charactersToUpdate = characters.filter(character => 
      this.needsUpdate(character.updated_at)
    );

    // Atualizar personagens que precisam
    for (const character of charactersToUpdate) {
      try {
        await this.refreshCharacterData(character, userId);
      } catch (error) {
        console.error(`Erro ao atualizar personagem ${character.name}:`, error);
        // Continua com os outros personagens mesmo se um falhar
      }
    }

    // Retornar personagens atualizados se houve atualizações
    if (charactersToUpdate.length > 0) {
      return await this.getUserCharacters(userId);
    }

    return characters;
  }

  private needsUpdate(updatedAt: string): boolean {
    const lastUpdate = new Date(updatedAt);
    const now = new Date();
    const diffInSeconds = (now.getTime() - lastUpdate.getTime()) / 1000;
    
    return diffInSeconds > this.UPDATE_INTERVAL_SECONDS;
  }

  private async refreshCharacterData(character: DatabaseCharacter, userId: string): Promise<void> {
    try {
      // Buscar dados atualizados da API
      const tibiaCharacter = await characterService.getCharacterInfo(character.name);
      
      if (!tibiaCharacter) {
        throw new Error(`Não foi possível obter dados atualizados para ${character.name}`);
      }

      // Atualizar no banco de dados
      const updateData: UpdateCharacterDTO = {
        level: tibiaCharacter.level,
        vocation: tibiaCharacter.vocation,
        world: tibiaCharacter.world,
        sex: tibiaCharacter.sex,
      };

      await this.updateCharacter(character.id, userId, updateData);
      
      console.log(`Personagem ${character.name} atualizado com sucesso`);
    } catch (error) {
      console.error(`Erro ao atualizar dados do personagem ${character.name}:`, error);
      throw error;
    }
  }

  // Utility methods for data transformation
  static tibiaCharacterToCreateDTO(tibiaCharacter: TibiaCharacter): CreateCharacterDTO {
    return {
      name: tibiaCharacter.name,
      level: tibiaCharacter.level,
      vocation: tibiaCharacter.vocation,
      world: tibiaCharacter.world,
      sex: tibiaCharacter.sex,
      avatar_url: null, // TibiaData não fornece avatar URL diretamente
      is_active: false
    };
  }

  static databaseCharacterToSaved(dbCharacter: DatabaseCharacter): SavedCharacter {
    return {
      id: dbCharacter.id,
      name: dbCharacter.name,
      level: dbCharacter.level,
      vocation: dbCharacter.vocation || 'None',
      world: dbCharacter.world || '',
      sex: dbCharacter.sex || 'Unknown',
      addedAt: dbCharacter.created_at,
      isSelected: dbCharacter.is_active
    };
  }
}

export const charactersService = new CharactersService();