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
                <el-button v-if="scope.row.adStatus !== -1" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
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
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="广告名称：" prop="adName">
          <el-input v-model="form.adName" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="广告头图：" prop="adPicture">
          <el-input v-model="form.adPicture" style="display: none;"></el-input>
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :http-request="handleUpload"
            :file-list="fileList"
            :auto-upload="false"
            :on-change="fileChange"
            :before-remove="beforeFileRemove"
            :limit="1">
            <el-button slot="trigger" size="small" type="primary" :class="{disabled: uploadFiles.length > 0}">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" :disabled="uploadFiles.length < 1" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">必须为图片格式，且文件大小不能超过5Mb，建议不超过2Mb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="启用时间：" prop="onlineTime">
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
          <el-button type="primary" size="mini" @click="handleConfirm('form')">确 定</el-button>
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
      uploadFiles: [], // 已选中的图片（不区分是否已上传）
      fileList: [], // 已上传的图片
      form: {
        id: '',
        adName: '',
        adPicture: '',
        onlineTime: [],
        url: ''
      },
      rules: {
        adName: [
          { required: true, message: '请输入广告名称', trigger: ['change', 'blur'] }
        ],
        adPicture: [
          { required: true, message: '请上传广告头图', trigger: 'change' }
        ],
        onlineTime: [{
          validator: function(rule, value, callback) {
            if (!value || value.length === 0) {
              callback(new Error('请选择启用时间'))
            }
          },
          trigger: ['change', 'blur']
        }]
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
    // 获取序号
    getIndex(index) {
      return (this.page.pageNo - 1) * this.page.pageSize + index + 1
    },
    // 格式化时间
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
      this.$confirm('是否要下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('offlineAdvert', data).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.showDialog = false
          this.fetchData()
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
      this.fileList = []
      this.uploadFiles = this.fileList
      this.dialogType = 'add'
      this.showDialog = true
    },
    // 编辑广告
    handleEdit(data) {
      this.form = {
        id: data.id,
        adName: data.adName,
        adPicture: data.adPicture,
        onlineTime: [new Date(data.onlineTime[0]), new Date(data.onlineTime[1])],
        url: data.url
      }
      this.fileList = [{ name: data.adName, adPicture: data.adPicture }]
      this.uploadFiles = this.fileList
      this.dialogType = 'edit'
      this.showDialog = true
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    fileChange(file, fileList) {
      this.uploadFiles = fileList
    },
    // 删除文件之前的钩子
    beforeFileRemove(file, fileList) {
      this.uploadFiles = []
      this.form.adPicture = ''
    },
    // 提交上传图片到服务器
    submitUpload() {
      if (this.uploadFiles.length < 1) return
      this.$refs.upload.submit()
    },
    // 上传图片到服务器真实行为
    handleUpload(node) {
      console.log('adPicture', this.form.adPicture)
      this.$store.dispatch('uploadAdertImage', { file: node.file }).then((res) => {
        this.form.adPicture = res.data.url
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
        console.log('adPicture', this.form.adPicture)
      }).catch(() => {
        this.$message({
          message: '上传失败！',
          type: 'error'
        })
      })
    },
    // 取消
    handleCancel() {
      this.showDialog = false
    },
    // 提交新增/编辑
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否要提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.loading = true
            this.$store.dispatch('saveAdvert', this.form).then(() => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.showDialog = false
              this.fetchData()
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
      })
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
  .disabled {
    display: none;
  }
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
    .el-form-item__error, .el-upload__tip, .el-upload-list {
      margin-left: 90px;
    }
  }
}
</style>