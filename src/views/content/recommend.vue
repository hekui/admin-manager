/**
 * @description: 内容列表管理
 * @author: zhangchenle
 * @date: 2018-8-6
 */
<template>
  <div class="recommend-container">
    <section class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="文章标题：">
          <el-input v-model.trim="filter.title" placeholder="请输入文章标题" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="发布时间：">
          <el-date-picker
            v-model="releaseTime"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="true"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            @change="releaseTimeChange" >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="table">
      <el-table
        :data="listData.list"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50"
          :index="getIndex">
        </el-table-column>
        <el-table-column
          prop="wechatName"
          label="公众号名称"
          width="160">
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          min-width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="50">
          <template slot-scope="scope">
            <span>{{statusFilter(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          width="160">
          <template slot-scope="scope">
            <span>{{releaseTimeFilter(scope.row.releaseTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="阅读量"
          width="90">
          <template slot-scope="scope">
            <span>{{scope.row.readNum || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="点赞量"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.likeNum || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="字数"
          width="90">
          <template slot-scope="scope">
            <span>{{scope.row.wordsNum || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="展示顺序"
          width="80">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.sort"
              type="number"
              @blur="sortBlur($event, scope)"
              @keyup.enter.native="sortConfirm($event, scope)"
              @keyup.esc.native="sortCancel($event, scope)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="推荐理由"
          width="110">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.recommendation"
              @blur="recommendationBlur($event, scope)"
              @keyup.enter.native="recommendationConfirm($event, scope)"
              @keyup.esc.native="recommendationCancel($event, scope)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleCancelRecommend(scope.row)" type="text" size="small">取消推荐</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="page.curPage"
        :page-size="listData.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="listData.totalRecords">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { parseTime, pickerOptions } from '@/utils'

export default {
  name: 'contentrecommend',
  data() {
    return {
      loading: false,
      originalSort: [], // 展示数据数据源
      originalRecommendation: [], // 推荐理由数据源
      filter: {
        title: '', // 文章标题
        // wechatName: '', // 公众号名称
        // contentTypeId: '', // 文章类型
        // wechatTypeId: '', // 公众号类型
        beginDate: '', // 时间段查询-起（精确到分）
        endDate: '' // 时间段查询-止（精确到分）
        // recommendStatus: 1 // 推荐为是
      },
      releaseTime: [],
      pickerOptions,
      page: {
        curPage: 1
      }
    }
  },
  computed: {
    ...mapState({
      listData: state => state.content.recommendlistData,
      refreshRecommendList: state => state.content.refreshRecommendList
    }),
    ...mapGetters(['paccountTypeDict', 'articleTypeDict'])
  },
  created() {
    this.$store.dispatch('getTypeDict', { code: 1 }) // 查询公众号类型
    this.$store.dispatch('getTypeDict', { code: 3 }) // 查询文章类型
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('getContentRecommendlist', Object.assign({}, this.filter, this.page)).then((res) => {
        this.loading = false
        this.originalSort = res.data.list.map(item => item.sort)
        this.originalRecommendation = res.data.list.map(item => item.recommendation)
      }).catch(() => {
        this.loading = false
      })
    },
    statusFilter(status) {
      return status === 0 ? '删除' : status === 1 ? '启用' : status === 2 ? '锁定' : ''
    },
    // 文章类型改变触发
    contentTypeChange(value) {
      const types = [...value]
      this.filter.contentTypeId = types.pop()
    },
    // 公众号类型改变触发
    wechatTypeChange(value) {
      const types = [...value]
      this.filter.wechatTypeId = types.pop()
    },
    // 发布时间改变触发
    releaseTimeChange(value) {
      value = value || ['', '']
      this.filter.beginDate = value[0]
      this.filter.endDate = value[1]
    },
    releaseTimeFilter(time) {
      return parseTime(Number(time))
    },
    // 获取序号
    getIndex(index) {
      return (this.page.curPage - 1) * this.listData.pageSize + index + 1
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page.curPage = val
      this.fetchData()
    },
    // 条件查询
    submitFilter() {
      this.page.curPage = 1
      this.fetchData()
    },
    // 取消推荐
    handleCancelRecommend(data) {
      this.$confirm('你确认取消推荐么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 取消推荐
        this.$store.dispatch('updateRecommendStatus', { id: data.id, recommendStatus: 0 }).then((res) => {
          this.fetchData()
          this.$store.commit('SET_REFRESH_LIST', true)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消！'
        })
      })
    },
    // 二次编辑
    handleEdit(data) {
      this.$router.push({ path: '/content/edit', query: { id: data.id }})
    },
    // 展示顺序失去焦点
    sortBlur(event, scope) {
      this.$store.commit('SET_SORT', { index: scope.$index, sort: this.originalSort[scope.$index] })
      this.$message({
        type: 'info',
        message: '已取消修改!'
      })
    },
    // 回车确认修改展示顺序
    sortConfirm(event, scope) {
      const sort = scope.row.sort
      if (sort === '') {
        event.target.blur()
        this.$message({
          type: 'error',
          message: '展示顺序不能为空'
        })
        return
      }
      if (sort < 0) {
        this.$message({
          type: 'error',
          message: '序号不能为负数'
        })
        return
      }
      this.$store.dispatch('updateSort', { id: scope.row.id, sort: Number(sort) }).then((res) => {
        event.target.blur()
        this.fetchData()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      })
    },
    // ESC取消修改展示顺序
    sortCancel(event, scope) {
      event.target.blur()
    },
    // 推荐理由失去焦点
    recommendationBlur(event, scope) {
      this.$store.commit('SET_RECOMMENDATION', { index: scope.$index, recommendation: this.originalRecommendation[scope.$index] })
      this.$message({
        type: 'info',
        message: '已取消修改!'
      })
    },
    // 回车确认修改推荐理由
    recommendationConfirm(event, scope) {
      const recommendation = scope.row.recommendation
      if (recommendation === '') {
        event.target.blur()
        this.$message({
          type: 'error',
          message: '推荐理由不能为空'
        })
        return
      }
      if (recommendation.length > 4) {
        event.target.blur()
        this.$message({
          type: 'error',
          message: '字数过长，请控制在4个字以内'
        })
        return
      }
      this.$store.dispatch('updateRecommendation', { id: scope.row.id, recommendation: recommendation }).then((res) => {
        event.target.blur()
        this.fetchData()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      })
    },
    // ESC取消修改推荐理由
    recommendationCancel(event, scope) {
      event.target.blur()
    }
  },
  watch: {
    refreshRecommendList: function(newValue, oldValue) {
      if (newValue) {
        this.fetchData()
        this.$store.commit('SET_REFRESH_RECOMMEND_LIST', false)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.recommend-container {
  padding: 10px 20px;
  min-height: 100%;
  .pagination {
    margin-top: 12px;
    text-align: right;
  }
}
.el-form {
  padding-top: 20px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type='number']{
    -moz-appearance: textfield;
}
</style>
