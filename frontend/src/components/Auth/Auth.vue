<script lang="ts" setup>
import { ref, computed } from 'vue'

const activeTab = ref('login')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isSignup = computed(() => activeTab.value === 'signup')

const toggleTab = () => {
  activeTab.value = activeTab.value === 'login' ? 'signup' : 'login'
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <section class="auth">
    <div class="auth__container">
      <div class="auth__image">
        <img src="@/img/Currency-Exchange.png" alt="Currency Exchange Image" />
      </div>
      <div class="auth__card">
        <div class="auth__card-header">
          <h1 class="auth__card-title i-48-700"><span>GENES</span>EXCHANGE</h1>
          <h2 class="auth__card-subtitle i-20-500">
            {{ isSignup ? 'Create your account' : 'Sign in to your account' }}
          </h2>
        </div>
        <div class="auth__card-body">
          <!-- Email Input -->
          <label for="email" class="auth__label i-14-600">Email</label>
          <div class="auth__input-wrapper">
            <input
              type="email"
              placeholder="Enter your email address"
              class="auth__input i-16-400"
            />
            <font-awesome-icon :icon="['fas', 'envelope']" class="auth__input-icon" />
          </div>

          <!-- Password Input -->
          <label for="password" class="auth__label i-14-600">Password</label>
          <div class="auth__input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="auth__input i-16-400"
            />
            <font-awesome-icon :icon="['fas', 'lock']" class="auth__input-icon" />
            <font-awesome-icon
              :icon="showPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']"
              class="auth__input-icon auth__input-icon--right"
              @click="togglePasswordVisibility"
            />
          </div>

          <!-- Confirm Password Input (only for signup) -->
          <Transition name="slide-fade">
            <label v-if="isSignup" for="confirmPassword" class="auth__label i-14-600"
              >Confirm Password</label
            >
          </Transition>
          <Transition name="slide-fade">
            <div v-if="isSignup" class="auth__input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                class="auth__input i-16-400"
              />
              <font-awesome-icon :icon="['fas', 'lock']" class="auth__input-icon" />
              <font-awesome-icon
                :icon="showConfirmPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']"
                class="auth__input-icon auth__input-icon--right"
                @click="toggleConfirmPasswordVisibility"
              />
            </div>
          </Transition>

          <!-- Submit Button -->
          <button class="auth__button i-16-600">
            {{ isSignup ? 'Create Account' : 'Sign In' }}
          </button>

          <!-- Toggle Link -->
          <p class="auth__card-footer-text i-14-400">
            {{ isSignup ? 'Already have an account? ' : "Don't have an account? " }}
            <span class="auth__link i-14-600" @click="toggleTab">
              {{ isSignup ? 'Login' : 'Sign up' }}
            </span>
          </p>
        </div>
        <div class="auth__card-social">
          <div class="auth__card-social-header">
            <span class="auth__divider"></span>
            <p class="auth__card-social-text i-12-400">Or continue with</p>
            <span class="auth__divider"></span>
          </div>
          <div class="auth__card-social-icons">
            <font-awesome-icon :icon="['fab', 'google']" class="auth__social-icon" />
            <font-awesome-icon :icon="['fab', 'facebook']" class="auth__social-icon" />
            <font-awesome-icon :icon="['fab', 'twitter']" class="auth__social-icon" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped src="./Auth.scss"></style>
