<template>
    <div class="app-container user-list-page">
        <div class="form-filter">
          <el-form :model="form" :inline="true">
            <el-form-item label="反馈时间">
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
            <el-form-item>
              <el-button icon="el-icon-search" @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
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
              label="用户昵称"
              prop="name"
              width="150">
            </el-table-column>
            <el-table-column
              label="反馈时间"
              prop="createTime"
              type="date"
              width="150">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDate('YYYY-MM-DD')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="意见反馈"
              prop="content">
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
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
          layout="prev, pager, next"
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
  name: 'feedbackList',
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
        dateTime: '',
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
        beginTime: this.form.dateTime === null ? '' : this.form.dateTime[0],
        endTime: this.form.dateTime === null ? '' : this.form.dateTime[1]
      }
      this.$store.dispatch('getFeedbackList', Object.assign({}, tempForm, this.page)).then(() => {
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
    formatter(row, column) {
      return '-'
    }
  },
  computed: {
    ...mapState({
      listData: state => state.feedback.listData
    })
  }
}
</script>

<style lang="scss">
.user-list-page{
    .pages{
      margin-top: 10px;
      float: right;
    }
}
</style>
