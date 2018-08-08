<template>
  <section class="app-main">
    <router-loading v-if="routerLoading"></router-loading>
    <city-dialog></city-dialog>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import RouterLoading from './RouterLoading'
import CityDialog from './CityDialog'

export default {
  name: 'AppMain',
  components: { RouterLoading, CityDialog },
  computed: {
    routerLoading() {
      return this.$store.state.routerLoading
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  position: absolute;
  top: 34px;
  right: 0;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #cfd7e5;
}
</style>

