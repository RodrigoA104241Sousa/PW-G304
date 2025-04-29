<template>
    <div class="dashboard-container">
      <aside class="sidebar">
        <h1>Eyes<br />EveryWhere</h1>
        <nav>
          <p>Filtros</p>
          <ul>
            <li>Mais Recente</li>
            <li>Mais Antiga</li>
            <li>Data</li>
            <li>Tipo de Auditoria</li>
            <li>Buraco na Estrada</li>
            <li>Passeio Danificado</li>
            <li>Falta de Sinalização</li>
            <li>Iluminação Pública</li>
            <li>Estado</li>
            <li>Concluída</li>
            <li>Não Concluída</li>
            <li>Em Progresso</li>
          </ul>
        </nav>
      </aside>
  
      <main class="content">
        <div class="cards-grid">
          <div class="card">👷<br /><strong>11k</strong><br />Profissionais Disponíveis</div>
          <div class="card">💶<br /><strong>13€</strong><br />Custo de materiais usados</div>
          <div class="card">👷‍♂️<br /><strong>11k</strong><br />Profissionais em Ação</div>
          <div class="card">📋<br /><strong>973</strong><br />Auditorias Realizadas</div>
          <div class="card">✅<br /><strong>973</strong><br />Ocorrências Resolvidas</div>
        </div>
  
        <div class="charts-grid">
          <div class="chart-box">
            <canvas id="pieChart"></canvas>
          </div>
          <div class="chart-box">
            <canvas id="lineChart"></canvas>
          </div>
          <div class="chart-box wide">
            <canvas id="barChart"></canvas>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
  name: 'AppDashboard',
    setup() {
      onMounted(() => {
        new Chart(document.getElementById('pieChart'), {
          type: 'doughnut',
          data: {
            labels: ['Jordão', 'Portugal', 'Ruas'],
            datasets: [{
              data: [40, 32, 28],
              backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            }]
          }
        });
  
        new Chart(document.getElementById('lineChart'), {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Ocorrências resolvidas',
              data: [50, 60, 80, 100, 90, 120],
              borderColor: '#36A2EB',
              fill: false
            }]
          }
        });
  
        new Chart(document.getElementById('barChart'), {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Materiais Usados',
              data: [30, 50, 70, 60, 90, 80],
              backgroundColor: ['#FFCE56']
            }]
          }
        });
      });
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    height: 100vh;
    font-family: Arial, sans-serif;
  }
  
  .sidebar {
    width: 250px;
    background-color: navy;
    color: white;
    padding: 20px;
    overflow-y: auto;
  }
  
  .sidebar h1 {
    margin-bottom: 30px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar li {
    margin: 10px 0;
  }
  
  .content {
    flex: 1;
    padding: 20px;
    background-color: #f0f2f5;
    overflow-y: auto;
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: 1.1rem;
  }
  
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
  
  .chart-box {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .chart-box.wide {
    grid-column: span 2;
  }
  </style>
  