<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>

      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
        :to="tag" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{generateTitle(tag.title)}}
        <span :class="[ visitedViews.length > 1 ? 'el-icon-close' : 'el-icon-none']" @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>

      <!-- <el-tabs v-model="visitedViews" type="card" closable>
        <el-tab-pane
          v-for="(item, index) in Array.from(visitedViews)"
          :key="item.name"
          :label="generateTitle(item.title)"
          :name="item.name"
        >
          {{item.content}}
        </el-tab-pane>
      </el-tabs> -->
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">{{$t('tagsView.close')}}</li>
      <li @click="closeOthersTags">{{$t('tagsView.closeOthers')}}</li>
      <li @click="closeAllTags">{{$t('tagsView.closeAll')}}</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'
import { generateTitle } from '@/utils/i18n'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    generateTitle, // generateTitle by vue-i18n
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedView', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      this.left = e.clientX - offsetLeft + 15 // 15: margin right
      this.top = e.clientY - 50
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  .tags-view-wrapper {
    height: 34px;
    .tags-view-item {
      display: flex;
      align-items: center;
      border: 1px solid #d8dce5;
      border-right: none;
      box-sizing: border-box;
      color: #495060;
      font-size: 14px;
      font-weight: 500;
      height: 34px;
      line-height: 34px;
      list-style: none;
      padding:  0 18px 0 20px;
      position: relative;
      transition: padding .3s cubic-bezier(.645,.045,.355,1);
      &:hover {
        padding-left: 10px;
        padding-right: 12px;
        &:first-child {
          padding-left: 10px;
          padding-right: 14px;
        }
        .el-icon-close {
          width: 16px;
        }
      }
      &.active {
        padding: 0 10px 0 20px;
        color: #409eff;
        background: #fff;
        border-bottom: none;
        &:first-child {
          padding: 0 20px;
        }
        .el-icon-close {
          width: 16px;
        }
      }
      &:first-child {
        border-top-left-radius: 5px;
        padding:  0  20px;
      }
      &:last-child {
        border-top-right-radius: 5px;
        border-right: 1px solid #d8dce5;
      }
      .el-icon-close {
        font-size: 12px;
        height: 16px;
        line-height: 16px;
        overflow: hidden;
        position: relative;
        right: 0;
        top: -1px;
        transform-origin: 100% 50%;
        vertical-align: middle;
        width: 0;
        border-radius: 50%;
        margin-left: 4px;
        text-align: center;
        transition: all .3s cubic-bezier(.645,.045,.355,1);
        &:before {
            display: inline-block;
            transform: scale(.9);
            // vertical-align: -1px;
          }
          &:hover {
            background-color: #b4bccc;
            color: #fff;
          }
        }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>