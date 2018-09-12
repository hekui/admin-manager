<template>
  <div class="project-choose">
    <div class="filter">
      <el-form :inline="true" :model="filter">
        <el-form-item label="楼盘名称">
          <el-input
            v-model="projectFilter.title"
            placeholder="请输入楼盘名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="projectFilterSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        ref="sigletable"
        :data="listData.list"
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
          :page-size="listData.pageSize"
          :total="listData.totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'projectChooseList',
  data() {
    return {
      currentRow: '',
      currentProject: {},
      loading: false,
      filter: {
        title: ''
      },
      listData: [],
      page: {
        curPage: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('getProjectDialogData', Object.assign({}, this.filter, this.page)).then(res => {
        this.loading = false
        this.listData = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    tableCurrentChange(row) {
      console.log(row)
      this.currentRow = row.id
      this.currentProject = row
    },
    projectFilterSubmit() {
      this.page.curPage = 1
      this.fetchData()
    },
    changePage(value) {
      this.page.curPage = value
      this.fetchData()
    }
  }
}
</script>
<style lang="sass">
  .project-choose
    display: flex
    flex-direction: column
    height: 100%
    width: 100%
    background: white
    .filter
      flex: 0 0
    .table
      flex: 1 1
      border: solid #ebeef5
      overflow-y: scroll
    .pages
      margin-top: 15px
</style>
