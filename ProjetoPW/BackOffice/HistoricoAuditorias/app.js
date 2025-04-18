new Vue({ // Cria uma nova instância do Vue
  el: '#app', // ID do elemento HTML onde o Vue será montado

  // dados do Vue, data contém as propriedades
  data: {
    auditorias: [], // auditorias do data.json
    searchTerm: '', // termo de pesquisa
    sortOption: 'recent', // opção de ordenação (recente ou mais antiga)
    paginaAtual: 1, // página atualmente exibida
    porPagina: 10 // número de auditorias por página
  },

  //propriedades computadas
  computed: {
    // filtros
    auditoriasFiltradas() {
      const termo = this.searchTerm.toLowerCase(); // converte o termo de pesquisa para minúsculas

      // Filtrar auditorias com base no termo pesquisado
      let filtradas = this.auditorias.filter(a =>
        Object.values(a).some(val =>     //object values obtem os valores de todos os campos
          typeof val === 'string' && val.toLowerCase().includes(termo)
        )
      ); 

      // Ordenar por data (recente ou mais antiga)
      if (this.sortOption === 'recent') {
        return filtradas.sort((a, b) => new Date(b.data) - new Date(a.data)); // ordena do mais recente para o mais antigo
      } else {
        return filtradas.sort((a, b) => new Date(a.data) - new Date(b.data)); // ordena do mais antigo para o mais recente
      }
    },

    // Calcula Paginação total
    totalPaginas() {
      return Math.ceil(this.auditoriasFiltradas.length / this.porPagina); //divide total de auditorias / auditorias por página e arredonda para cima
    },

    // Devolve apenas as auditorias da página atual
    paginatedAuditorias() {
      const inicio = (this.paginaAtual - 1) * this.porPagina; // calcula o índice inicial
      return this.auditoriasFiltradas.slice(inicio, inicio + this.porPagina); //slice retorna uma parte do array, do inicio até o fim
    },

    //indica o primeiro e o último item da página atual
    primeiroItem() { //primeiro item
      return this.auditoriasFiltradas.length === 0 ? 0 : (this.paginaAtual - 1) * this.porPagina + 1;
    },
    ultimoItem() { //último item
      const fim = this.paginaAtual * this.porPagina;
      return fim > this.auditoriasFiltradas.length 
        ? this.auditoriasFiltradas.length
        : fim; //garante que o total não passe o número de auditorias
    }
  },

  // métodos do Vue, funções que podem ser chamadas no template
  methods: {
    // pagina atual
    irParaPagina(n) {
      this.paginaAtual = n; 
      localStorage.setItem('paginaAuditoria', n); // guarda estado atual no localStorage, se o usuario sair da página e voltar, ele continua na mesma pagina
    },
    // ir para pagina seguinte
    nextPage() {
      if (this.paginaAtual < this.totalPaginas) { // verifica se página atual < total de páginas
        this.irParaPagina(this.paginaAtual + 1); // se sim, vai para a próxima página
      }
    },
    // ir para pagina anterior
    prevPage() {
      if (this.paginaAtual > 1) { // verifica se página atual é a 1º página
        this.irParaPagina(this.paginaAtual - 1) // se sim, vai para a página anterior
      }
    },

    // carregar dados de data.Json
    carregarDados() {
      fetch("data.json")
        .then((res) => res.json())
        .then((dados) => {
          this.auditorias = dados
          // Salvar os dados no localStorage para uso em outras páginas
          localStorage.setItem("auditorias", JSON.stringify(dados))
        })
    },

    // formata a data
    formatarData(dataStr) {
      // Converte YYYY-MM-DD para DD/MM/YYYY
      const [ano, mes, dia] = dataStr.split("-");
      return `${dia}/${mes}/${ano}`
    },

    irParaLocalAuditado(id) {
      // Salva o ID da auditoria no localStorage
      localStorage.setItem('idAuditoria', id)
  
      // Redireciona para a página de Local Auditado
      window.location.href = "LocalAuditado(HTMLeCSS).html";
    }
  },
  

  mounted() {
    // Função Carregar os dados
    this.carregarDados();

    // verfifica se há uma pagina guardada no localstorage 
    // se sim, define como a atual, se nao fica a 1º pagina
    const guardado = parseInt(localStorage.getItem('paginaAuditoria'));
    if (!isNaN(guardado)) {
      this.paginaAtual = guardado;
    }
  }
});
