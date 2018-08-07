/**
 * @description: 广告管理
 * @author: zhangchenle
 * @date: 2018-8-7
 */
<template>
  <div class="advert-container">
    <div class="content-container">
      <section class="form">
        <el-form :inline="true" :model="filter">
          <el-form-item label="广告名称：">
            <el-input v-model="filter.adName" placeholder="请输入名称orID" :clearable="true"></el-input>
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
          <div class="add">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增广告</el-button>
          </div>
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
            prop="adName"
            label="广告名称"
            width="250">
          </el-table-column>
          <el-table-column
            label="广告头图"
            width="180">
            <template slot-scope="scope">
              <img class="ad-pic" :src="scope.row.adPicture">
            </template>
          </el-table-column>
          <el-table-column
            label="广告状态"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.adStatus === -1 ? '下线' : scope.row.adStatus === 0 ? '待上线' : '上线'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deliveryTime"
            label="修改时间"
            width="180">
          </el-table-column>
          <el-table-column
            label="启用时间">
            <template slot-scope="scope">
              <span>{{onlineTimeFilter(scope.row.onlineTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <div>
                <el-button v-if="scope.row.adStatus === 1" @click="handleOffline(scope.row)" type="text" size="small">下线</el-button>
              </div>
              <div>
                <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="广告名称*：">
          <el-input v-model="form.adName" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="广告头图*：">
          <el-input v-model="form.adPicture" placeholder="选择图片" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="启用时间*：">
          <el-date-picker
            v-model="form.onlineTime"
            type="datetimerange"
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
        <el-form-item class="link" label="链接：">
          <el-input v-model="form.url" placeholder="URL" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'contentlist',
  data() {
    return {
      loading: false,
      showDialog: false,
      dialogType: '',
      filter: {
        deliveryTime: '', // 发布时间
        adName: '' // 广告名称
      },
      page: {
        pageNo: 1,
        pageSize: 10
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
      form: {
        id: '',
        adName: '',
        adPicture: '',
        onlineTime: [],
        url: ''
      }
    }
  },
  computed: {
    ...mapState({
      listData: state => state.advert.listData
    }),
    dialogTitle() {
      return this.dialogType === 'add' ? '新增广告' : '编辑广告'
    }
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
    // 格式化shi
    onlineTimeFilter(onlineTime) {
      function format(str) {
        const date = new Date(str)
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        if (month < 10) month = '0' + month
        if (day < 10) day = '0' + day
        if (hours < 10) hours = '0' + hours
        if (minutes < 10) minutes = '0' + minutes
        if (seconds < 10) seconds = '0' + seconds
        return date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
      return format(onlineTime[0]) + ' ~ ' + format(onlineTime[1])
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
    // 下线
    handleOffline(data) {

    },
    // 新增广告
    handleAdd() {
      this.form = {
        id: '',
        adName: '',
        adPicture: '',
        onlineTime: [],
        url: ''
      }
      this.showDialog = true
    },
    // 编辑广告
    handleEdit(data) {
      data.onlineTime = [new Date(data.onlineTime[0]), new Date(data.onlineTime[1])]
      this.form = Object.assign({}, data)
      this.showDialog = true
    },
    // 取消
    handleCancel() {
      this.showDialog = false
    },
    // 提交新增/编辑
    handleConfirm() {
      this.showDialog = false
    },
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
      border-bottom: 1px dashed #ccc;
      .add {
        position: absolute;
        left: 0;
        bottom: 5px;
      }
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
}
.el-input {
  width: 220px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.advert-container {
  .el-dialog {
    width: 540px;
    border-radius: 5px;
    .el-dialog__title {
      font-size: 14px;
    }
    .el-dialog__body {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
    .el-input {
      width: 400px;
      font-size: 12px;
    }
    .el-form-item__label {
      width: 90px;
      font-size: 12px;
    }
  }
}
</style>