import { 
  TibiaApiResponse, 
  TibiaApiError, 
  CharacterValidationResult,
  TibiaCharacter
} from '@/types/character.types';

interface ICharacterService {
  validateCharacter(characterName: string): Promise<CharacterValidationResult>;
  getCharacterInfo(characterName: string): Promise<TibiaCharacter | null>;
}

class TibiaDataApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchCharacter(characterName: string): Promise<TibiaApiResponse | TibiaApiError> {
    const url = `${this.baseUrl}/character/${encodeURIComponent(characterName)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HuntCompare/1.0',
      },
    });

    const data = await response.json();
    
    // TibiaData API sempre retorna "information"
    // Verificamos se há um código de erro específico na resposta
    if (data.information && data.information.status && data.information.status.error) {
      return data as TibiaApiError;
    }

    // Para outros erros HTTP sem JSON válido
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data as TibiaApiResponse;
  }
}

export class CharacterService implements ICharacterService {
  private readonly apiClient: TibiaDataApiClient;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_TIBIADATA_API_BASE_URL;
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_TIBIADATA_API_BASE_URL environment variable is not set');
    }

    this.apiClient = new TibiaDataApiClient(baseUrl);
  }

  async validateCharacter(characterName: string): Promise<CharacterValidationResult> {
    try {
      if (!this.isValidCharacterName(characterName)) {
        return {
          isValid: false,
          character: null,
          error: 'Nome de personagem inválido. Use apenas letras, números e espaços.'
        };
      }

      const apiResponse = await this.apiClient.fetchCharacter(characterName);

      // Verificar se é resposta de erro (tem campo error em information.status)
      if ('information' in apiResponse && 
          'status' in apiResponse.information && 
          'error' in apiResponse.information.status) {
        // Resposta de erro
        const errorInfo = apiResponse.information.status;
        return {
          isValid: false,
          character: null,
          error: this.mapApiErrorToMessage(errorInfo.error, errorInfo.message)
        };
      }

      // Resposta de sucesso
      if ('character' in apiResponse) {
        const character = apiResponse.character.character;
        
        if (!character || !character.name) {
          return {
            isValid: false,
            character: null,
            error: 'Personagem não encontrado'
          };
        }

        return {
          isValid: true,
          character,
          error: null
        };
      }

      // Fallback para estruturas não reconhecidas
      return {
        isValid: false,
        character: null,
        error: 'Formato de resposta não reconhecido'
      };

    } catch (error) {
      console.error('Error validating character:', error);
      
      return {
        isValid: false,
        character: null,
        error: 'Erro ao verificar personagem. Tente novamente.'
      };
    }
  }

  async getCharacterInfo(characterName: string): Promise<TibiaCharacter | null> {
    try {
      const result = await this.validateCharacter(characterName);
      return result.isValid ? result.character : null;
    } catch (error) {
      console.error('Error getting character info:', error);
      return null;
    }
  }

  private isValidCharacterName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }

    const trimmedName = name.trim();
    
    // Tibia character name rules:
    // - 2-29 characters
    // - Letters, numbers and spaces only
    // - Cannot start or end with space
    // - No consecutive spaces
    if (trimmedName.length < 2 || trimmedName.length > 29) {
      return false;
    }

    if (trimmedName !== name) {
      return false; // starts or ends with space
    }

    if (/\s{2,}/.test(name)) {
      return false; // consecutive spaces
    }

    return /^[a-zA-Z0-9\s]+$/.test(name);
  }

  private mapApiErrorToMessage(errorCode: number, errorMessage: string): string {
    // Mapeamento baseado no código de erro da TibiaData API
    const errorCodeMappings: Record<number, string> = {
      10003: 'Nome de personagem inválido',
      10006: 'Nome de personagem muito longo',
      20001: 'Personagem não encontrado',
      20002: 'Nome de personagem inválido',
      20003: 'Muitas tentativas. Tente novamente em alguns minutos.',
      20004: 'Serviço temporariamente indisponível'
    };

    // Se temos um mapeamento específico para o código, use ele
    if (errorCodeMappings[errorCode]) {
      return errorCodeMappings[errorCode];
    }

    // Fallback para mensagens em inglês mais comuns
    const messageMappings: Record<string, string> = {
      'could not find character': 'Personagem não encontrado',
      'character name has a word too big': 'Nome de personagem muito longo',
      'invalid character name': 'Nome de personagem inválido',
      'rate limit exceeded': 'Muitas tentativas. Tente novamente em alguns minutos.',
      'service unavailable': 'Serviço temporariamente indisponível'
    };

    const lowerMessage = errorMessage.toLowerCase();
    for (const [key, value] of Object.entries(messageMappings)) {
      if (lowerMessage.includes(key)) {
        return value;
      }
    }

    return 'Erro ao verificar personagem. Tente novamente.';
  }
}

export const characterService = new CharacterService();