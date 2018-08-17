<template>
  <div class="screenfull" @click='click'>
    <el-tooltip effect="dark" :content="$t(isFullscreen ? 'navbar.exitScreenfull' : 'navbar.screenfull')" placement="bottom">
      <SvgIcon v-if="isFullscreen" :iconClass="'exitscreenfull'" :className="'icon-exitscreenfull'"></SvgIcon>
      <SvgIcon v-else :iconClass="'screenfull'" :className="'icon-screenfull'"></SvgIcon>
    </el-tooltip>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'screenfull',
  components: { SvgIcon },
  props: {
    width: {
      type: Number,
      default: 22
    },
    height: {
      type: Number,
      default: 22
    },
    fill: {
      type: String,
      default: '#48576a'
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
      this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.screenfull {
  display: flex;
  cursor: pointer;
  .icon-screenfull, .icon-exitscreenfull {
    width: 20px;
    height: 20px;
  }
}
</style>
