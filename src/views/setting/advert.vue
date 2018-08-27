/**
 * @description: 广告管理
 * @author: zhangchenle
 * @date: 2018-8-7
 */
<template>
  <div class="advert-container">
    <div class="content-container">
      <section class="form-filter">
        <el-form :inline="true" :model="filter">
          <el-form-item label="广告名称：">
            <el-input v-model.trim="filter.name" placeholder="请输入名称" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="最后修改时间：">
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
      
      <div class="table-top">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增广告</el-button>
      </div>
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
            prop="name"
            label="广告名称"
            width="250">
          </el-table-column>
          <el-table-column
            label="广告头图"
            width="180">
            <template slot-scope="scope">
              <img class="ad-pic" :src="scope.row.headUrl">
            </template>
          </el-table-column>
          <el-table-column
            label="广告状态"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.advertStatus === 0 ? '待上线' : scope.row.advertStatus === 1 ? '上线' : scope.row.advertStatus === 2 ? '下线': ''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="最后修改时间"
            width="180">
            <template slot-scope="scope">
              <span>{{releaseTimeFilter(scope.row.updateTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="启用时间">
            <template slot-scope="scope">
              <span>{{releaseTimeFilter(scope.row.effectTime) + '~' + releaseTimeFilter(scope.row.expireTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <div>
                <el-button v-if="scope.row.advertStatus === 1" @click="handleOffline(scope.row)" type="text" size="small">下线</el-button>
              </div>
              <div>
                <el-button v-if="scope.row.advertStatus !== 2" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
              </div>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { parseTime, pickerOptions } from '@/utils'

export default {
  name: 'advertlist',
  data() {
    return {
      loading: false,
      filter: {
        name: '', // 广告名称
        beginDate: '', // 时间段查询-起（精确到分）
        endDate: '' // 时间段查询-止（精确到分）
      },
      releaseTime: [],
      page: {
        curPage: 1
      },
      pickerOptions,
    }
  },
  computed: {
    ...mapState({
      listData: state => state.advert.listData
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 查询广告
    fetchData() {
      this.loading = true
      this.$store.dispatch('getAdvertList', Object.assign({}, this.filter, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取序号
    getIndex(index) {
      return (this.page.curPage - 1) * this.listData.pageSize + index + 1
    },
    // 格式化时间
    releaseTimeFilter(time) {
      return parseTime(Number(time))
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page.curPage = val
      this.fetchData()
    },
    // 发布时间改变触发
    releaseTimeChange(value) {
      value = value || ['', '']
      this.filter.beginDate = value[0]
      this.filter.endDate = value[1]
    },
    // 发布时间改变触发
    onlineTimeChange(value) {
      value = value || ['', '']
      this.form.effectTime = value[0]
      this.form.expireTime = value[1]
    },
    // 条件查询
    submitFilter() {
      this.page.curPage = 1
      this.fetchData()
    },
    // 下线
    handleOffline(data) {
      this.$confirm('是否要下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('updateAdvertStatus', {
          id: data.id,
          advertStatus: 2
        }).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作!'
        })
      })
    },
    // 新增广告
    handleAdd() {
      this.$router.push({ path: '/setting/addAdvert' })
    },
    // 编辑广告
    handleEdit(data) {
      this.$router.push({ path: '/setting/editAdvert', query: { id: data.id }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.advert-container {
  position: relative;
  height: 100%;
  color: #606266;
  .content-container {
    padding: 10px 20px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .form {
      position: relative;
      padding: 20px 0 30px;
    }
    .pagination {
      margin-top: 12px;
      text-align: right;
    }
    .ad-pic {
      width: 100%;
      height: 100%;
    }
  }
  .disabled {
    display: none;
  }
}
</style>