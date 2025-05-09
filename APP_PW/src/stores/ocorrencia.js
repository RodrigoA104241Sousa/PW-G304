import { defineStore } from 'pinia'

export const useOcorrenciasStore = defineStore('auditorias', {
  state: () => ({
    lista: []
  }),
  actions: {
    carregarOcorrencias() {
      this.lista = JSON.parse(localStorage.getItem('auditorias') || '[]')
    },
    getOcorrenciaById(id) {
      return this.lista.find(o => o.id == id)
    }
  }
})
