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
          prop="id"
          label="序号"
          width="100">
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
    <div class="pages" v-if="listData.pageSize < listData.totalRecords">
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
  import { mapState } from 'vuex'

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
        this.$store.dispatch('getContentList', Object.assign({}, this.filter, this.page)).then(() => {
          this.$refs.sigletable.scrollTop
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      changePage(curPage) {
        this.page.curPage = curPage
        this.fetchData()
      }
    },
    computed: {
      ...mapState({
        listData: state => state.content.listData
      })
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
