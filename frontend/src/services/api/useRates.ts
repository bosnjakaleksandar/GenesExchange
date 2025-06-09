import { ref } from 'vue'

export interface CurrencyRate {
  currency: string
  currencyImage: string
  buyRate: number
  sellRate: number
  lastUpdate: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string

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
      oldRate.sellRate === newRate.sellRate
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
        `${SUPABASE_URL}/rest/v1/rates?select=currency,currencyImage,buyRate,sellRate,sent_at&order=id.asc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        },
      )
      const data = await response.json()
      if (Array.isArray(data)) {
        const newRates = data.map((row: any) => ({
          currency: row.currency || '',
          currencyImage: row.currencyImage || '',
          buyRate: parseFloat(row.buyRate) || 0,
          sellRate: parseFloat(row.sellRate) || 0,
          lastUpdate: formatDateTime(row.sent_at),
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
