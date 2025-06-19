<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRates, type CurrencyRate } from '@/services/api/useRates'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const { rates, fetchRates, loading } = useRates()
const selectedCurrency = ref<CurrencyRate | null>(null)
const amount = ref<number | null>(null)
const isReverse = ref(false)
const isChangeActive = ref(false)

onMounted(fetchRates)

watch(rates, (newRates) => {
  if (!selectedCurrency.value && newRates.length) {
    const eur = newRates.find((r) => r.currency === 'EUR')
    if (eur) selectedCurrency.value = eur
  }
})

const result = computed(() => {
  if (!selectedCurrency.value || !amount.value) return ''
  let calculatedResult: number
  if (isReverse.value) {
    calculatedResult = amount.value * selectedCurrency.value.sellRate
  } else {
    calculatedResult = amount.value * selectedCurrency.value.buyRate
  }
  return calculatedResult.toLocaleString('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

function onAmountInput(e: Event) {
  const value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
  amount.value = value ? parseFloat(value) : null
}

function toggleReverse() {
  isReverse.value = !isReverse.value
  amount.value = null
}

function isDesktop() {
  return window.innerWidth >= 1024
}

function handleChangeHover(state: boolean) {
  if (isDesktop()) {
    isChangeActive.value = state
  }
}

function handleChangeClick() {
  if (!isDesktop()) {
    isChangeActive.value = !isChangeActive.value
  }
}
</script>

<template>
  <section class="calculator">
    <div class="calculator__container">
      <div class="calculator__card">
        <Transition name="fade" mode="out-in">
          <div :key="isReverse ? 'reversed-top' : 'normal-top'" class="calculator__card-top">
            <p class="calculator__card-text i-14-400" v-if="!isReverse">
              Iznos za zamenu strane valute
            </p>
            <p class="calculator__card-text i-14-400" v-else>
              Koliko dinara je potrebno za željeni iznos strane valute
            </p>

            <div v-if="!loading && !isReverse" class="calculator__inputs i-14-400">
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
                :options-limit="300"
                :open-direction="'bottom'"
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

            <div v-if="isReverse" class="calculator__result">
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
        </Transition>

        <div class="calculator__card-middle">
          <hr class="calculator__divider" />
          <span
            class="calculator__change"
            :class="{ 'calculator__change--active': isChangeActive }"
            @click="
              () => {
                toggleReverse()
                handleChangeClick()
              }
            "
            @mouseenter="() => handleChangeHover(true)"
            @mouseleave="() => handleChangeHover(false)"
            style="cursor: pointer"
          >
            <font-awesome-icon :icon="['fas', 'arrow-right-arrow-left']" />
          </span>
        </div>

        <Transition name="fade" mode="out-in">
          <div
            :key="isReverse ? 'reversed-bottom' : 'normal-bottom'"
            class="calculator__card-bottom"
          >
            <p class="calculator__card-text i-14-400" v-if="!isReverse">
              Koliko dinara biste dobili za iznos koji menjate
            </p>
            <p class="calculator__card-text i-14-400" v-else>Iznos za kupovinu strane valute</p>

            <div v-if="!isReverse" class="calculator__result">
              <span v-if="result">
                <img class="calculator__currency-image" src="https://flagcdn.com/h40/rs.png" />
                {{ result }} RSD
              </span>
              <span v-else class="i-14-400">
                <img class="calculator__currency-image" src="https://flagcdn.com/h40/rs.png" />
                Unesite iznos i izaberite valutu da biste dobili rezultat
              </span>
            </div>

            <div v-if="!loading && isReverse" class="calculator__inputs i-14-400">
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
                :options-limit="300"
                :open-direction="'bottom'"
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
        </Transition>
      </div>
    </div>
  </section>
</template>
<style lang="scss" src="./Calculator.scss"></style>
