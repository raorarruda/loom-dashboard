import { formatNumber } from './utils';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
Chart.defaults.font.family = "'Inter', sans-serif";

document.addEventListener("DOMContentLoaded", function(){

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    menuToggle.addEventListener("click", function(){
        nav.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });
});

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
    { name: "Pay Market", monthlyGoal: 5000, accomplished: 4200 },
    { name: "Mary's Shop", monthlyGoal: 3200, accomplished: 3500 },
    { name: "Uni Market", monthlyGoal: 7800, accomplished: 6500 },
    { name: "Natural Food", monthlyGoal: 2500, accomplished: 2800 }
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

function initFilterMenus(){
  document.querySelectorAll(".filter-toggle").forEach(button => {
    button.addEventListener("click", function(e){
      e.stopPropagation();
      const menu = button.nextElementSibling;

      document.querySelectorAll(".filter-menu").forEach(m =>{
        if (m !== menu) m.classList.add("hidden");
      });

      menu.classList.toggle("hidden");
    });
  });

  document.addEventListener("click", function(){
    document.querySelectorAll(".filter-menu").forEach(menu => {
      menu.classList.add("hidden");
    });
  });

  document.querySelectorAll(".filter-menu").forEach(menu => {
    menu.addEventListener("click", function(e){
      e.stopPropagation();
    });
  });

  setupChartFilter("allSubscribersChart", "all");
  setupChartFilter("rMobileSubscribersChart", "rMobile");
  setupChartFilter("morganSubscribersChart", "morgan");
}

function setupChartFilter(chartId, dataKey){
  const options = document.querySelectorAll(`[data-chart="${chartId}"] + .filter-menu .filter-option`);

  options.forEach(option => {
    option.addEventListener("click", function(){
      const period = this.getAttribute('data-period');
      updateChartWithPeriod(chartId, dataKey, period);

      this.closest(".filter-menu").classList.add("hidden");

      updateActiveFilterStyle(this);

    });
  });
}

function updateActiveFilterStyle(selectedOption){
  selectedOption.closest(".filter-menu").querySelectorAll(".filter-option").forEach(opt => {
    opt.classList.remove("bg-gray-100", "font-medium");
  });

  selectedOption.classList.add("bg-gray-100", "font-medium");
}

function updateChartWithPeriod(chartId, dataKey, period){
  const labels = evolutionData.labels[period];
  const data = evolutionData[dataKey][period];
  const color = '#1676FF';

  if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
    }

    chartInstances[chartId] = renderLineChart(chartId, labels, data, color);
}

function updateStatCards() {
  const statCards = document.querySelectorAll(".grid-cols-4 > div");
  statCards[0].querySelector("p").textContent = `${formatNumber(dashboardData.subscriptions.deo + dashboardData.subscriptions.morgan)}`;
  statCards[1].querySelector("p").textContent = dashboardData.payments;
  statCards[2].querySelector("p").textContent = `${formatNumber(dashboardData.services.approved)}`;
  statCards[3].querySelector("p").textContent = `${formatNumber(dashboardData.products.approved)}`;

  const totalGoal = dashboardData.merchants.reduce((sum, m) => sum + m.monthlyGoal, 0);
  const totalAccomplished = dashboardData.merchants.reduce((sum, m)=> sum + m.accomplished, 0);
  const totalRemaining = Math.max(0, totalGoal - totalAccomplished);

  document.getElementById("totalMonthlyGoal").textContent = `$${formatNumber(totalGoal)}`;
  document.getElementById("valueAccomplished").textContent = `$${formatNumber(totalAccomplished)}`;
  document.getElementById("valueRemaining").textContent = `$${formatNumber(totalAccomplished)}`;
}

