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
    // Formatar a data de YYYY-MM-DD para DD/MM/YYYY
    const [ano, mes, dia] = auditoria.dataCriacao.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    // Preenche os campos do Local Auditado com os dados encontrados
    document.getElementById("data").value = dataFormatada;
    
    // Preenche o select de tipo
    const tipoSelect = document.getElementById("tipo");
    tipoSelect.innerHTML = `<option value="${auditoria.tipo}" selected>${auditoria.tipo}</option>`;
    
    // Morada (local)
    document.getElementById("morada").value = auditoria.morada;

    // Localização (cidade e postal)
    document.getElementById("localizacao").value = auditoria.cidade + ", " + auditoria.postal;

    // Perito Supervisor
    document.getElementById("perito").value = auditoria.perito;
    
    // 🗺️ Gerar imagem estática da localização
    const moradaCompleta = `${auditoria.morada}, ${auditoria.postal}, ${auditoria.cidade}`;
    const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(moradaCompleta)}&output=embed`;
    document.getElementById("mapa-local").src = mapaEmbed;

    console.log("Dados carregados com sucesso:", auditoria);
} else {
    console.error("Auditoria não encontrada para o ID:", id);
}
};