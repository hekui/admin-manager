/**
import { mapMutations } from 'vuex';
 * @description:小程序配置
 * @date: 2018-9-11
 */
<template>
  <div class="app-container">
    <label class="mini_des">显示 小程序首页“预售入口”模块</label>
    <el-tooltip content="打开后，小程序首页“预售入口”显示" >
      <i class="el-icon-question"></i>
    </el-tooltip>
    <el-switch
      class="mini_switch"
      v-model="statusData.status"
      @change="onChange"
      active-value="1"
      inactive-value="0"
      v-show="cityName.search('成都')===-1"
      disabled>
    </el-switch>
    <el-switch
      class="mini_switch"
      v-model="statusData.status"
      @change="onChange"
      active-value="1"
      inactive-value="0"
      v-show="cityName.search('成都')!=-1">
    </el-switch>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
    }
  },
  created() {
    this.getStatus()
  },
  computed: {
    ...mapState({
      statusData: state => state.mini.statusData
    }),
    ...mapGetters([
      'cityName'
    ])
  },
  methods: {
    onChange(value) {
      this.$confirm('你确定切换开关么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定
        this.$store.dispatch('switchMini', Object.assign({}, { status: value })).then(() => {
          // 切换成功
        }).catch(() => {
          // 切换失败 调整回原来的状态
          this.changeLocalStatus(value === '1' ? '0' : '1')
        })
      }).catch(() => {
        // 点击取消
        this.changeLocalStatus(value === '1' ? '0' : '1')
      })
    },
    getStatus() {
      this.$store.dispatch('getMiniStatus', Object.assign({})).then(() => {
        // 切换成功
      }).catch(() => {
        // 切换失败 调整回原来的状态
      })
    },
    changeLocalStatus(value) {
      this.$store.commit('miniSet', {
        target: 'statusData',
        data: { status: value }
      })
    }
  }
}
</script>

<style>
.mini_des {
  margin-right: 15px;
}
.mini_switch {
  margin-left: 50px;
}
</style>
