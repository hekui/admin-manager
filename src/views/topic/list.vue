<template>
  <div class="app-container topic-page" ref="topic">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="专题名称">
          <el-input v-model="filter.name" placeholder="请输入名称orID" clearable></el-input>
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
            value-format="yyyy-MM-dd HH:mm:ss"
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
            label="专题状态"
            width="80">
            <template slot-scope="scope">
              <span>{{mapStatus[scope.row.topicStatus]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="labels"
            label="专题绑定标签"
            min-width="140">
            <template slot-scope="scope">
              <span>{{scope.row.labels.map(obj => obj.name).join(',  ')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.sort"
                :id="'input_sort_'+scope.row.id"
                @blur="recoverSort(scope)"
                @keyup.enter.native="submitSort(scope)">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="发布时间"
            width="140">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatDate('YYYY-MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="启用时间"
            min-width="120">
            <template slot-scope="scope">
              <span>{{scope.row.effectTime | formatDate('YYYY-MM-DD HH:mm')}} ~ {{scope.row.expireTime | formatDate('YYYY-MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row.id)">编辑</el-button>
              <el-button
                v-show="scope.row.topicStatus == 1"
                type="text"
                @click="changeStatus(scope.row)">
                {{mapStatus[reverseTopicStatus(scope.row.topicStatus)]}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages" v-if="listData.pageSize < listData.totalRecords">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :current-page="page.curPage"
          :page-size="listData.pageSize"
          :total="listData.totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import api from '@/api'
  import { validateNumber } from '@/utils/validate'

  export default {
    name: 'topicList',
    data() {
      return {
        loading: false,
        originalsort: [],
        page: {
          curPage: 1,
          pageSize: 10
        },
        filter: {
          name: '',
          date: []
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
        listData: state => state.topic.listData
      }),

      serverFilter: function() {
        return {
          name: this.filter.name,
          beginDate: this.filter.data ? this.filter.date[0] : '',
          endDate: this.filter.date ? this.filter.date[1] : ''
        }
      }
    },
    created() {
      this.mapStatus = { 0: '待上线', 1: '上线', 2: '下线' }

      this.fetchData()
    },

    methods: {
      reverseTopicStatus(status) {
        switch (status) {
          case 0: return 0
          case 1: return 2
          case 2: return 0
        }
      },
      recoverSort(scope) {
        if (scope.row.modified !== true) {
          scope.row.sort = this.originalsort[scope.$index]
        }
      },
      submitSort(scope) {
        scope.row.modified = true

        const element = document.getElementById('input_sort_' + scope.row.id)
        element.blur()

        const originalValue = this.originalsort[scope.$index]
        const currentValue = scope.row.sort

        if (!this.checkSort(currentValue)) {
          scope.row.sort = originalValue
          scope.row.modified = false
          return
        }

        this.loading = true
        api.post('/topic/updatesort', { 'id': scope.row.id, 'sort': currentValue }).then(res => {
          this.loading = false
          this.originalsort[scope.$index] = currentValue
          this.$message({
            type: 'success',
            message: '更改成功!'
          })
          scope.row.modified = false
        }, res => {
          scope.row.sort = originalValue
          this.loading = false
          this.$message({
            type: 'error',
            message: '更改失败，请稍后重试'
          })
          scope.row.modified = false
        })
      },
      fetchData() {
        this.loading = true
        this.$store.dispatch('getTopicList', Object.assign({}, this.serverFilter, this.page)).then(() => {
          this.originalsort = this.listData.list.map(item => item.sort)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      submitFilter() {
        this.page.curPage = 1
        this.fetchData()
      },
      addNewTopic() {
        this.$router.push({
          path: '/topic/add'
        })
      },
      changePage(curPage) {
        this.page.curPage = curPage
        this.fetchData()
      },
      showDetail(id) {
        this.$router.push({
          path: '/topic/edit/' + id,
          params: {
            topicId: id
          }
        })
      },
      changeStatus(row) {
        const before = row.topicStatus
        const topicStatus = this.reverseTopicStatus(row.topicStatus)
        row.topicStatus = topicStatus

        this.loading = true
        api.post('/topic/updatestatus', { 'id': row.id, 'topicStatus': topicStatus }).then(res => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '更改成功!'
          })
        }, res => {
          row.topicStatus = before
          this.loading = false
          this.$message({
            type: 'error',
            message: '更改失败，请稍后重试'
          })
        })
      },
      checkSort(str) {
        if (str.length === 0) {
          this.$message({
            type: 'error',
            message: '排序不可为空'
          })
          return false
        }

        if (!validateNumber(str)) {
          this.$message({
            type: 'error',
            message: '排序只能为数字'
          })
          return false
        }

        return true
      }
    }
  }
</script>
<style lang="sass" scoped>
  .sort-change
    display: flex
    .el-button
      flex: 0 0
      margin-left: 10px
</style>
