/**
 * @description: 内容列表管理
 * @author: zhangchenle
 * @date: 2018-8-6
 */
<template>
  <div class="content-container">
    <section class="form">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="文章标题：">
          <el-input v-model="filter.articleTitle" placeholder="请输入名称orID" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="公众号名称：">
          <el-input v-model="filter.publicName" placeholder="请输入名称or微信号" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="文章类型：" class="article-type-label">
          <el-cascader
            expand-trigger="hover"
            :options="articleOptions"
            v-model="filter.articleType"
            :clearable="true">
          </el-cascader>
        </el-form-item>
        <el-form-item label="公众号类型：">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="filter.publicType"
            :clearable="true">
          </el-cascader>
        </el-form-item>
        <el-form-item label="发布时间：">
          <el-date-picker
            v-model="filter.deliveryTime"
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
          <el-button icon="el-icon-search" @click="submitFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="table">
      <el-table
        :data="listData.list"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="publicName"
          label="公众号名称">
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市"
          width="80">
        </el-table-column>
        <el-table-column
          prop="articleTitle"
          label="文章标题"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.articleStatus === 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="deliveryTime"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.articleType || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="readingQuantity"
          label="阅读量">
        </el-table-column>
        <el-table-column
          prop="praisingQuantity"
          label="点赞量">
        </el-table-column>
        <el-table-column
          prop="wordCount"
          label="字数">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <div>
              <el-button @click="handleDetail(scope.row)" type="text" size="small">详情</el-button>
            </div>
            <div>
              <el-button @click="handleEdit(scope.row)" type="text" size="small">二次编辑</el-button>
            </div>
            <div>
              <el-button style="color: red;" @click="handleEnable(scope.row)" type="text" size="small">{{scope.row.articleStatus === 1 ? '禁用' : '启用'}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listData.totalPage">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'contentlist',
  data() {
    return {
      loading: false,
      filter: {
        deliveryTime: '', // 发布时间
        publicType: [], // 公众号类型
        publicName: '', // 公众号名称
        articleTitle: '', // 文章标题
        articelType: [] // 文章类型
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
      },
      page: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapState({
      options: state => state.options,
      articleOptions: state => state.content.options,
      listData: state => state.content.listData
    })
  },
  created() {
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
    // 改变每页条数
    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.fetchData()
    },
    // 条件查询
    submitFilter() {
      this.page.pageNo = 1
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
    handleEnable(data) {
      let tips = '是否启用?'
      if (data.status === 1) tips = '是否禁用?'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('changeContentStatus', data).then(() => {
          this.loading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '操作失败！',
            type: 'error'
          })
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
  padding: 20px 0;
  border-bottom: 1px dashed #ccc;
}
.el-input {
  width: 220px;
}
</style>
