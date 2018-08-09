<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { initCity } from '@/utils/auth'

export default{
  name: 'App',
  created() {
    initCity(this.$store)
  }
}
</script>
