<template>
  <form @submit.prevent="login">
    <input v-model="username" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button>Login</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from './../services/api'
import { useAuthStore } from './../stores/auth'

const username = ref('emilys')
const password = ref('emilyspass')
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function login() {
  try {
    const r = await api.post('/login', {
      username: username.value,
      password: password.value,
      expiresInMins: 30
    })
    auth.setTokens(r.data)
    router.push({ name: 'home' })
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Login failed'
  }
}
</script>
