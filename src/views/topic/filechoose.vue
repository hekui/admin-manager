<template>
  <div class="filechoose">
    <div class="filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="文章标题">
          <el-input
            v-model="filter.title"
            placeholder="请输入文章标题"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitFilter">查询</el-button>
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
          label="公众号名称"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市"
          width="120">
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="releaseTime"
          label="发布时间"
          width="120">
          <template slot-scope="scope">
            <span>{{scope.row.releaseTime | formatDate('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型"
          width="140">
        </el-table-column>
        <el-table-column
          prop="readNum"
          label="阅读量"
          width="140">
        </el-table-column>
      </el-table>
    </div>
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
</template>

<script>
  export default {
    name: 'fileChoose',
    data() {
      return {
        currentRow: '',
        currentArticle: {},
        loading: false,
        page: {
          curPage: 1,
          pageSize: 10
        },
        listData: [],
        filter: {
          title: '',
        }
      }
    },
    created() {
      this.submitFilter()
    },
    methods: {
      tableCurrentChange(row) {
        console.log(row)
        this.currentRow = row.id
        this.currentArticle = row
      },
      submitFilter() {
        this.page.curPage = 1
        this.fetchData()
      },
      fetchData() {
        this.loading = true
        this.$store.dispatch('getTopicContentList', Object.assign({}, this.filter, this.page)).then(res => {
          this.loading = false
          this.listData = res.data
        }).catch(() => {
          this.loading = false
        })
      },
      changePage(curPage) {
        this.page.curPage = curPage
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
      overflow-y: scroll
    .pages
      margin-top: 15px
</style>