function renderBarChart(ctxId, labels, data) {
  const ctx = document.getElementById(ctxId).getContext('2d');
  
  const barHeight = 6;
  const barSpacing = 10;
  const minHeight = 300;
  const maxHeight = 220;

  const calculatedHeight = labels.length * (barHeight + barSpacing) + 100;
  const chartHeight = Math.min(Math.max(calculatedHeight, minHeight), maxHeight);

  const container = document.getElementById(ctxId).parentElement;
  container.style.height = `${chartHeight}px`;
  container.style.overflow = 'visible';

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Goal',
        data,
        backgroundColor: '#1676FF',
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 10,
          bottomRight: 10
        },
        barThickness: barHeight,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',   
          align: 'right',
          offset: 5,
          color: '#5B6591',
          font: { 
            weight: 'bold',
            size: 12
          },
          formatter: function(value) {
            return `$${formatNumber(value)}`;
          }
        }
      },
      scales: {
        y: {
          position: 'left',
          ticks: {
            display: true,
            padding: 0,
            crossAlign: 'far',
            mirror: false,
            font: {
              size: 14,
              color: '#5B6591',
            }
          },
          grid: { display: false },
          border: { display: false },
          afterFit: function(scale) {
            scale.paddingTop = 0;
            scale.paddingBottom = 0;
            scale.width = 120;
          }
        },
        x: {
          ticks: { display: false },
          grid: { display: false },
          border: { display: false },
          afterFit: function(scale) {
            scale.paddingRight = 50;
          },
        }
      },
      layout: {
        padding: {
          left: 0,
          right: 50,
          top: 20,
          bottom: 20
        }
      },
      elements: {
        bar: {
          borderSkipped: 'false',
          borderWidth: 0,
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

const centerPercentagePlugin = {
  id: 'centerPercentage',
  afterDraw: (chart, args, options) => {
    const { ctx, chartArea: { width, height } } = chart;
    const achievedPercentage = chart.config.data.datasets[0].data[0];
    const percentageText = `${achievedPercentage}%`;
    const completedText = 'Completed';
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.save();

    // percentage
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#181E51';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percentageText, centerX, centerY - 10);

    // completed
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#5B6591';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(completedText, centerX, centerY + 10);

    ctx.restore();
  }
};

function renderDoughnutChart(ctxId, accomplished, goal) {
  const canvas = document.getElementById(ctxId);
  const container = canvas.parentElement;
  
  container.style.position = 'relative';
  container.style.overflow = 'visible';
  container.style.width = '130px';
  container.style.height = '130px';
  
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext('2d');
  const achievedPercentage = ((accomplished / goal) * 100).toFixed(1);
  const remaining = Math.max(0, 100 - parseFloat(achievedPercentage));

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Achieved', 'Remainder'],
      datasets: [{
        data: [achievedPercentage, remaining],
        backgroundColor: ['#1676FF', '#DCE3F6'],
        hoverOffset: 4,
        borderWidth: 0
      }]
    },
    options: {
      responsive: false, // Alterado para false para controle absoluto
      maintainAspectRatio: false,
      cutout: '95%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: { display: false }
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    },
    plugins: [centerPercentagePlugin]
  });
}

function renderLineChart(ctxId, labels, data, color) {
    const canvas = document.getElementById(ctxId);
    const container = canvas.parentElement;
    
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.width = '100%';
    container.style.maxWidth = '600px';
    container.style.maxHeight = '220px';
    
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    
    const gradientStart = 0.4;
    const gradientEnd = 0.8;
    
    const gradient = ctx.createLinearGradient(
        0, 
        ctx.canvas.clientHeight * gradientStart, 
        0, 
        ctx.canvas.clientHeight * gradientEnd
    );
    
    gradient.addColorStop(0, `${color}`);
    gradient.addColorStop(0.5, `${color}66`);
    gradient.addColorStop(1, `${color}00`);

    return new Chart(ctx, {
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
            maintainAspectRatio: false,
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
                y: {  
                    display: false,
                    beginAtZero: false,
                    grid: { display: false },
                    border: { display: false },
                    grace: '5%',
                    suggestedMax: Math.max(...data) * 1.1 
                },
                x: { 
                    ticks: { 
                        display: true,
                        color: '#5B6591',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 10
                    }, 
                    grid: { display: false }, 
                    border: { display: false } 
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 0,
                    bottom: 32
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

document.addEventListener("DOMContentLoaded", () => {
  updateStatCards();

  renderBarChart('merchantChart', dashboardData.merchants.map(m => m.name), dashboardData.merchants.map(m => m.monthlyGoal));

  const totalGoal = dashboardData.merchants.reduce((sum, m) => sum + m.monthlyGoal, 0);
  const totalAccomplished = dashboardData.merchants.reduce((sum, m) => sum + m.accomplished, 0);
  renderDoughnutChart('totalMerchantProgressChart', totalAccomplished, totalGoal);

  chartInstances['allSubscribersChart'] = renderLineChart(
        'allSubscribersChart', 
        evolutionData.labels.monthly, 
        evolutionData.all.monthly, 
        '#1676FF'
    );

  chartInstances['rMobileSubscribersChart'] = renderLineChart(
    'rMobileSubscribersChart', 
    evolutionData.labels.monthly, 
    evolutionData.rMobile.monthly, 
    '#1676FF'
  );

  chartInstances['morganSubscribersChart'] = renderLineChart(
    'morganSubscribersChart', 
    evolutionData.labels.monthly, 
    evolutionData.morgan.monthly, 
    '#1676FF'
  );

    initFilterMenus();

  addChartSwitchListeners('Subscribers', 'all', '#1676FF');
  addChartSwitchListeners('RMobile', 'rMobile', '#1676FF');
  addChartSwitchListeners('Morgan', 'morgan', '#1676FF');
});