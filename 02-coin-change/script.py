import sys
import json

def coin_change(coins: list[int], amount: int) -> int:
    """
    Calcula o número mínimo de moedas necessárias para atingir o 'amount',
    usando Programação Dinâmica.

    coins: Lista de valores das moedas disponíveis.
    amount: O valor total a ser alcançado.
    return: O número mínimo de moedas, ou -1 se o 'amount' não puder ser alcançado.
    """

    if amount < 0:
        return -1

    dp = [amount + 1] * (amount + 1)
    
    # Primeiro case: 0 moedas para formar o valor 0
    dp[0] = 0
    
    # Para cada valor de 1 até o amount
    for a in range(1, amount + 1):
        for coin in coins:
            # Se a moeda pode ser usada para formar o valor 'a'
            if a >= coin:
                # O número mínimo de moedas para 'a' é o mínimo entre:
                # 1. O valor atual em dp[a]
                # 2. 1 (a moeda atual) + o mínimo de moedas para (a - coin)
                dp[a] = min(dp[a], dp[a - coin] + 1)

    # O resultado está em dp[amount]
    # Se dp[amount] ainda for amount + 1, significa que o valor não pôde ser formado.
    min_coins = dp[amount]
    
    # Retorna o resultado conforme o contrato de I/O
    return min_coins if min_coins <= amount else -1

def main():
    """
    Lê a entrada JSON do stdin, executa a lógica e escreve a saída JSON para o stdout.
    """
    try:
        # Lê a entrada JSON completa do stdin
        input_data = sys.stdin.read()

        # Faz o parse do JSON
        data = json.loads(input_data)

        coins = data.get("coins", [])
        amount = data.get("amount", 0)

        if not isinstance(coins, list) or not isinstance(amount, int) or not all(isinstance(c, int) and c > 0 for c in coins):
            # Invalid input, return -1
            output = {"minCoins": -1}
            json.dump(output, sys.stdout)
            return

        # Chama a função principal de solução
        result = coin_change(coins, amount)

        # Prepara a saída JSON no formato obrigatório
        output = {
            "minCoins": result
        }

        # Escreve a saída JSON para o stdout
        json.dump(output, sys.stdout)

    except json.JSONDecodeError:
        # Lidar com erro de formato JSON
        # No contexto do desafio, talvez um erro silencioso seja suficiente,
        # mas para robustez, poderíamos logar ou retornar um erro.
        pass
    except Exception as e:
        # Lidar com outros erros
        print(f"An error occurred: {e}", file=sys.stderr)
        pass

if __name__ == "__main__":
    main()