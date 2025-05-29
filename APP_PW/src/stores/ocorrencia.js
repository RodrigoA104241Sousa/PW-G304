import { defineStore } from 'pinia'

export const useOcorrenciasStore = defineStore('auditorias', {
  state: () => ({
    lista: []
  }),
  actions: {
    carregarOcorrencias() {
      this.lista = JSON.parse(localStorage.getItem('auditorias') || '[]')
    },

     getTodasOcorrencias() {
      return this.lista
    },

    getOcorrenciaById(id) {
      return this.lista.find(o => o.id == id)
    },

    updateEstado(id, novoEstado) {
      const idx = this.lista.findIndex(o => o.id == id)
      if (idx !== -1) {
        this.lista[idx].estado = novoEstado
        localStorage.setItem('auditorias', JSON.stringify(this.lista))
      }
    }
  }
})
