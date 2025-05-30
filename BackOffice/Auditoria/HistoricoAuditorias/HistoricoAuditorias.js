new Vue({
  el: '#app',

  data: {
    auditorias: [],
    searchTerm: '',
    sortOption: 'recent',
    paginaAtual: 1,
    porPagina: 10
  },

  computed: {
    auditoriasFiltradas() {
      const termo = this.searchTerm.toLowerCase();

      let filtradas = this.auditorias
        .filter(a => a.estado === 'Concluída')
        .filter(a => {
          return (
            (a.tipoOcorrencia && a.tipoOcorrencia.toLowerCase().includes(termo)) ||
            (a.morada && a.morada.toLowerCase().includes(termo)) ||
            (a.data && a.data.toLowerCase().includes(termo)) ||
            (a.dataConclusao && a.dataConclusao.toLowerCase().includes(termo)) ||
            (a.estado && a.estado.toLowerCase().includes(termo))
          );
        });

      if (this.sortOption === 'recent') {
        return filtradas.sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao));
      } else {
        return filtradas.sort((a, b) => new Date(a.dataConclusao) - new Date(b.dataConclusao));
      }
    },

    totalPaginas() {
      return Math.ceil(this.auditoriasFiltradas.length / this.porPagina);
    },

    paginatedAuditorias() {
      const inicio = (this.paginaAtual - 1) * this.porPagina;
      return this.auditoriasFiltradas.slice(inicio, inicio + this.porPagina);
    },

    primeiroItem() {
      return this.auditoriasFiltradas.length === 0 ? 0 : (this.paginaAtual - 1) * this.porPagina + 1;
    },
    ultimoItem() {
      const fim = this.paginaAtual * this.porPagina;
      return fim > this.auditoriasFiltradas.length
        ? this.auditoriasFiltradas.length
        : fim;
    },
    totalAtivas() {
      const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
      return auditorias.filter(a => a.estado === "Em Progresso").length;
    },

    totalPeritos() {
      const peritos = JSON.parse(localStorage.getItem('expertsData')) || [];
      return peritos.filter(p => 
        p.status === "Disponível" || p.status === "Em Auditoria"
      ).length;
    }
  },

  methods: {
    irParaPagina(n) {
      this.paginaAtual = n;
      localStorage.setItem('paginaAuditoria', n);
    },
    nextPage() {
      if (this.paginaAtual < this.totalPaginas) {
        this.irParaPagina(this.paginaAtual + 1);
      }
    },
    prevPage() {
      if (this.paginaAtual > 1) {
        this.irParaPagina(this.paginaAtual - 1);
      }
    },
    formatarData(dataStr) {
      if (!dataStr) return "—";
      const [ano, mes, dia] = dataStr.split("-");
      return `${dia}/${mes}/${ano}`;
    },

    carregarDados() {
      const dadosLocal = JSON.parse(localStorage.getItem('auditorias')) || [];

      this.auditorias = dadosLocal
        .map(a => ({
          id: a.id,
          tipoOcorrencia: a.tipoOcorrencia || "—",
          morada: a.morada || "—",
          data: a.data || null,
          dataConclusao: a.dataConclusao || null,
          estado: a.estado || "—",
        }))
    },

    irParaLocalAuditado(id) {
      localStorage.setItem('idAuditoria', id)
      window.location.href = "LocalAuditado/LocalAuditado.html";
    }
  },

  mounted() {
    this.carregarDados();
    const guardado = parseInt(localStorage.getItem('paginaAuditoria'));
    if (!isNaN(guardado)) {
      this.paginaAtual = guardado;
    }
  }
});

function voltarSuave() {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "../../../Frontoffice/Auditorias/index.html";
  }, 300);
}
