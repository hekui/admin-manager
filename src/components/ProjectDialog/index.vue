<template>
  <div class="project-choose">
    <div class="filter">
      <el-form :inline="true" :model="filter">
        <el-form-item label="楼盘名称">
          <el-input
            v-model="filter.name"
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
        :data="houseList.list"
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
            <span>{{scope.$index + (page.curPage - 1) * houseList.pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="楼盘名称"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="region"
          label="区域"
          width="120">
        </el-table-column>
        <el-table-column
          prop="saleStatus"
          label="销售状态"
          min-width="160">
        </el-table-column>
        <el-table-column
          label="楼盘状态"
          min-width="160">
          <template slot-scope="scope">
            <span>{{scope.row.houseStatus === 1 ? '上线中' : scope.row.houseStatus === 0 ? '已下架' : '-'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          @current-change="changePage"
          :current-page="page.pageNo"
          :page-size="houseList.pageSize"
          :total="houseList.totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'projectChooseList',
  data() {
    return {
      currentRow: '',
      currentProject: {},
      loading: false,
      filter: {
        name: ''
      },
      page: {
        curPage: 1
      }
    }
  },
  computed: {
    ...mapState({
      houseList: state => state.content.houseList
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('getHouseList', Object.assign({}, this.filter, this.page)).then(res => {
        this.currentRow = ''
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    tableCurrentChange(row) {
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
