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
          <el-input v-model.trim="filter.title" placeholder="请输入文章标题" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="公众号名称：">
          <el-input v-model.trim="filter.wechatName" placeholder="请输入公众号名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input v-model.trim="filter.houseName" placeholder="请输入楼盘项目名称" :clearable="true"></el-input>
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
        <el-form-item label="是否推荐：">
          <el-select
            v-model="filter.recommendStatus"
            placeholder="不限"
            :clearable="true">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称：">
          <el-autocomplete
            class="inline-input"
            v-model.trim="filter.labelName"
            :fetch-suggestions="labelFilter"
            placeholder="请输入标签名称"
            @select="handleSelectTag"
            @blur="handleBlur"
            :clearable="true">
            <template slot-scope="{ item }">
              <div>{{ item.name }}</div>
            </template>
          </el-autocomplete>
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
          label="推荐"
          width="60">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.recommendStatus" :active-value="1" :inactive-value="0" @change="handleRecommend(scope)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="项目名称">
          <template slot-scope="scope">
            <span>{{ scope.row.houseNames || "-" }}</span>
          </template>
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
    <el-dialog title="请输入推荐理由" :visible.sync="showDialog" :close-on-click-modal="false" :show-close="false">
      <el-form ref="recommendationForm" :model="recommendationForm" :inline="true" :rules="rules">
        <el-form-item label="推荐理由:" prop="recommendation">
          <el-input v-model.trim="recommendationForm.recommendation" placeholder="例如：小编推荐" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
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
      showDialog: false,
      filter: {
        title: '', // 文章标题
        wechatName: '', // 公众号名称
        houseName: '', // 项目名称
        labelId: [''], // 标签Id
        labelName: '', // 标签名称（点击选中）
        contentTypeId: '', // 文章类型
        wechatTypeId: '', // 公众号类型
        beginDate: '', // 时间段查询-起（精确到分）
        endDate: '', // 时间段查询-止（精确到分）
        recommendStatus: null // 是否推荐（默认不限）
      },
      releaseTime: [],
      pickerOptions,
      recommendScope: null, // 推荐域
      recommendationForm: {
        recommendation: localStorage.getItem('RECOMMENDATION') || '', // 推荐理由
      },
      rules: {
        recommendation: [
          {
            required: true,
            validator: function(rule, value, callback) {
              if (!value || value.length === 0) {
                callback(new Error('推荐理由不能为空'))
              }
              if (value.length > 4) {
                callback(new Error('字数过长，请控制在4个字以内'))
              }
              callback()
            },
            trigger: ['change', 'blur']
          }
        ]
      },
      page: {
        curPage: 1
      }
    }
  },
  computed: {
    ...mapState({
      listData: state => state.content.listData,
      allTags: state => state.tag.allTags,
      refreshList: state => state.content.refreshList
    }),
    ...mapGetters(['paccountTypeDict', 'articleTypeDict'])
  },
  created() {
    this.$store.dispatch('getTypeDict', { code: 1 }) // 查询公众号类型
    this.$store.dispatch('getTypeDict', { code: 3 }) // 查询文章类型
    this.$store.dispatch('getAllTags') // 查询所有标签
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('getContentList', Object.assign({}, this.filter, this.page, { labelId: this.filter.labelId[0] })).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 过滤标签
    labelFilter(queryString, cb) {
      const labels = this.allTags.filter(tag => {
        if (tag.name.indexOf(queryString) > -1) {
          return true
        }
        return false
      })
      cb(labels)
    },
    // 标签输入框失去焦点
    handleBlur() {
      this.filter.labelId = []
      if (this.filter.labelName) {
        this.allTags.forEach(tag => {
          if (tag.name.trim() === this.filter.labelName.trim()) {
            this.filter.labelId.push(tag.id)
          }
        })
      } else {
        this.filter.labelId.push('')
      }
    },
    // 验证标签是否匹配
    validateLableId() {
      const labelId = this.filter.labelId
      if (labelId.length === 1) {
        return true
      } else {
        let message = ''
        if (labelId.length > 1) {
          message = '请选择一个标签' // 匹配多项
        }
        if (labelId.length < 1) {
          message = '标签名称不正确' // 无匹配项
        }
        this.$message({
          type: 'error',
          message
        })
        return false
      }
    },
    // 选中标签
    handleSelectTag(item) {
      this.filter.labelName = item.name
      this.filter.labelId = [item.id]
    },
    statusFilter(status) {
      return status === 0 ? '删除' : status === 1 ? '启用' : status === 2 ? '锁定' : ''
    },
    // 获取项目名称
    getHouseName(data) {
      if (Array.isArray(data.houseList)) {
        if (data.houseList[0] && data.houseList[0].houseName) {
          if (data.houseList.length > 1) {
            return data.houseList[0].houseName + ' 等'
          } else {
            return data.houseList[0].houseName
          }
        }
      }
      return '-'
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
      if (this.validateLableId()) {
        this.page.curPage = 1
        this.fetchData()
      }
    },
    // 切换推荐开关
    handleRecommend(scope) {
      this.recommendScope = scope
      const recommendStatus = scope.row.recommendStatus
      if (recommendStatus === 1) {
        // 开启推荐
        this.showDialog = true
      } else {
        // 关闭推荐
        this.$confirm('你确认取消推荐么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 关闭推荐
          this.$store.dispatch('updateRecommendStatus', { id: scope.row.id, recommendStatus: 0 }).then((res) => {
            this.fetchData()
            this.$store.commit('SET_REFRESH_RECOMMEND_LIST', true) // 更新推荐内容管理列表
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }).catch(() => {
          // 取消操作，回退数据
          this.$store.commit('SET_RECOMMEND_STATUS', { index: scope.$index, recommendStatus: 1 })
          this.$message({
            type: 'info',
            message: '操作已取消！'
          })
        })
      }
    },
    // 确认推荐
    handleConfirm() {
      this.$refs['recommendationForm'].validate((valid) => {
        if (valid) {
        // 更新文章推荐状态
          this.$store.dispatch('updateRecommendStatus', { id: this.recommendScope.row.id, recommendStatus: 1, recommendation: this.recommendationForm.recommendation }).then((res) => {
            this.fetchData()
            this.$store.commit('SET_REFRESH_RECOMMEND_LIST', true) // 更新推荐内容管理列表
            localStorage.setItem('RECOMMENDATION', this.recommendationForm.recommendation)
            this.showDialog = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }
      })
    },
    // 取消推荐
    handleCancel() {
      this.$store.commit('SET_RECOMMEND_STATUS', { index: this.recommendScope.$index, recommendStatus: 0 })
      this.showDialog = false
      this.$message({
        type: 'info',
        message: '操作已取消'
      })
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
  },
  watch: {
    // 监听是否要更新内容列表
    refreshList: function(newValue, oldValue) {
      if (newValue) {
        this.fetchData()
      }
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
</style>
<style rel="stylesheet/scss" lang="scss">
.content-container {
  .el-dialog {
    width: 400px;
    .el-dialog__body {
      padding: 0 20px 20px;
    }
    .el-form-item {
      position: relative;
      margin: 0;
      width: 100%;
      padding-left: 90px;
      .el-form-item__label {
        position: absolute;
        left: 0;
        top: 0;
        width: 90px
      }
      .el-form-item__content {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
    }
    
  }
}
</style>
