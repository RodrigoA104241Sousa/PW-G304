import { defineStore } from 'pinia'

export const useOcorrenciasStore = defineStore('ocorrencias', {
  state: () => ({
    lista: []
  }),
  actions: {
    carregarOcorrencias() {
      this.lista = JSON.parse(localStorage.getItem('ocorrencias') || '[]')
    },
    getOcorrenciaById(id) {
      return this.lista.find(o => o.id == id)
    }
  }
})
