document.addEventListener('DOMContentLoaded', function() {
    const expertsData = JSON.parse(localStorage.getItem('expertsData') || '[]');
    // compara sempre em minúsculas
    const disponiveis = expertsData.filter(e => e.status && e.status.toLowerCase() === 'disponível').length;
    const el = document.getElementById('profissionais-disponiveis');
    if (el) el.textContent = disponiveis;

    const emAuditoria = expertsData.filter(e => e.status && e.status.toLowerCase() === 'em auditoria').length;
    const elEmAcao = document.getElementById('profissionais-em-acao');
    if (elEmAcao) elEmAcao.textContent = emAuditoria;

    // AUDITORIAS RESOLVIDAS COM PAGINAÇÃO
    const auditorias = JSON.parse(localStorage.getItem('auditorias') || '[]');
    const lista = document.getElementById('auditorias-resolvidas-list');
    const itemsPerPage = 4;
    let currentPage = 1;

    function renderAuditoriasPage(page) {
        if (!lista) return;
        const totalPages = Math.ceil(auditorias.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = auditorias.slice(start, end);

        if (auditorias.length === 0) {
            lista.innerHTML = '<div class="list-item"><div class="list-item-text">Nenhuma auditoria criada.</div></div>';
        } else {
            lista.innerHTML = pageItems.map(a => `
                <div class="list-item">
                    <div class="list-item-text">${a.nome || a.id}</div>
                    <div class="list-item-icon">〉</div>
                </div>
            `).join('');

            // Paginação
            let pagination = '<div class="pagination" style="margin-top:10px; text-align:center;">';
            if (page > 1) {
                pagination += `<button id="prevAuditorias" style="margin-right:5px;">Anterior</button>`;
            }
            pagination += `<span>Página ${page} de ${totalPages}</span>`;
            if (page < totalPages) {
                pagination += `<button id="nextAuditorias" style="margin-left:5px;">Próxima</button>`;
            }
            pagination += '</div>';
            lista.innerHTML += pagination;

            // Eventos dos botões
            if (page > 1) {
                document.getElementById('prevAuditorias').onclick = () => {
                    currentPage--;
                    renderAuditoriasPage(currentPage);
                };
            }
            if (page < totalPages) {
                document.getElementById('nextAuditorias').onclick = () => {
                    currentPage++;
                    renderAuditoriasPage(currentPage);
                };
            }
        }
    }

    renderAuditoriasPage(currentPage);

    // OCORRÊNCIAS REALIZADAS POR ÁREA - PERCENTAGENS REAIS
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    const total = ocorrencias.length;

    const tipos = [
        "Buraco na Estrada",
        "Passeio Danificado",
        "Falta de Sinalização",
        "Iluminação Pública"
    ];

    // Conta quantas de cada tipo
    const contagem = {};
    tipos.forEach(tipo => contagem[tipo] = 0);
    ocorrencias.forEach(o => {
        const tipoEncontrado = tipos.find(t => t.toLowerCase() === (o.tipo || '').toLowerCase());
        if (tipoEncontrado) contagem[tipoEncontrado]++;
    });

    // Calcula percentagens
    const percentagens = tipos.map(tipo =>
        total > 0 ? (contagem[tipo] / total) * 100 : 0
    );

    // Atualiza as percentagens na legenda
    const legendItems = document.querySelectorAll('.legend .legend-item');
    legendItems.forEach((item, idx) => {
        const labelDiv = item.querySelector('div:last-child');
        if (!labelDiv) return;
        labelDiv.textContent = `${tipos[idx]} ${Math.round(percentagens[idx])}%`;
    });

    // Atualiza o donut chart
    const CIRC = 2 * Math.PI * 40;
    let offset = 0;
    // Seleciona todos os círculos de dados (exclui só o fundo e o buraco central)
    const svgCircles = document.querySelectorAll('.donut-chart svg circle[stroke-width="20"]:not(:first-child):not([fill])');
    percentagens.forEach((perc, idx) => {
        if (svgCircles[idx]) {
            const dash = (perc / 100) * CIRC;
            const gap = CIRC - dash;
            svgCircles[idx].setAttribute('stroke-dasharray', `${dash} ${gap}`);
            svgCircles[idx].setAttribute('transform', `rotate(${offset - 90} 50 50)`);
            offset += (perc / 100) * 360;
        }
    });

    const auditoriasAceites = JSON.parse(localStorage.getItem('auditorias') || '[]').length;
    const elAuditoriasAceites = document.getElementById('auditorias-aceites');
    if (elAuditoriasAceites) elAuditoriasAceites.textContent = auditoriasAceites;

    const ocorrenciasData = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    const ocorrenciasEmEspera = ocorrenciasData.filter(o => o.estado && o.estado.toLowerCase() === 'em espera').length;
    const elOcorrenciasEmEspera = document.getElementById('ocorrencias-em-espera');
    if (elOcorrenciasEmEspera) elOcorrenciasEmEspera.textContent = ocorrenciasEmEspera;
});