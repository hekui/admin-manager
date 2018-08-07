<template>
  <div class="app-container toppic-page">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="专题名称">
          <el-input v-model="filter.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-cascader
            v-model="filter.category"
            :options="options"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="filter.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="true"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="submitFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-wrapper">
      <div class="table-top">
        <el-button type="primary" icon="el-icon-plus" @click="addNewTopic">新增专题</el-button>
      </div>
      <div class="table-main">
        <el-table
          :data="listData.list"
          v-loading="loading"
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="序号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="专题名称"
            min-width="140">
          </el-table-column>
          <el-table-column
            prop="status"
            label="专题状态"
            width="120">
          </el-table-column>
          <el-table-column
            prop="bindingLabel"
            label="专题绑定标签"
            width="120">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            width="100">
          </el-table-column>
          <el-table-column
            prop="publish-date"
            label="发布时间"
            width="140">
          </el-table-column>
          <el-table-column
            prop="enable-date"
            label="启用时间"
            width="160">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row.id)">编辑</el-button>
            </template>
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
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'topicList',
    data() {
      return {
        loading: false,
        page: {
          pageNo: 1,
          pageSize: 10
        },
        filter: {
          name: '',
          category: [],
          date: ''
        },
        pickerOptions: { // 日期快捷选项
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
        }
      }
    },
    computed: {
      ...mapState({
        options: state => state.options,
        // pstatus: state => state.pstatus,
        listData: state => state.topic.listData
      })
    },
    created() {
      this.fetchData()
      console.log('this', this)
    },
    methods: {
      fetchData() {
        console.log('this.filter', this.filter)
        this.loading = true
        this.$store.dispatch('getTopicList', Object.assign({}, this.filter, this.page)).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      submitFilter() {
        this.page.pageNo = 1
        this.fetchData()
      },
      addNewTopic() {
        console.log('asdasdasdadas')
        this.$router.push({
          path: '/topic/add'
        })
      },
      changePage(curPage) {
        this.page.pageNo = curPage
        this.fetchData()
      },
      showDetail(id) {
        console.log('id', id)
        this.$router.push({
          path: '/topic/edit',
          query: {
            id
          }
        })
      }
    }
  }
</script>
<style lang="sass">
  .toppic-page

</style>
