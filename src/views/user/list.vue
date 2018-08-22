<template>
    <div class="app-container user-list-page">
        <div class="form-filter">
          <el-form :model="form" :inline="true">
            <el-form-item label="昵称">
              <el-input
                placeholder="请输入昵称"
                v-model="form.nickname"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="form.dateTime"
                type="datetimerange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="left"
                :clearable="true"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="dateoptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-main">
          <el-table
            :data="listData.list"
            v-loading="loading"
            stripe
            border>
            <el-table-column
              label="序号"
              type="index"
              width="60"
              align="center"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              label="昵称"
              prop="nickname">
            </el-table-column>
            <el-table-column
              label="注册时间"
              prop="createTime"
              type="date">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDate('YYYY-MM-DD HH:mm')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="UserId"
              prop="id">
            </el-table-column>
            <el-table-column
              label="OpenId"
              prop="openid">
            </el-table-column>
            <el-table-column
              label="状态"
              prop="status">
              <template slot-scope="scope">
                <span>{{scope.row.status === 1 ? '激活' : scope.row.status === 2 ? '锁定':''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              prop="userType">
              <template slot-scope="scope">
                <span>{{scope.row.userType ===1 ? '暂无' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.opera || '-'}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="pages"
          background
          layout="total,prev, pager, next,jumper"
          :total="listData.totalRecords"
          :page-size="listData.pageSize"
          :current-page="listData.curPage"
          @current-change="pageChange">
        </el-pagination>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'userList',
  data() {
    return {
      dateoptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      loading: false,
      page: {
        curPage: 1,
        pageSize: 20,
      },
      form: {
        nickname: '',
        dateTime: '',
        // openid: '',
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      const tempForm = {
        nickname: this.form.nickname,
        beginTime: this.form.dateTime === null ? '' : this.form.dateTime[0],
        endTime: this.form.dateTime === null ? '' : this.form.dateTime[1]
      }
      this.$store.dispatch('getUserList', Object.assign({}, tempForm, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击搜索
    onSubmit() {
      this.page.curPage = 1
      this.loadData()
    },
    // 左边索引生成
    indexMethod(index) {
      return index + 1 + (this.page.curPage - 1) * this.page.pageSize
    },
    // 换页
    pageChange(curPage) {
      this.page.curPage = curPage
      this.loadData()
    },
  },
  computed: {
    ...mapState({
      listData: state => state.user.listData
    })
  }
}
</script>

<style lang="scss">
.user-list-page{
    .pages{
      float: right;
    }
}
</style>
