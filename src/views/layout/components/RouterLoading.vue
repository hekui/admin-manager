<template>
  <div class="loading">
    <div v-loading="true"></div>
  </div>
</template>

<script>

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, .5)
}
</style>
