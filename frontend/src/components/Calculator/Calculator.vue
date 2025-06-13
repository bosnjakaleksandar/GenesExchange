<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRates, type CurrencyRate } from '@/services/api/useRates'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const { rates, fetchRates, loading } = useRates()
const selectedCurrency = ref<CurrencyRate | null>(null)
const amount = ref<number | null>(null)
const isReverse = ref(false)

onMounted(fetchRates)

watch(rates, (newRates) => {
  if (!selectedCurrency.value && newRates.length) {
    const eur = newRates.find((r) => r.currency === 'EUR')
    if (eur) selectedCurrency.value = eur
  }
})

const result = computed(() => {
  if (!selectedCurrency.value || !amount.value) return ''
  if (isReverse.value) {
    return (amount.value * selectedCurrency.value.sellRate).toFixed(2)
  }
  return (amount.value * selectedCurrency.value.buyRate).toFixed(2)
})

function onAmountInput(e: Event) {
  const value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
  amount.value = value ? parseFloat(value) : null
}

function toggleReverse() {
  isReverse.value = !isReverse.value
  amount.value = null
}
</script>

<template>
  <section class="calculator">
    <div class="calculator__container">
      <div class="calculator__card">
        <div class="calculator__card-top">
          <p class="calculator__card-text i-14-400">
            {{ isReverse ? 'Iznos za kupovinu strane valute' : 'Iznos za zamenu strane valute' }}
          </p>
          <div v-if="!loading" class="calculator__inputs i-14-400">
            <img
              v-if="selectedCurrency?.currencyImage"
              :src="selectedCurrency.currencyImage"
              alt="Valuta"
              class="calculator__currency-image"
            />
            <Multiselect
              v-model="selectedCurrency"
              :options="rates"
              :track-by="'currency'"
              :label="'currency'"
              placeholder="Izaberite valutu"
              class="calculator__dropdown"
              :disabled="!rates.length"
              :allow-empty="false"
              :show-labels="false"
            >
              <template #option="{ option }">
                <span>
                  {{ option.currency }}
                </span>
              </template>
              <template #singleLabel="{ option }">
                <span>
                  {{ option.currency }}
                </span>
              </template>
            </Multiselect>
            <input
              type="text"
              v-model="amount"
              placeholder="Iznos"
              class="calculator__input i-14-400"
              :disabled="!selectedCurrency"
              @input="onAmountInput"
            />
          </div>
        </div>
        <div class="calculator__card-middle">
          <hr class="calculator__divider" />
          <span class="calculator__change" @click="toggleReverse" style="cursor: pointer"
            ><font-awesome-icon :icon="['fas', 'arrow-right-arrow-left']"
          /></span>
        </div>
        <div class="calculator__card-bottom">
          <p class="calculator__card-text i-14-400">
            {{
              isReverse
                ? 'Koliko dinara je potrebno za željeni iznos strane valute'
                : 'Koliko dinara biste dobili za iznos koji menjate'
            }}
          </p>
          <div class="calculator__result">
            <span v-if="result">
              <img class="calculator__currency-image" src="https://flagcdn.com/h40/rs.png" />
              {{ result }} RSD
            </span>
            <span v-else class="i-14-400">
              <img class="calculator__currency-image" src="https://flagcdn.com/h40/rs.png" />
              Unesite iznos i izaberite valutu da biste dobili rezultat
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" src="./Calculator.scss"></style>
