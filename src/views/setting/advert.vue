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
            <el-input v-model="filter.name" placeholder="请输入名称orID" :clearable="true"></el-input>
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
            label="修改时间"
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
                <el-button v-if="scope.row.adStatus === 1" @click="handleOffline(scope.row)" type="text" size="small">下线</el-button>
              </div>
              <div>
                <el-button v-if="scope.row.adStatus !== 2" @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
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
        <el-form-item label="广告名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="广告头图：" prop="headUrl">
          <el-input v-model="form.headUrl" style="display: none;"></el-input>
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
            <el-button style="margin-left: 10px;" size="small" type="success" :disabled="uploadFiles.length < 1 || fileList.length > 0" @click="submitUpload">上传到服务器</el-button>
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
            :picker-options="pickerOptions"
            @change="onlineTimeChange" >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="link" label="链接：">
          <el-input v-model="form.destinationUrl" placeholder="URL" :clearable="true"></el-input>
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
import { parseTime, pickerOptions } from '@/utils'

export default {
  name: 'advertlist',
  data() {
    return {
      loading: false,
      showDialog: false,
      dialogType: '',
      filter: {
        name: '', // 广告名称
        beginDate: '', // 时间段查询-起（精确到分）
        endDate: '' // 时间段查询-止（精确到分）
      },
      releaseTime: [],
      page: {
        pageNo: 1,
        pageSize: 10
      },
      pickerOptions,
      uploadFiles: [], // 已选中的图片（不区分是否已上传）
      fileList: [], // 已上传的图片
      uploadSuccess: false,
      form: {
        id: '',
        name: '',
        headUrl: '',
        onlineTime: [],
        effectTime: '',
        expireTime: '',
        destinationUrl: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: ['change', 'blur'] }
        ],
        headUrl: [
          { required: true, message: '请上传广告头图', trigger: 'change' }
        ],
        onlineTime: [{
          validator: function(rule, value, callback) {
            if (!value || value.length === 0) {
              callback(new Error('请选择启用时间'))
            }
            callback()
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
    releaseTimeFilter(time) {
      return parseTime(Number(time))
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
        this.$store.dispatch('updateAdvertStatus', data).then(() => {
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
        name: '',
        headUrl: '',
        effectTime: '',
        expireTime: '',
        destinationUrl: ''
      }
      this.fileList = []
      this.uploadFiles = this.fileList
      this.dialogType = 'add'
      this.showDialog = true
    },
    // 编辑广告
    handleEdit(data) {
      this.$store.dispatch('getAdvertById', { id: data.id }).then((res) => {
        this.form = {
          id: data.id,
          name: res.data.name,
          headUrl: res.data.headUrl,
          onlineTime: [new Date(Number(res.data.effectTime)), new Date(Number(res.data.expireTime))],
          effectTime: this.releaseTimeFilter(res.data.effectTime),
          expireTime: this.releaseTimeFilter(res.data.expireTime),
          destinationUrl: res.data.destinationUrl
        }
        this.fileList = [{ name: data.name, url: res.data.headUrl }]
        this.uploadFiles = this.fileList
        this.dialogType = 'edit'
        this.showDialog = true
      }).catch(() => {
        this.$message({
          message: '获取广告信息失败！',
          type: 'error'
        })
      })
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    fileChange(file, fileList) {
      this.uploadFiles = fileList
    },
    // 删除文件之前的钩子
    beforeFileRemove(file, fileList) {
      this.fileList = []
      this.uploadFiles = []
      this.form.headUrl = ''
    },
    // 提交上传图片到服务器
    submitUpload() {
      if (this.uploadFiles.length < 1) return
      this.$refs.upload.submit()
    },
    // 上传图片到服务器真实行为
    handleUpload(node) {
      this.$store.dispatch('uploadAdertImage', { file: node.file }).then((res) => {
        this.form.headUrl = res.data.url
        this.fileList = [{ name: node.file.name, url: res.data.url }]
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
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
            const params = Object.assign({}, this.form)
            delete params.onlineTime
            this.$store.dispatch(this.dialogType === 'add' ? 'addAdvert' : 'editAdvert', params).then(() => {
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