<template>
  <el-dialog title="切换城市" :visible="cityDialog" :close-on-click-modal="false" @close="close">
    <div class="citys">
      <el-button v-for="item in cityOptions" :key="item.cityId" :type="item.cityId === cityId ? 'primary' : ''" @click="cityId = item.cityId">{{item.cityName}}</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleConfirm('form')">确 定</el-button>
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
      cityId: this.$store.state.cityId
    }
  },
  computed: {
    ...mapState(['cityDialog', 'cityOptions'])
  },
  methods: {
    ...mapMutations({ showCityDialog: 'SHOW_CITY_DIALOG', hideCityDialog: 'HIDE_CITY_DIALOG' }),
    // 取消
    handleCancel() {
      this.hideCityDialog()
    },
    // 确认切换城市
    handleConfirm() {
      setCity(this.$store, this.cityId)
      document.location.href = '/'
    },
    // 关闭
    close() {
      this.hideCityDialog()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
