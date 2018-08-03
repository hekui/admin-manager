<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <template v-if="showScroll">
      <div class="arrow nav-prev" @click="navScroll('prev')">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="arrow nav-next" @click="navScroll('next')">
        <i class="el-icon-arrow-right"></i>
      </div>
    </template>

    <div :class="['scroll-wrapper', {showScroll: showScroll}]" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const padding = 15 // tag's padding

export default {
  name: 'scrollPane',
  data() {
    return {
      showScroll: false,
      left: 0
    }
  },
  computed: {
    ...mapState({
      visitedViews: state => state.tagsView.visitedViews
    })
  },
  watch: {
    // 监听导航栏数量变化，重置tab滚动
    visitedViews(newValue, oldValue) {
      this.resetScroll()
    }
  },
  mounted() {
    this.resetScroll()
    // 窗口变化重置tab滚动
    window.onresize = () => {
      this.resetScroll()
    }
  },
  methods: {
    // 重置tab滚动
    resetScroll() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      // 此处采用异步，避免tab内容uptate发生在此之后（测试过如果不用异步，tab变化时，内容更新确实在后面执行），造成scrollWrapperWidth没有发生变化的情况出现
      this.timer = setTimeout(() => {
        const scrollContainerRect = this.$refs.scrollContainer.getBoundingClientRect()
        const scrollWrapperRect = this.$refs.scrollWrapper.getBoundingClientRect()
        const scrollContainerWidth = scrollContainerRect.right - scrollContainerRect.left
        const scrollWrapperWidth = scrollWrapperRect.right - scrollWrapperRect.left
        // 内容宽度宽度大于容器宽度，显示tab滚动箭头按钮
        if (scrollContainerWidth <= scrollWrapperWidth) this.showScroll = true
        else this.showScroll = false

        if (scrollContainerWidth < scrollWrapperWidth) {
          this.left = scrollContainerWidth - scrollWrapperWidth
        } else {
          this.left = 0
          this.showScroll = false
        }
      }, 0)
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth

      if (eventDelta > 0) {
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding)
          }
        } else {
          this.left = 0
        }
      }
    },
    moveToTarget($target) {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $targetLeft = $target.offsetLeft
      const $targetWidth = $target.offsetWidth

      if ($targetLeft < -this.left) {
        // tag in the left
        this.left = -$targetLeft + padding
      } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        // tag in the current view
        // eslint-disable-line
      } else {
        // tag in the right
        this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
      }
    },
    // tab左右滚动
    navScroll(flag) {
      const scrollContainerRect = this.$refs.scrollContainer.getBoundingClientRect()
      const scrollWrapperRect = this.$refs.scrollWrapper.getBoundingClientRect()
      const scrollContainerWidth = scrollContainerRect.right - scrollContainerRect.left
      const scrollWrapperWidth = scrollWrapperRect.right - scrollWrapperRect.left
      if (flag === 'prev') {
        if (this.left < 0) {
          if (this.left < 40 - scrollContainerWidth) this.left += scrollContainerWidth - 40
          else this.left = 0
        }
      } else if (flag === 'next') {
        if (scrollContainerWidth - this.left < scrollWrapperWidth) {
          if (scrollWrapperWidth - scrollContainerWidth + this.left > scrollContainerWidth - 40) this.left -= scrollContainerWidth - 40
          else this.left = scrollContainerWidth - scrollWrapperWidth
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.arrow {
  cursor: pointer;
  position: absolute;
  top: 1px;
  height: 100%;
  line-height: 34px;
  width: 20px;
  color: #409eff;
  text-align: center;
  background: #fff;
  border: 1px solid #d8dce5;
  z-index: 2;
  &:hover {
    color: #fff;
    background: #409eff;
  }
}
.nav-prev {
  left: 0;
}
.nav-next {
  right: 0;
}
.scroll-container {
  white-space: nowrap;
  position: relative;
  width: 100%;
  .scroll-wrapper {
    position: absolute;
    left: 0;
    top: 1px;
    height: 100%;
    display: flex;
    align-items: center;
    z-index: 1;
  }
  .showScroll {
    padding: 0 20px;
    .tags-view-item:last-child {
      border-right: none;
    }
  }
}
</style>
