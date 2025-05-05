import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
Chart.defaults.font.family = "'Inter', sans-serif";

const dashboardData = {
  subscriptions: { deo: 150, morgan: 85 },
  payments: "40M",
  services: { approved: 230 },
  products: { approved: 180 },
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

const evolutionData = {
  all: {
    daily: [100, 110, 125, 115, 130],
    weekly: [250, 280, 300, 315],
    monthly: [280, 305, 320, 310, 330],
    yearly: [200, 250, 290, 310, 315]
  },
  rMobile: {
    daily: [70, 75, 85, 80, 90],
    weekly: [170, 190, 205, 210],
    monthly: [190, 200, 215, 205, 220],
    yearly: [130, 160, 190, 200, 210]
  },
  morgan: {
    daily: [30, 35, 40, 38, 45],
    weekly: [80, 90, 95, 105],
    monthly: [90, 100, 105, 100, 110],
    yearly: [60, 70, 80, 90, 105]
  },
  labels: {
    daily: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    weekly: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    yearly: ['2021', '2022', '2023', '2024', '2025']
  }
};

let chartInstances = {};

function updateStatCards() {
  const statCards = document.querySelectorAll(".grid-cols-4 > div");
  statCards[0].querySelector("p").textContent = (dashboardData.subscriptions.deo + dashboardData.subscriptions.morgan).toLocaleString();
  statCards[1].querySelector("p").textContent = dashboardData.payments;
  statCards[2].querySelector("p").textContent = dashboardData.services.approved.toLocaleString();
  statCards[3].querySelector("p").textContent = dashboardData.products.approved.toLocaleString();
}

function renderBarChart(ctxId, labels, data) {
  const ctx = document.getElementById(ctxId).getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Goal',
        data,
        backgroundColor: '#3B82F6',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderDoughnutChart(ctxId, accomplished, goal) {
  const ctx = document.getElementById(ctxId).getContext('2d');
  const achieved = (accomplished / goal) * 100;
  const remaining = Math.max(0, 100 - achieved);

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Achieved', 'Remainder'],
      datasets: [{
        data: [achieved, remaining],
        backgroundColor: ['#16A34A', '#DC2626'],
        hoverOffset: 4,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`
          }
        },
        datalabels: {
          color: '#fff',
          formatter: value => `${value.toFixed(1)}%`
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

function renderLineChart(ctxId, labels, data, color) {
  const ctx = document.getElementById(ctxId).getContext('2d');
  if (chartInstances[ctxId]) chartInstances[ctxId].destroy();
  
  const gradientStart = 0.6;
  const gradientEnd = 0.9;
  
  const gradient = ctx.createLinearGradient(
    0, 
    ctx.canvas.clientHeight * gradientStart, 
    0, 
    ctx.canvas.clientHeight * gradientEnd
  );
  
  gradient.addColorStop(0, `${color}`);
  gradient.addColorStop(0.5, `${color}66`);
  gradient.addColorStop(1, `${color}00`);

  chartInstances[ctxId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: gradient,
        borderColor: color,
        borderWidth: 1,
        fill: {
          target: 'origin',
          above: gradient
        },
        pointBackgroundColor: '#fff',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: {
          anchor: 'end',
          align: 'top',
          offset: -2,
          color: '#1676FF',
          font: { size: 10 }
        }
      },
      scales: {
        y: {  display: false,
          beginAtZero: false,
          grid: { display: false },
          border: { display: false },
          grace: '5%',
          suggestedMax: Math.max(...data) * 1.1 },
        x: { ticks: { 
          display: true,
          color: '#7D86A9' }, 
          grid: { display: false }, border: { display: false } }
      },
    },
    plugins: [ChartDataLabels]
  });
}

function addChartSwitchListeners(baseId, dataKey, color) {
  ['daily', 'weekly', 'monthly', 'yearly'].forEach(period => {
    document.getElementById(`${period}${baseId}`)?.addEventListener('click', () => {
      renderLineChart(`${baseId}Chart`, evolutionData.labels[period], evolutionData[dataKey][period], color);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateStatCards();

  renderBarChart('merchantChart', dashboardData.merchants.map(m => m.name), dashboardData.merchants.map(m => m.monthlyGoal));

  const totalGoal = dashboardData.merchants.reduce((sum, m) => sum + m.monthlyGoal, 0);
  const totalAccomplished = dashboardData.merchants.reduce((sum, m) => sum + m.accomplished, 0);
  renderDoughnutChart('totalMerchantProgressChart', totalAccomplished, totalGoal);

  renderLineChart('allSubscribersChart', evolutionData.labels.monthly, evolutionData.all.monthly, '#1676FF');
  renderLineChart('rMobileSubscribersChart', evolutionData.labels.monthly, evolutionData.rMobile.monthly, '#1676FF');
  renderLineChart('morganSubscribersChart', evolutionData.labels.monthly, evolutionData.morgan.monthly, '#1676FF');

  addChartSwitchListeners('Subscribers', 'all', '#1676FF');
  addChartSwitchListeners('RMobile', 'rMobile', '#1676FF');
  addChartSwitchListeners('Morgan', 'morgan', '#1676FF');
});