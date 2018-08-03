<template>
  <div class="app-container">
    edit.vue action:{{id ? 'edit' : 'add'}}
  </div>
</template>

<script>
export default{
  name: 'paccountEdit',
  data() {
    return {
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id
  }
}
</script>
