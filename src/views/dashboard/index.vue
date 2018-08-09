<template>
  <div class="app-container dashboard-container">
    <div class="content">
      <p>您好，{{account.name}}。</p>
      <p>当前管理城市是：{{cityName}} <el-button type="text" @click="changeCity">切换城市</el-button></p>
      <p>您的管理角色是：超级管理员</p>
      <p>您可管理的城市是：<span class="citys" v-for="item in cityOptions" :key="item.cityId">{{item.cityName}}</span></p>
    </div>
    <!-- <component :is="currentRole"></component> -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
// import { showLoading, hideLoading } from '@/utils'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapState(['cityName', 'cityOptions']),
    ...mapGetters([
      'roles',
      'account'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  methods: {
    ...mapMutations({ showCityDialog: 'SHOW_CITY_DIALOG' }),
    // 切换城市
    changeCity() {
      this.showCityDialog()
    },
  }
}
</script>
<style lang="scss">
.dashboard-container{
  .content{
    margin: 200px auto; text-align: center;
  }
  .citys {
    margin: 0 5px;
  }
}
</style>
