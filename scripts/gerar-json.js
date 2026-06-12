const fs = require("fs");

const pasta = "./pdf";

const arquivos = fs.readdirSync(pasta)
  .filter(arq => arq.toLowerCase().endsWith(".pdf"));

const lista = [];

arquivos.forEach(arquivo => {

  const nomeSemPdf = arquivo.replace(/\.pdf$/i, "");

  // Captura:
  // Título do hino AVU 10
  // Castelo Forte HC 15
  // etc.

  const match = nomeSemPdf.match(/^(.*?)\s+(AVU|HC|CTP)\s+(\d+)$/i);

  if (match) {

    lista.push({
      hinario: match[2].toUpperCase(),
      numero: parseInt(match[3]),
      titulo: match[1].trim(),
      arquivo: arquivo
    });

  } else {

    console.log("Nome fora do padrão:", arquivo);

    lista.push({
      hinario: "",
      numero: 0,
      titulo: nomeSemPdf,
      arquivo: arquivo
    });

  }

});

// Ordena alfabeticamente
lista.sort((a, b) =>
  a.titulo.localeCompare(b.titulo, "pt-BR")
);

fs.writeFileSync(
  "hinos.json",
  JSON.stringify(lista, null, 2),
  "utf8"
);

console.log(`${lista.length} hinos processados.`);
