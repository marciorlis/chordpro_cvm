const fs = require("fs");
const path = require("path");

const PASTA_REPERTORIOS = "repertorios";
const ARQUIVO_ATUAL = "repertorio-atual.json";
const PAGINA_DOMINGO = "hinos-do-domingo.html";

// ------------------------------------------------------------------
// Localiza o JSON mais recente
// ------------------------------------------------------------------

const arquivos = fs.readdirSync(PASTA_REPERTORIOS)
    .filter(arq => arq.toLowerCase().endsWith(".json"))
    .sort();

if (arquivos.length === 0) {
    console.log("Nenhum repertório encontrado.");
    process.exit(0);
}

const ultimo = arquivos[arquivos.length - 1];

console.log("Repertório encontrado:");
console.log(ultimo);

// ------------------------------------------------------------------
// Carrega o JSON
// ------------------------------------------------------------------

const caminho = path.join(PASTA_REPERTORIOS, ultimo);

const texto = fs.readFileSync(caminho, "utf8");

const repertorio = JSON.parse(texto);

// ------------------------------------------------------------------
// Atualiza repertorio-atual.json
// ------------------------------------------------------------------

fs.writeFileSync(
    ARQUIVO_ATUAL,
    JSON.stringify(repertorio, null, 2),
    "utf8"
);

console.log("repertorio-atual.json atualizado.");

// ------------------------------------------------------------------
// Monta lista de hinos
// ------------------------------------------------------------------

let lista = "";

repertorio.hinos.forEach((hino, indice) => {

    lista += `
<div class="hino">
    <a href="#"
       onclick="abrirPDF('${encodeURIComponent(hino.arquivo)}'); return false;">
       ${indice + 1}. ${hino.hinario} ${hino.numero} - ${hino.titulo}
    </a>
</div>
`;

});

// ------------------------------------------------------------------
// Formata data
// ------------------------------------------------------------------

const partes = repertorio.data.split("-");

const dataFormatada =
    partes[2] + "/" +
    partes[1] + "/" +
    partes[0];

// ------------------------------------------------------------------
// Gera página HTML
// ------------------------------------------------------------------

const html = `<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>Hinos do Domingo</title>

<style>

body {
    font-family: system-ui, -apple-system,
                 BlinkMacSystemFont,
                 "Segoe UI",
                 sans-serif;

    margin: 1rem;
    font-size: 1.3rem;
    line-height: 1.5;
}

a {
    font-size: 1.5rem;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.hino {
    margin-bottom: 0.8rem;
}

iframe {
    width: 100%;
    height: 90vh;
    border: none;
}

@media (max-width: 600px) {

    body {
        margin: 0.8rem;
        font-size: 1.15rem;
    }

}

</style>

</head>

<body>

<h1>Hinos do Domingo – ${dataFormatada}</h1>

<h2>${repertorio.descricao}</h2>

<p>
Clique em um hino para abrir a partitura.
</p>

${lista}

<hr>

<!-- VISUALIZADOR PDF -->

<div id="viewer">

    <iframe id="pdfFrame"></iframe>

</div>

<script>

function abrirPDF(arquivo) {

    document.getElementById("pdfFrame").src =
        "pdf/" + decodeURIComponent(arquivo);

}

</script>

</body>

</html>`;

fs.writeFileSync(
    PAGINA_DOMINGO,
    html,
    "utf8"
);

console.log("hinos-do-domingo.html atualizado.");
