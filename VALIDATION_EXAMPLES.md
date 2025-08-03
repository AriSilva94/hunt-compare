# Validação de Dados de Sessão - Exemplos

## ✅ Dados Válidos

### Exemplo 1: JSON de Sessão Válido
```json
{
  "Session start": "2024-01-15 14:30:00",
  "Session end": "2024-01-15 16:30:00",
  "Session length": "02:00:00",
  "Experience": "125,450",
  "Experience/h": "62,725",
  "Killed Monsters": [
    {"Dragon": 15},
    {"Dragon Lord": 8},
    {"Demon": 12}
  ],
  "Looted Items": [
    {"Dragon Ham": 5},
    {"Gold Coin": 2500},
    {"Demon Shield": 1}
  ],
  "Loot": "15,750 gp",
  "Supplies": "3,200 gp",
  "Balance": "12,550 gp"
}
```

### Exemplo 2: Texto de Sessão Válido
```
Session data: From 2024-01-15, 14:30:00 to 2024-01-15, 16:30:00
Session: 02:00:00
Experience: 125,450
Experience/h: 62,725
Raw Experience: 98,360
Raw Experience/h: 49,180
Healing: 45,320
Mana: 123,450

Killed Monsters:
Dragon: 15
Dragon Lord: 8
Demon: 12

Looted Items:
Dragon Ham: 5
Gold Coin: 2500
Demon Shield: 1

Loot: 15,750 gp
Supplies: 3,200 gp
Balance: 12,550 gp
```

## ❌ Dados Inválidos

### Exemplo 1: JSON sem Killed Monsters
```json
{
  "Session start": "2024-01-15 14:30:00",
  "Session end": "2024-01-15 16:30:00",
  "Experience": "125,450"
  // ❌ Falta "Killed Monsters"
}
```

### Exemplo 2: JSON sem Informações de Sessão
```json
{
  "Killed Monsters": [
    {"Dragon": 15}
  ],
  "Experience": "125,450"
  // ❌ Falta dados de sessão (Session start/end/length)
}
```

### Exemplo 3: Texto sem Killed Monsters
```
Session data: From 2024-01-15, 14:30:00 to 2024-01-15, 16:30:00
Experience: 125,450
Experience/h: 62,725
// ❌ Falta seção "Killed Monsters:"
```

### Exemplo 4: Dados Completamente Inválidos
```json
{
  "nome": "João",
  "idade": 25,
  "email": "joao@email.com"
}
```

## 🔍 Como a Validação Funciona

### Para JSON:
1. ✅ Verifica se é um JSON válido
2. ✅ Verifica se tem informações de sessão (`Session start`, `Session end`, `Session length`, ou `Session data`)
3. ✅ Verifica se tem array `Killed Monsters`
4. ✅ Se ambos estiverem presentes → **VÁLIDO**

### Para Texto:
1. ✅ Procura por marcadores de sessão (`Session data:`, `Session:`, etc.)
2. ✅ Procura por seção de monstros (`Killed Monsters:`)
3. ✅ Se ambos estiverem presentes → **VÁLIDO**

## 📝 Mensagem de Erro

Quando dados inválidos são inseridos, o usuário recebe a seguinte mensagem:

> **Dados inválidos para sessão de hunt. Certifique-se de que os dados contenham:**
> • Informações de sessão (Session start, Session end ou Session length)
> • Lista de monstros mortos (Killed Monsters)
> • Formato JSON válido ou texto de sessão do Tibia

## 🎯 Campos Obrigatórios Mínimos

Para que uma sessão seja considerada válida, deve conter:

### Informações de Sessão (pelo menos 1):
- `Session start`
- `Session end` 
- `Session length`
- `Session data`

### Dados de Hunt:
- `Killed Monsters` (array com pelo menos a estrutura, pode estar vazio)

### Campos Opcionais (comuns):
- `Experience`, `Experience/h`
- `Looted Items`
- `Loot`, `Supplies`, `Balance`
- `Healing`, `Mana`
- `Damage Dealt`, `Damage Received`
- E muitos outros campos dinâmicos

## 🚀 Benefícios da Nova Validação

✅ **Previne cadastros incorretos** - Só permite dados de sessão válidos  
✅ **Mensagens claras** - Usuário sabe exatamente o que está errado  
✅ **Suporte a ambos formatos** - JSON e texto do Tibia  
✅ **Flexibilidade** - Permite campos adicionais dinâmicos  
✅ **Type Safety** - TypeScript garante consistência no código