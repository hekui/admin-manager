<template>
  <el-dialog v-loading="loading" width="400px" title="切换城市" :visible="cityDialog" :close-on-click-modal="false" @close="close">
    <div class="citys">
      <el-button v-for="item in cityOptions" :key="item.code" :type="item.code === cityId ? 'primary' : ''" @click="cityId = item.code">{{item.name}}</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { setCity } from '@/utils/auth'

export default {
  name: 'CityDialog',
  data() {
    return {
      loading: false,
      cityId: this.$store.state.cityId
    }
  },
  computed: {
    ...mapState(['cityDialog', 'cityOptions'])
  },
  created() {
    this.getActivatedCitys()
  },
  methods: {
    ...mapMutations({ hideCityDialog: 'HIDE_CITY_DIALOG' }),
    // 获取激活城市
    getActivatedCitys() {
      this.loadin = true
      this.$store.dispatch('getActivatedCitys').then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 取消
    handleCancel() {
      this.hideCityDialog()
    },
    // 确认切换城市
    handleConfirm() {
      if (this.cityId === this.$store.state.cityId) {
        this.$message({
          type: 'info',
          message: '您已经选择了该城市！'
        })
      } else {
        setCity(this.$store, this.cityId)
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
        this.$message({
          type: 'success',
          message: '切换城市成功！'
        })
      }
      this.hideCityDialog()
    },
    // 关闭
    close() {
      this.hideCityDialog()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.citys {
  display: flex;
  flex-direction: column;
  .el-button {
    margin: 0 0 22px;
  }
}
</style>
