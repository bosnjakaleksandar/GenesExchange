import { ref } from 'vue'

export interface CurrencyRate {
  currency: string
  currencyImage: string
  buyRate: number
  sellRate: number
  change: string
  lastUpdate: string
}

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID as string
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string
const RANGE = 'Sheet1!A2:F'

const formatDateTime = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date()
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

const areRatesEqual = (oldRates: CurrencyRate[], newRates: CurrencyRate[]): boolean => {
  if (oldRates.length !== newRates.length) return false
  return oldRates.every((oldRate, index) => {
    const newRate = newRates[index]
    return (
      oldRate.currency === newRate.currency &&
      oldRate.buyRate === newRate.buyRate &&
      oldRate.sellRate === newRate.sellRate &&
      oldRate.change === newRate.change
    )
  })
}

export function useRates() {
  const rates = ref<CurrencyRate[]>([])
  const lastUpdate = ref<string>('')
  const loading = ref<boolean>(false)

  const fetchRates = async () => {
    loading.value = true
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`,
      )
      const data = await response.json()
      if (data.values) {
        const newRates = data.values.map((row: string[]) => ({
          currency: row[0] || '',
          currencyImage: row[1] || '',
          buyRate: parseFloat(row[2]) || 0,
          sellRate: parseFloat(row[3]) || 0,
          change: row[4] || '',
          lastUpdate: row[5] || '',
        }))
        const savedLastUpdate = localStorage.getItem('ratesLastUpdate')
        if (rates.value.length === 0) {
          rates.value = newRates
          lastUpdate.value = savedLastUpdate || 'Need to update'
        } else if (!areRatesEqual(rates.value, newRates)) {
          rates.value = newRates
          const newTime = formatDateTime()
          lastUpdate.value = newTime
          localStorage.setItem('ratesLastUpdate', newTime)
        }
      }
    } catch (error) {
      console.error('Error fetching rates:', error)
    } finally {
      loading.value = false
    }
  }

  return { rates, lastUpdate, loading, fetchRates }
}
