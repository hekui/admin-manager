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
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="广告名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="广告头图：" prop="headUrl">
          <el-input v-model="form.headUrl" style="display: none;"></el-input>
          <el-upload
            class="avatar-uploader"
            ref="upload"
            action=""
            :http-request="handleUpload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.headUrl" :src="form.headUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">格式必须为png/jpg/jpeg，且文件大小不能超过2Mb</div>
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
          <el-input v-model="form.destinationUrl" placeholder="" :clearable="true"></el-input>
          <div class="el-upload__tip">链接示例：/pages/detail/detail?id=[文章id]</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('form')">确 定</el-button>
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
        curPage: 1
      },
      pickerOptions,
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
          { required: true, message: '请上传广告头图', trigger: ['change', 'blur'] }
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
          this.showDialog = false
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
      this.form = {
        id: '',
        name: '',
        headUrl: '',
        effectTime: '',
        expireTime: '',
        destinationUrl: ''
      }
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
        this.dialogType = 'edit'
        this.showDialog = true
      })
    },
    // 上传文件之前的钩子
    beforeAvatarUpload(file) {
      const isType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isType) {
        this.$message.error('上传头像图片只能是 PNG/JPG/JPEG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isType && isLt2M
    },
    // 提交上传图片到服务器
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 上传图片到服务器真实行为
    handleUpload(node) {
      const params = new FormData()
      params.append('file', node.file)
      this.$store.dispatch('uploadAdertImage', params).then((res) => {
        this.form.headUrl = res.data.url
        this.$message({
          type: 'success',
          message: '上传成功!'
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
  .el-upload-list {
    display: inline-block;
    .el-upload-list__item-name {
      display: none;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 400px;
    height: 117px;
    line-height: 117px;
    text-align: center;
  }
  .avatar {
    width: 400px;
    height: 117px;
    display: block;
  }
}
</style>