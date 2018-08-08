<template>
  <div class="app-container dashboard-container">
    <div class="content">
      <p>您好，{{account.name}}。</p>
      <p>当前管理城市是：成都 <el-button type="text">切换城市</el-button></p>
      <p>您的管理角色是：超级管理员</p>
      <p>您可管理的城市是：成都、西安、重庆</p>
    </div>
    <!-- <component :is="currentRole"></component> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters([
      'roles',
      'account'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style lang="scss">
.dashboard-container{
  .content{
    margin: 200px auto; text-align: center;
  }
}
</style>
