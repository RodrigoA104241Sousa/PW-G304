// Carregar os dados da auditoria do localStorage
window.onload = function () {
const id = localStorage.getItem("idAuditoria"); // Pega o ID armazenado no localStorage

// Recupera os dados de auditoria do localStorage
const dadosString = localStorage.getItem("auditorias");

if (!dadosString) {
    console.error("Dados de auditorias não encontrados no localStorage");
    return;
}

const dados = JSON.parse(dadosString);

// Encontra os dados da auditoria pelo ID
const auditoria = dados.find((item) => item.id == id);

if (auditoria) {
    // Data de Início (já vem formatada tipo "30/05/2025")
    document.getElementById("data").value = auditoria.data || "—";

    // Tipo de Auditoria
    document.getElementById("tipo").value = auditoria.tipoOcorrencia || "—";

    // Morada
    document.getElementById("morada").value = auditoria.morada || "—";

    // Data de Conclusão
    if (auditoria.dataConclusao) {
      const [ano, mes, dia] = auditoria.dataConclusao.split("-");
      document.getElementById("localizacao").value = `${dia}/${mes}/${ano}`;
    } else {
      document.getElementById("localizacao").value = "—";
    }

    // Perito Supervisor
    const peritoNome = auditoria.peritos?.[0]?.name || "—";
    document.getElementById("perito").value = peritoNome;

    // Mapa
    const moradaCompleta = auditoria.morada;
    const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(moradaCompleta)}&output=embed`;
    document.getElementById("mapa-local").src = mapaEmbed;

    console.log("Dados carregados com sucesso:", auditoria);
  } else {
    console.error("Auditoria não encontrada para o ID:", id);
  }
};