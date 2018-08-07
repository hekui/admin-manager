<template>
    <div class="app-container user-list-page">
        <div class="formTop">
          <el-form :model="form" :inline="true">
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="form.dateTime"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="left"
                :clearable="true"
                value-format="yyyy-MM-dd"
                :picker-options="dateoptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input
                placeholder="请输入名称"
                v-model="form.nickName"
                clearable>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="OpenId">
              <el-input v-model="form.openId" clearable></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button icon="el-icon-search" @click="onSubmit">搜索</el-button>
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
              prop="nickName">
            </el-table-column>
            <el-table-column
              label="注册时间"
              prop="registerTime"
              type="date">
            </el-table-column>
            <el-table-column
              label="UserId"
              prop="userId">
            </el-table-column>
            <el-table-column
              label="OpenId"
              prop="openId">
            </el-table-column>
            <el-table-column
              label="状态"
              prop="status">
            </el-table-column>
            <el-table-column
              label="类型"
              prop="type">
            </el-table-column>
            <el-table-column
              label="操作"
              prop="opera"
              width="120"
              align="center">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="pages"
          background
          layout="prev, pager, next"
          style="right"
          :total="listData.totalRecords"
          :page-size="listData.pageSize"
          :current-page="listData.pageNo"
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
        pageNo: 1,
        pageSize: 20,
      },
      form: {
        dateTime: '',
        nickName: '',
        // openId: '',
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      this.$store.dispatch('getUserList', Object.assign([], this.form, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击搜索
    onSubmit() {
      this.page.pageNo = 1
      this.loadData()
    },
    // 左边索引生成
    indexMethod(index) {
      return index + 1 + (this.page.pageNo - 1) * this.page.pageSize
    },
    edtClick() {
      this.$message('Click edit')
    },
    // 换页
    pageChange(curPage) {
      this.page.pageNo = curPage
      this.loadData()
    }
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
      margin-top: 10px;
    }
}
</style>
