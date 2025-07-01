<template>
  <div>
    <h1>Protected Home</h1>
    <button @click="logout">Logout</button>
    <p>{{ user?.username }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import api from './../services/api'
import { useAuthStore } from './../stores/auth'

const auth = useAuthStore()
const user = ref<any>(null)

function logout() {
  auth.clearAuth()
}

onMounted(async () => {
  try {
    const r = await api.get('/me')
    user.value = r.data
  } catch {
    /* handled by interceptor */
  }
})
</script>
