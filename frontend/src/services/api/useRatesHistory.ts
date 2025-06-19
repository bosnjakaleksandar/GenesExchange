import { ref } from 'vue'

export interface RateHistoryEntry {
  currency: string
  currencyImage: string
  buyRate: number
  sellRate: number
  recorded_at: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string

export function useRateHistory() {
  const history = ref<RateHistoryEntry[]>([])
  const loading = ref(false)

  async function fetchHistory(currency: string, interval: 'day' | 'week' | 'month' | 'year') {
    loading.value = true
    let fromDate = new Date()
    switch (interval) {
      case 'day':
        fromDate.setDate(fromDate.getDate() - 1)
        break
      case 'week':
        fromDate.setDate(fromDate.getDate() - 7)
        break
      case 'month':
        fromDate.setMonth(fromDate.getMonth() - 1)
        break
      case 'year':
        fromDate.setFullYear(fromDate.getFullYear() - 1)
        break
    }
    const fromISO = fromDate.toISOString()
    const url = `${SUPABASE_URL}/rest/v1/rate_history?currency=eq.${currency}&recorded_at=gte.${fromISO}&order=recorded_at.asc`
    try {
      const response = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      })
      const data = await response.json()
      if (Array.isArray(data) && data.length === 0) {
        const lastRateUrl = `${SUPABASE_URL}/rest/v1/rate_history?currency=eq.${currency}&order=recorded_at.desc&limit=1`
        const lastRateResponse = await fetch(lastRateUrl, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        })
        const lastRateData = await lastRateResponse.json()
        if (Array.isArray(lastRateData) && lastRateData.length > 0) {
          const lastRate = lastRateData[0]
          const now = new Date().toISOString()
          history.value = [
            { ...lastRate, recorded_at: fromISO },
            { ...lastRate, recorded_at: now },
          ]
        } else {
          history.value = []
        }
      } else {
        history.value = Array.isArray(data) ? data : []
      }
    } finally {
      loading.value = false
    }
  }

  return { history, loading, fetchHistory }
}
