<template>
  <div class="app-container">
    <label class="mini_des">显示 小程序首页“预售入口”模块</label>
    <el-tooltip content="打开后，小程序首页“预售入口”显示" >
      <i class="el-icon-question"></i>
    </el-tooltip>
    <el-switch class="mini_switch" v-model="value" @change="onChange" active-value="true" inactive-value="false"></el-switch>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: false
    }
  },
  methods: {
    onChange(value) {
      this.$confirm('你确定切换开关么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定
        this.value = value
      }).catch(() => {
        // 点击取消
        this.value = !value
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
