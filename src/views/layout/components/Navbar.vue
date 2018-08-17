<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>
   
      <screenfull></screenfull>
      
      <div class="username">您好 {{account.name}}</div>

      <el-tooltip effect="dark" :content="$t('navbar.position')" placement="bottom">
        <div class="position" @click="changeCity">
          <SvgIcon :iconClass="'position'" :className="'icon-position'"></SvgIcon>
          <span>{{cityName}}</span>
        </div>
      </el-tooltip>

      <el-tooltip effect="dark" :content="$t('navbar.logOut')" placement="bottom">
        <div class="logout" @click="logout">{{$t('navbar.logOut')}}</div>
      </el-tooltip>

      <!-- <lang-select class="international right-menu-item"></lang-select> -->

      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->
      
      <!-- <el-dropdown class="avatar-container right-menu-item" trigger="click"> -->
        <!-- <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div> -->
        <!-- <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu> -->
      <!-- </el-dropdown> -->
    </div>
  </el-menu>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SvgIcon from '@/components/SvgIcon'
// import LangSelect from '@/components/LangSelect'
// import ThemePicker from '@/components/ThemePicker'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SvgIcon
    // LangSelect,
    // ThemePicker
  },
  computed: {
    ...mapState(['cityName']),
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'account'
    ])
  },
  methods: {
    ...mapMutations({ showCityDialog: 'SHOW_CITY_DIALOG' }),
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    // 切换城市
    changeCity() {
      this.showCityDialog()
    },
    // 退出登录
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: transparent;
  border-bottom: none;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    &:focus{
     outline: none;
    }
    .username, .position, .logout {
      padding: 0 10px;
      height: 20px;
      line-height: 20px;
      border-right: 1px solid #8a8a8a;
      .icon-position {
        width: 20px;
        height: 20px;
      }
    }
    .position {
      cursor: pointer;
      display: flex;
      span {
        margin-left: 5px;
        color: #409EFF;
      }
    }
    .logout {
      border: none;
      cursor: pointer;
      color: #36a3f7;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
