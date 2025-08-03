# Ajustes de Cursor nos Botões

## Arquivos Atualizados

### 1. components/ui/Button.tsx
- ✅ Adicionado `cursor-pointer` ao baseStyles
- ✅ Mantido `disabled:cursor-not-allowed` para botões desabilitados

### 2. components/ui/Toast.tsx
- ✅ Adicionado `cursor-pointer` ao botão de fechar (X)

### 3. components/ui/ConfirmDialog.tsx
- ✅ Adicionado `cursor-pointer` ao botão de fechar (X)

### 4. components/ui/ComparisonHistory.tsx
- ✅ Botão "Limpar Histórico"
- ✅ Botão "Recarregar" 
- ✅ Botão "Remover" (X para cada item)
- ✅ Botão "Ver mais/Ver menos"

### 5. components/ui/JsonViewer.tsx
- ✅ Botões "Formatado" e "Raw" (alternância de visualização)

### 6. Páginas de Erro
- ✅ app/error.tsx - Botão "Recarregar Página"
- ✅ app/global-error.tsx - Todos os 3 botões (Tentar Novamente, Ir para Página Inicial, Recarregar)
- ✅ app/not-found.tsx - Botão "Voltar"
- ✅ app/(protected)/not-found.tsx - Botão "volte à página anterior"

### 7. components/ui/WeaponDropdown.tsx
- ✅ Já tinha cursor aplicado condicionalmente - não precisou ajustar

## Resultado

✅ **Todos os botões interativos agora mostram cursor-pointer**  
✅ **Botões desabilitados mostram cursor-not-allowed**  
✅ **Melhor UX e feedback visual para o usuário**  
✅ **Lint passou sem warnings ou erros**

## Padrão Estabelecido

Para novos botões, sempre incluir:
```css
cursor-pointer              /* Para botões ativos */
disabled:cursor-not-allowed /* Para botões desabilitados */
```

O componente Button já inclui isso automaticamente, então use sempre que possível:
```tsx
<Button variant="primary" onClick={handleClick}>
  Meu Botão
</Button>
```