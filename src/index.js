import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

// Novos dados fictícios
const dashboardData = {
  subscriptions: {
    deo: 150,
    morgan: 85
  },
  payments: "40M",
  services: {
    approved: 230
  },
  products: {
    approved: 180
  },
  operators: {
    allSubscribers: 315,
    rMobileSubscribers: 210,
    morganSubscribers: 105
  },
  merchants: [
    { name: "Mercado Bom Preço", monthlyGoal: 5000, accomplished: 4200 },
    { name: "Loja da Maria", monthlyGoal: 3200, accomplished: 3500 },
    { name: "Supermercado União", monthlyGoal: 7800, accomplished: 6500 },
    { name: "Hortifruti Natural", monthlyGoal: 2500, accomplished: 2800 }
  ]
};

const allSubscribersEvolutionData = {
    daily: {
      labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5'],
      data: [100, 110, 125, 115, 130]
    },
    weekly: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [250, 280, 300, 315]
    },
    monthly: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      data: [280, 305, 320, 310, 330]
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      data: [200, 250, 290, 310, 315]
    }
  };

  const rMobileSubscribersEvolutionData = {
    daily: {
      labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5'],
      data: [70, 75, 85, 80, 90]
    },
    weekly: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [170, 190, 205, 210]
    },
    monthly: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      data: [190, 200, 215, 205, 220]
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      data: [130, 160, 190, 200, 210]
    }
  };

  const morganSubscribersEvolutionData = {
    daily: {
      labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5'],
      data: [30, 35, 40, 38, 45]
    },
    weekly: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [80, 90, 95, 105]
    },
    monthly: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      data: [90, 100, 105, 100, 110]
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      data: [60, 70, 80, 90, 105]
    }
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const statCards = document.querySelectorAll(".grid-cols-4 > div");
  
    // Atualização dos cards
    const totalSubscriptions = dashboardData.subscriptions.deo + dashboardData.subscriptions.morgan;
    statCards[0].querySelector("p").textContent = totalSubscriptions.toLocaleString();
    statCards[1].querySelector("p").textContent = dashboardData.payments;
    statCards[2].querySelector("p").textContent = dashboardData.services.approved.toLocaleString();
    statCards[3].querySelector("p").textContent = dashboardData.products.approved.toLocaleString();
  
    // Gráfico de metas dos comerciantes (barra horizontal)
    const merchantGoalCtx = document.getElementById('merchantChart').getContext('2d');
    new Chart(merchantGoalCtx, {
      type: 'bar',
      data: {
        labels: dashboardData.merchants.map(m => m.name),
        datasets: [{
          label: 'Monthly Goal',
          data: dashboardData.merchants.map(m => m.monthlyGoal),
          backgroundColor: '#3B82F6',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Gráfico de progresso total dos comerciantes (doughnut)
    const totalMerchantProgressCtx = document.getElementById('totalMerchantProgressChart').getContext('2d');
  
    let totalMonthlyGoal = 0;
    let totalAccomplished = 0;
  
    dashboardData.merchants.forEach(merchant => {
      totalMonthlyGoal += merchant.monthlyGoal;
      totalAccomplished += merchant.accomplished;
    });
  
    const totalRemainingPercentage = Math.max(0, (1 - (totalAccomplished / totalMonthlyGoal)) * 100);
    const totalAccomplishedPercentage = (totalAccomplished / totalMonthlyGoal) * 100;
  
    new Chart(totalMerchantProgressCtx, {
      type: 'doughnut',
      data: {
        labels: ['Alcançado', 'Restante'],
        datasets: [{
          data: [totalAccomplishedPercentage, totalRemainingPercentage],
          backgroundColor: ['#16A34A', '#DC2626'], // Verde para Alcançado, Vermelho para Restante
          hoverOffset: 4,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (context.parsed !== null) {
                  label += `: ${context.parsed.toFixed(1)}%`;
                }
                return label;
              }
            }
          },
          title: {
            display: true,
            text: 'Progresso Total dos Comerciantes'
          },
          datalabels: {
            color: '#fff',
            formatter: (value, context) => {
              return `${value.toFixed(1)}%`;
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  
    // Gráfico de área para All Subscribers ao longo do tempo
    const allSubscribersCtx = document.getElementById('allSubscribersChart').getContext('2d');
    const initialPeriod = 'monthly'; // Período inicial
  
    function updateAllSubscribersChart(period) {
      const data = allSubscribersEvolutionData[period];
      new Chart(allSubscribersCtx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Todos os Assinantes',
            data: data.data,
            backgroundColor: 'rgba(22, 118, 255, 0.4)', // Roxo com transparência
            borderColor: '#1676FF', // Roxo sólido
            borderWidth: 2,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Inicializa o gráfico com o período inicial
    updateAllSubscribersChart(initialPeriod);
  
    // Adiciona event listeners para os botões de filtro (se você tiver botões com esses IDs)
  document.getElementById('dailySubscribers')?.addEventListener('click', () => updateAllSubscribersChart('daily'));
  document.getElementById('weeklySubscribers')?.addEventListener('click', () => updateAllSubscribersChart('weekly'));
  document.getElementById('monthlySubscribers')?.addEventListener('click', () => updateAllSubscribersChart('monthly'));
  document.getElementById('yearlySubscribers')?.addEventListener('click', () => updateAllSubscribersChart('yearly'));

  // Gráfico de área para R-Mobile Subscribers ao longo do tempo
  const rMobileSubscribersCtx = document.getElementById('rMobileSubscribersChart').getContext('2d');
  const initialRMobileSubscribersPeriod = 'monthly'; // Período inicial
  let rMobileSubscribersChartInstance;

  function updateRMobileSubscribersChart(period) {
    const data = rMobileSubscribersEvolutionData[period];
    if (rMobileSubscribersChartInstance) {
      rMobileSubscribersChartInstance.destroy();
    }
    rMobileSubscribersChartInstance = new Chart(rMobileSubscribersCtx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Assinantes R-Mobile',
          data: data.data,
          backgroundColor: 'rgba(255, 99, 132, 0.4)', // Vermelho com transparência
          borderColor: 'rgba(255, 99, 132, 1)', // Vermelho sólido
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Evolução de Assinantes R-Mobile (${period})`
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Inicializa o gráfico com o período inicial
  updateRMobileSubscribersChart(initialRMobileSubscribersPeriod);

  // Adiciona event listeners para os botões de filtro (se você tiver botões com esses IDs)
  document.getElementById('dailyRMobile')?.addEventListener('click', () => updateRMobileSubscribersChart('daily'));
  document.getElementById('weeklyRMobile')?.addEventListener('click', () => updateRMobileSubscribersChart('weekly'));
  document.getElementById('monthlyRMobile')?.addEventListener('click', () => updateRMobileSubscribersChart('monthly'));
  document.getElementById('yearlyRMobile')?.addEventListener('click', () => updateRMobileSubscribersChart('yearly'));

  // Gráfico de área para Morgan Subscribers ao longo do tempo
  const morganSubscribersCtx = document.getElementById('morganSubscribersChart').getContext('2d');
  const initialMorganSubscribersPeriod = 'monthly'; // Período inicial
  let morganSubscribersChartInstance;

  function updateMorganSubscribersChart(period) {
    const data = morganSubscribersEvolutionData[period];
    if (morganSubscribersChartInstance) {
      morganSubscribersChartInstance.destroy();
    }
    morganSubscribersChartInstance = new Chart(morganSubscribersCtx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Assinantes Morgan',
          data: data.data,
          backgroundColor: 'rgba(54, 162, 235, 0.4)', // Azul com transparência
          borderColor: 'rgba(54, 162, 235, 1)', // Azul sólido
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Evolução de Assinantes Morgan (${period})`
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Inicializa o gráfico com o período inicial
  updateMorganSubscribersChart(initialMorganSubscribersPeriod);

  // Adiciona event listeners para os botões de filtro (se você tiver botões com esses IDs)
  document.getElementById('dailyMorgan')?.addEventListener('click', () => updateMorganSubscribersChart('daily'));
  document.getElementById('weeklyMorgan')?.addEventListener('click', () => updateMorganSubscribersChart('weekly'));
  document.getElementById('monthlyMorgan')?.addEventListener('click', () => updateMorganSubscribersChart('monthly'));
  document.getElementById('yearlyMorgan')?.addEventListener('click', () => updateMorganSubscribersChart('yearly'));
});