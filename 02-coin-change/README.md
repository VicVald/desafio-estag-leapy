# Como Rodar o Coin Change

## Pré-requisitos
- Docker
- Node.js (para os testes)

## Passos para Executar

1. **Navegue até o diretório do desafio:**
   ```bash
   cd 02-coin-change
   ```

2. **Construa a imagem Docker:**
   ```bash
   docker build -t coin-change-solution .
   ```

3. **Instale as dependências dos testes:**
   ```bash
   npm install
   ```

4. **Execute os testes:**
   ```bash
   npm test
   ```

## Teste Manual
Para testar com entrada específica:
```bash
echo '{"coins": [1,2,5], "amount": 11}' | docker run --rm -i coin-change-solution
```
Saída esperada: `{"minCoins": 3}`

## Por que Não Usar o Greedy Algorithm?

O algoritmo guloso (greedy) funciona bem para sistemas de moedas canônicas, como as moedas dos EUA (1¢, 5¢, 10¢, 25¢), onde sempre escolher a maior moeda disponível leva à solução ótima.

No entanto, para sistemas de moedas arbitrários, o greedy pode falhar. Por exemplo:

- Moedas: [1, 3, 4]
- Valor: 6

**Greedy:** 4 + 1 + 1 = 3 moedas  
**Ótimo:** 3 + 3 = 2 moedas

Como o problema permite moedas arbitrárias, usei Programação Dinâmica para garantir a solução ótima em todos os casos.

## Novos Casos de Teste Adicionados

Além dos casos oficiais em `tests/cases.json`, adicionei testes para edge cases:

1. **Valor negativo:** `{"coins": [1,2,5], "amount": -1}` → `{"minCoins": -1}`
2. **Moedas inválidas:** `{"coins": "invalid", "amount": 11}` → `{"minCoins": -1}`


Estes casos garantem robustez contra entradas inválidas e edge cases.