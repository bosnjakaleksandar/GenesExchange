<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRates } from '@/services/api/useRates'
import { Chart, registerables } from 'chart.js'
import ArrowSvg from '@/svg/ArrowSvg.vue'
Chart.register(...registerables)

const { rates, lastUpdate, loading, fetchRates } = useRates()
const selectedCurrency = ref<string>('')
const selectedType = ref<'buy' | 'sell'>('buy')
const selectedInterval = ref<'day' | 'week' | 'month' | 'year'>('day')

const detailsOpen = ref(false)

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const isMobile = ref(false)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 1024
}
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  fetchRates()
  setInterval(fetchRates, 30 * 60 * 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
  if (chartInstance) {
    chartInstance.destroy()
  }
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

watch(rates, (newRates) => {
  if (newRates.length && !selectedCurrency.value) {
    selectedCurrency.value = newRates[0].currency
  }
})

watch([selectedCurrency, selectedType, selectedInterval], () => {
  renderChart()
})

const handleRowClick = (currency: string) => {
  selectedCurrency.value = currency
  if (isMobile.value) {
    detailsOpen.value = true
  }
}

const handleBack = () => {
  detailsOpen.value = false
}

const handleTypeChange = (type: 'buy' | 'sell') => {
  selectedType.value = type
}

const handleIntervalChange = (interval: 'day' | 'week' | 'month' | 'year') => {
  selectedInterval.value = interval
}

function renderChart() {
  if (!chartCanvas.value) return
  const rate = rates.value.find((r) => r.currency === selectedCurrency.value)
  if (!rate) return

  const labels = Array(10)
    .fill('')
    .map((_, i) => `${selectedInterval.value}-${i + 1}`)
  const data = Array(10).fill(selectedType.value === 'buy' ? rate.buyRate : rate.sellRate)

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data,
          borderColor: '#e0a501',
          backgroundColor: 'rgba(224, 165, 1, 0.1)',
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { display: false },
        x: { display: false },
      },
      plugins: {
        legend: { display: false },
      },
    },
  })
}
</script>

<template>
  <section class="rates" :class="{ 'rates--details-open': detailsOpen }">
    <div class="rates__container">
      <div class="rates__top">
        <h1 class="rates__title i-48-700"><span>GENES</span>EXCHANGE</h1>
        <p class="rates__time i-16-400">
          Last update: {{ lastUpdate || 'Error' }}<span v-if="loading"> (Updating...)</span>
        </p>
      </div>

      <div class="rates__columns">
        <div class="rates__columns-left">
          <table class="rates__table">
            <thead>
              <tr>
                <th class="i-16-700">Valuta</th>
                <th class="i-16-700">Kupovni</th>
                <th class="i-16-700">Prodajni</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rate in rates"
                :key="rate.currency"
                :class="{ 'rates__table-row--selected': rate.currency === selectedCurrency }"
                @click="handleRowClick(rate.currency)"
                style="cursor: pointer"
              >
                <td class="i-16-400 rates__table-currency">
                  <img
                    v-if="rate.currencyImage"
                    :src="rate.currencyImage"
                    :alt="rate.currency"
                    class="rates__table-flag"
                    @error="handleImageError"
                  />
                  <span>{{ rate.currency }}</span>
                </td>
                <td class="i-16-400">{{ rate.buyRate.toFixed(2) }}</td>
                <td class="i-16-400">{{ rate.sellRate.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rates__columns-right">
          <button
            v-if="detailsOpen && isMobile"
            @click="handleBack"
            class="rates__back-btn"
            aria-label="Back"
          >
            <ArrowSvg />
          </button>
          <div class="rates__chart-header">
            <img
              v-if="rates.find((r) => r.currency === selectedCurrency)?.currencyImage"
              :src="rates.find((r) => r.currency === selectedCurrency)?.currencyImage"
              :alt="selectedCurrency"
              class="rates__table-flag"
              @error="handleImageError"
              style="width: 40px; height: 30px"
            />
            <h2 class="i-24-600" style="display: flex; align-items: center; gap: 10px">
              {{ selectedCurrency }} - {{ selectedType === 'buy' ? 'Kupovni' : 'Prodajni' }}
            </h2>
          </div>
          <div class="rates__interval-buttons">
            <button :class="{ 'rates__interval-button--active': selectedType === 'buy' }" @click="handleTypeChange('buy')">
              BUY
            </button>
            <button :class="{ 'rates__interval-button--active': selectedType === 'sell' }" @click="handleTypeChange('sell')">
              SELL
            </button>
          </div>
          <canvas ref="chartCanvas" class="rates__chart"></canvas>
          <div class="rates__interval-buttons">
            <button
              v-for="interval in ['day', 'week', 'month', 'year']"
              :key="interval"
              :class="{ 'rates__interval-button--active': selectedInterval === interval }"
              @click="handleIntervalChange(interval as 'day' | 'week' | 'month' | 'year')"
            >
              {{ interval.charAt(0).toUpperCase() + interval.slice(1) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped src="./Rates.scss"></style>
