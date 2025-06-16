<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { useRates } from '@/services/api/useRates'
import { useRateHistory } from '@/services/api/useRatesHistory'
import { Chart, registerables } from 'chart.js'
import ArrowSvg from '@/svg/ArrowSvg.vue'
import animations from '@/animations/animations'

Chart.register(...registerables)

const { rates, lastUpdate, loading, fetchRates } = useRates()
const { history, loading: loadingHistory, fetchHistory } = useRateHistory()

const selectedCurrency = ref<string>('')
const selectedType = ref<'buy' | 'sell'>('buy')
const selectedInterval = ref<'day' | 'week' | 'month' | 'year'>('day')
const detailsOpen = ref(false)
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const isMobile = ref(false)
const showSkeleton = ref(true)
const minSkeletonTime = ref(false)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 1024
}

const updateSkeletonVisibility = () => {
  showSkeleton.value = loading.value || !minSkeletonTime.value
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  fetchRates()
  setInterval(fetchRates, 30 * 60 * 1000)

  setTimeout(() => {
    minSkeletonTime.value = true
    updateSkeletonVisibility()
  }, 1000)

  animations()
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

watch(rates, async (newRates) => {
  if (newRates.length && !selectedCurrency.value) {
    selectedCurrency.value = newRates[0].currency
  }

  updateSkeletonVisibility()

  if (newRates.length > 0 && !showSkeleton.value) {
    await nextTick()
    animations()
  }
})

watch(loading, () => {
  updateSkeletonVisibility()
})

watch(showSkeleton, async (isSkeletonVisible) => {
  if (!isSkeletonVisible && rates.value.length > 0) {
    await nextTick()
    const table = document.querySelector('.rates__table') as HTMLElement
    if (table) {
      table.style.opacity = '0'
      table.style.transition = 'opacity 0.5s ease-in-out'
      setTimeout(() => {
        table.style.opacity = '1'
      }, 50)
    }

    const rightContent = document.querySelector('.rates__right-content') as HTMLElement
    if (rightContent) {
      rightContent.style.opacity = '0'
      rightContent.style.transition = 'opacity 0.5s ease-in-out'
      setTimeout(() => {
        rightContent.style.opacity = '1'
      }, 50)
    }
  }
})

watch(selectedCurrency, (newCurrency) => {
  if (newCurrency) {
    selectedType.value = 'buy'
    selectedInterval.value = 'day'
    fetchHistory(newCurrency, 'day')
  }
})

watch([selectedType, selectedInterval], () => {
  if (selectedCurrency.value) {
    fetchHistory(selectedCurrency.value, selectedInterval.value)
  }
})

watch(history, () => {
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
  if (!history.value.length) {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    return
  }

  const labels = history.value.map((entry) => entry.recorded_at.replace('T', ' ').substring(0, 16))
  const data = history.value.map((entry) =>
    selectedType.value === 'buy' ? entry.buyRate : entry.sellRate,
  )

  const minY = Math.min(...data)
  const maxY = Math.max(...data)
  const padding = (maxY - minY) * 0.1 || 0.5

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
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          display: false,
          min: minY - padding,
          max: maxY + padding,
        },
        x: { display: false },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          intersect: false,
          mode: 'index',
          callbacks: {
            label: function (context) {
              return `Kurs: ${context.parsed.y.toFixed(2)}`
            },
            title: function (context) {
              return `Vreme: ${context[0].label}`
            },
          },
        },
      },
    },
  })
}
</script>

<template>
  <section class="rates" :class="{ 'rates--details-open': detailsOpen }">
    <div class="rates__container">
      <div class="rates__top | js-from-down">
        <h1 class="rates__title i-48-700"><span>GENES</span>EXCHANGE</h1>
        <div class="rates__top-content">
          <p class="rates__time i-16-400">
            Poslednji put ažurirano: {{ lastUpdate || 'Error'
            }}<span v-if="loading"> (Updating...)</span>
          </p>
          <p class="rates__description i-16-400">
            Kursevi su informativnog karaktera i podložni su promenama.
          </p>
        </div>
      </div>

      <div class="rates__columns">
        <div class="rates__columns-left">
          <!-- Skeleton loader -->
          <div v-if="showSkeleton" class="rates__skeleton">
            <div class="rates__skeleton-header">
              <div class="rates__skeleton-item"></div>
              <div class="rates__skeleton-item"></div>
              <div class="rates__skeleton-item"></div>
            </div>
            <div class="rates__skeleton-rows">
              <div
                v-for="i in 7"
                :key="i"
                class="rates__skeleton-row"
                :style="{ animationDelay: `${i * 0.1}s` }"
              >
                <div class="rates__skeleton-item rates__skeleton-item--flag"></div>
                <div class="rates__skeleton-item rates__skeleton-item--currency"></div>
                <div class="rates__skeleton-item rates__skeleton-item--rate"></div>
                <div class="rates__skeleton-item rates__skeleton-item--rate"></div>
              </div>
            </div>
          </div>

          <!-- Rates table -->
          <table v-else class="rates__table">
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
                <td class="rates__table-more">
                  <span>⋮</span>
                </td>
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

          <!-- Right column skeleton -->
          <div v-if="showSkeleton" class="rates__right-skeleton">
            <div class="rates__right-skeleton-header">
              <div class="rates__right-skeleton-flag"></div>
              <div class="rates__right-skeleton-title"></div>
            </div>
            <div class="rates__right-skeleton-buttons">
              <div class="rates__right-skeleton-button"></div>
              <div class="rates__right-skeleton-button"></div>
            </div>
            <div class="rates__right-skeleton-chart"></div>
            <div class="rates__right-skeleton-buttons">
              <div class="rates__right-skeleton-button rates__right-skeleton-button--small"></div>
              <div class="rates__right-skeleton-button rates__right-skeleton-button--small"></div>
              <div class="rates__right-skeleton-button rates__right-skeleton-button--small"></div>
              <div class="rates__right-skeleton-button rates__right-skeleton-button--small"></div>
            </div>
          </div>

          <!-- Chart column -->
          <div v-else class="rates__right-content">
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
              <button
                :class="{ 'rates__interval-button--active': selectedType === 'buy' }"
                @click="handleTypeChange('buy')"
              >
                BUY
              </button>
              <button
                :class="{ 'rates__interval-button--active': selectedType === 'sell' }"
                @click="handleTypeChange('sell')"
              >
                SELL
              </button>
            </div>
            <div v-if="loadingHistory" class="rates__chart-loading">Učitavanje grafikona...</div>
            <canvas v-show="!loadingHistory" ref="chartCanvas" class="rates__chart"></canvas>
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
    </div>
  </section>
</template>

<style lang="scss" scoped src="./Rates.scss"></style>
