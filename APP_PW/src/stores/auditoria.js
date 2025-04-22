// stores/auditoria.js
import { defineStore } from 'pinia'

export const useAuditoriaStore = defineStore('auditoria', {
  state: () => ({
    pagina1: JSON.parse(localStorage.getItem('pagina1')) || {},
    pagina2: JSON.parse(localStorage.getItem('pagina2')) || {},
    pagina3: JSON.parse(localStorage.getItem('pagina3')) || {},
    pagina4: JSON.parse(localStorage.getItem('pagina4')) || {},
    auditorias: JSON.parse(localStorage.getItem('auditorias')) || [],
  }),
  actions: { 
    setDados(pagina, dados) {
      this[pagina] = dados
      localStorage.setItem(pagina, JSON.stringify(dados))
    },

    guardarAuditoriaCompleta(id, tipo_problema) {
        const nova = {
          id: id,
          tipo_problema: tipo_problema,
          pagina1: this.pagina1,
          pagina2: this.pagina2,
          pagina3: this.pagina3,
          pagina4: this.pagina4
        }
      
        const index = this.auditorias.findIndex(a => a.id === id)
      
        if (index !== -1) {
          // Já existe: substituir
          this.auditorias[index] = nova
        } else {
          // Não existe: adicionar nova
          this.auditorias.push(nova)
        }
      
        localStorage.setItem('auditorias', JSON.stringify(this.auditorias))
        this.limparTudo()
      },

    limparTudo() {
      this.pagina1 = {}
      this.pagina2 = {}
      this.pagina3 = {}
      this.pagina4 = {}

      localStorage.removeItem('pagina1')
      localStorage.removeItem('pagina2')
      localStorage.removeItem('pagina3')
      localStorage.removeItem('pagina4')
    },

    getTodasAuditorias() {
      return this.auditorias
    }
  }
})
