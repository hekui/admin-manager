<template>
  <div class="filechoose">
    <div class="filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="文章标题">
          <el-input v-model="filename" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="submitFilter">查询</el-button>
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
        fit="true"
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
          prop="id"
          label="序号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="公众号名称"
          width="140">
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市"
          width="120">
        </el-table-column>
        <el-table-column
          prop="articletitle"
          label="文章标题"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="publish-date"
          label="发布时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="count"
          label="阅读量"
          width="120">
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :current-page="page.pageNo"
        :page-size="listData.pageSize"
        :total="listData.totalRecords">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import api from '@/api'

  export default {
    name: 'topicList',
    data() {
      return {
        currentRow: '',
        filename: '',
        loading: false,
        page: {
          pageNo: 1,
          pageSize: 10
        },
        listData: {
          totalPage: 0,
          curPage: 1,
          pageSize: 10,
          totalRecords: 0,
          list: []
        }
      }
    },
    watch: {
      currentRow() {
        console.log(this.currentRow)
      }
    },
    created() {
      this.submitFilter()
    },
    methods: {
      tableCurrentChange(row) {
        this.currentRow = row.id
      },
      submitFilter() {
        api.post('/topic/articlesearch', { 'filter': this.filename }).then(res => {
          this.listData = res.data
        }, res => {
          console.log('error')
        })
      },
      fetchData() {
        this.loading = true
        api.post('/topic/articlesearch', Object.assign({}, this.filter, this.page)).then(res => {
          this.listData = res.data
          this.loading = false
        }, res => {
          console.log('error')
          this.loading = false
        })
      },
      changePage(curPage) {
        this.page.pageNo = curPage
        this.fetchData()
      }
    }
  }
</script>
<style lang="sass">
  .filechoose
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
      overflow: scroll
    .pages
      margin-top: 15px
</style>
