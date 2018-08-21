<template>
  <!-- <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div> -->
  <div class="app-wrapper" :class="classObj">
    <div class="app-header">
      <div class="app-logo">
        <img src="./../../assets/images/logo.png" width="120" alt="">
      </div>
      <navbar></navbar>
    </div>
    <div class="app-body">
      <sidebar class="sidebar-container"></sidebar>
      <div class="app-body-main">
        <tags-view></tags-view>
        <app-main></app-main>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex; 
    flex-direction: column;
    .app-header{
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
    }
    .app-logo{
      width: 180px;
      img{
        width: 120px; display: block; margin: 4px auto;
      }
    }
    .navbar{
      flex-grow: 1;
    }
    .app-body{
      display: flex;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
    }
    .sidebar-container{
      flex-grow: 0;
      flex-shrink: 0;
      overflow: hidden;
    }
    .app-body-main{
      flex-grow: 1;
      overflow: hidden;
      position: relative;
      border-radius: 5px;
    }
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
