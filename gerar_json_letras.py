import json
import re

entrada = "letras_AVU_chordpro.txt"
saida = "letras_AVU.json"

musicas = []

with open(entrada, "r", encoding="utf-8") as f:
    conteudo = f.read()

# Divide por separador de arquivo
blocos = conteudo.split("=" * 60)

for bloco in blocos:
    linhas = bloco.strip().split("\n")
    
    if not linhas or len(linhas) < 2:
        continue
    
    # Primeira linha tem "ARQUIVO: nome.chordpro"
    nome_arquivo = linhas[0].replace("ARQUIVO:", "").strip()
    
    if not nome_arquivo or not nome_arquivo.endswith((".chordpro", ".cho")):
        continue
    
    # Extrai título e número AVU do nome do arquivo
    # Exemplo: "Meu Jesus Salvador (Aclame ao Senhor) AVU 14.chordpro"
    match = re.search(r"(.*?)\s+AVU\s+(\d+)", nome_arquivo)
    
    if match:
        titulo = match.group(1).strip()
        numero_avu = int(match.group(2))
        
        # Processa o resto como conteúdo do arquivo
        conteudo_arquivo = "\n".join(linhas[1:]).strip()
        
        # Remove linhas que começam com { (metadata do CHORDPRO)
        linhas_filtradas = []
        for linha in conteudo_arquivo.split("\n"):
            linha_limpa = linha.strip()
            # Pula linhas vazias, comentários e metadados CHORDPRO
            if not linha_limpa or linha_limpa.startswith("{") or linha_limpa.startswith("#"):
                continue
            # Pula linhas com apenas acordes entre colchetes
            if re.match(r"^\[.*\]$", linha_limpa):
                continue
            linhas_filtradas.append(linha)
        
        letra = "\n".join(linhas_filtradas).strip()
        
        if letra:  # Só adiciona se tiver conteúdo
            musicas.append({
                "numero_avu": numero_avu,
                "titulo": titulo,
                "letra": letra
            })
            print(f"✓ AVU {numero_avu}: {titulo}")

# Ordena por número AVU
musicas.sort(key=lambda x: x["numero_avu"])

# Salva JSON
with open(saida, "w", encoding="utf-8") as f:
    json.dump(musicas, f, ensure_ascii=False, indent=2)

print(f"\n✓ JSON gerado: {saida}")
print(f"Total de músicas: {len(musicas)}")
