<template>
  <div class="content">
    <div class="dialog-filter">
      <el-form :inline="true" :model="projectFilter">
        <el-form-item label="">
          <el-input
            v-model="projectFilter.title"
            placeholder="请输入项目名称搜索"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="projectFilterSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <!-- <el-table
        ref="sigletable"
        :data="data.list"
        highlight-current-row
        @current-change="tableCurrentChange"
        v-loading="loading"
        fit
        border
        style="width: 100%">
        <el-table-column
          label=""
          width="45">
          <template slot-scope="scope">
            <el-radio v-model="currentRow" :label="scope.row.id">{{''}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="序号"
          width="100">
          <template slot-scope="scope">
            <span>{{scope.$index + (page.curPage - 1) * page.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatName"
          label="楼盘名称"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="区域"
          width="120">
        </el-table-column>
        <el-table-column
          prop="title"
          label="销售状态"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="title"
          label="楼盘状态"
          min-width="160">
        </el-table-column>
      </el-table>
      <div class="pages">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          @current-change="changePage"
          :current-page="page.pageNo"
          :page-size="data.pageSize"
          :total="data.totalRecords">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: { // 预计后端返回数据格式 - 未定
        curPage: 1,
        hasNext: true,
        hasPrevious: false,
        nextPage: 2,
        pageSize: 20,
        qualification: '',
        sortType: '',
        totalPage: 0,
        totalRecords: 0,
        list: []
      },
      projectFilter: {
        title: ''
      },
      loading: false,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const param = {
        curPage: this.curPage += 1,
        keywords: this.projectFilter.title
      }
      this.loading = true
      this.$store.dispatch('getProjectDialogData', param).then(res => {
        this.data = res.data
        this.loading = false
      }, res => {
        this.$message({
          message: '数据查询失败，' + res.msg,
          type: 'error'
        })
        this.loading = false
      })
    },
    projectFilterSubmit() {
      this.data.curPage === 0
      this.fetchData()
    },
    changePage(value) {
      this.data.curPage = value - 1
      this.fetchData()
    }
  }
}
</script>
<style lang="scss">

</style>
