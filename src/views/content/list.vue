/**
 * @description: 内容列表管理
 * @author: zhangchenle
 * @date: 2018-8-6
 */
<template>
  <div class="content-container">
    <section class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="文章标题：">
          <el-input v-model="filter.title" placeholder="请输入文章标题" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="公众号名称：">
          <el-input v-model="filter.wechatName" placeholder="请输入公众号名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="文章类型：" class="article-type-label">
          <el-cascader
            :options="articleTypeDict"
            :change-on-select="true"
            @change="contentTypeChange"
            :clearable="true">
          </el-cascader>
        </el-form-item>
        <el-form-item label="公众号类型：">
          <el-cascader
            :options="paccountTypeDict"
            :change-on-select="true"
            @change="wechatTypeChange"
            :clearable="true">
          </el-cascader>
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
          prop="city"
          label="城市"
          width="80">
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
          label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.typeName || "-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="readNum"
          label="阅读量"
          width="90">
        </el-table-column>
        <el-table-column
          prop="likeNum"
          label="点赞量"
          width="80">
        </el-table-column>
        <el-table-column
          prop="wordsNum"
          label="字数"
          width="90">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
              <el-button @click="handleDetail(scope.row)" type="text" size="small">详情</el-button>
              <el-button v-if="scope.row.status === 1 || scope.row.status === 2" style="color: red;" @click="handleStatus(scope.row)" type="text" size="small">{{scope.row.status === 1 ? '锁定' : scope.row.status === 2 ? '启用' : '' }}</el-button>
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
  name: 'contentlist',
  data() {
    return {
      loading: false,
      filter: {
        title: '', // 文章标题
        wechatName: '', // 公众号名称
        contentTypeId: '', // 文章类型
        wechatTypeId: '', // 公众号类型
        beginDate: '', // 时间段查询-起（精确到分）
        endDate: '' // 时间段查询-止（精确到分）
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
      listData: state => state.content.listData
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
      this.$store.dispatch('getContentList', Object.assign({}, this.filter, this.page)).then(() => {
        this.loading = false
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
    // 查看详情
    handleDetail(data) {
      this.$router.push({ path: '/content/detail', query: { id: data.id }})
    },
    // 二次编辑
    handleEdit(data) {
      this.$router.push({ path: '/content/edit', query: { id: data.id }})
    },
    // 禁用/启用
    handleStatus(data) {
      let tips = '是否启用?'
      if (data.status === 1) tips = '是否禁用?'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('changeContentStatus', { id: data.id, status: data.status === 1 ? 2 : 1 }).then(() => {
          this.loading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作!'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content-container {
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
.el-input {
  width: 220px;
}
</style>
