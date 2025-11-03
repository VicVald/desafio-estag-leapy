FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o script da solução para o container
COPY script.py /app/script.py

# Define o ENTRYPOINT para que o container execute o script Python.
# A entrada (stdin) e saída (stdout) serão gerenciadas pelo comando
# que o executor (runner.yml) fornecer.
ENTRYPOINT ["python", "/app/script.py"]