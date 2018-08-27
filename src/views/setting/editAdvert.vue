/**
 * @description: 新增/编辑广告
 * @author: zhangchenle
 * @date: 2018-8-27
 */
<template>
  <div class="editAdvert-container">
    <el-form class="form" ref="form" :model="form" :rules="rules">
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
      <el-form-item label="链接类型：">
        <el-radio v-model="form.linkType" :label="1">小程序文章详情</el-radio>
        <el-radio v-model="form.linkType" :label="2">小程序Tab</el-radio>
        <el-radio v-model="form.linkType" :label="3">H5链接</el-radio>
        <div class="el-upload__tip" v-if="form.linkType === 1">
          小程序文章详情，点击下方的“选择文章”按钮选择文章后可自动生成地址。
        </div>
        <div class="el-upload__tip" v-if="form.linkType === 2">
          小程序Tab，仅支持首页(/pages/index/index)；榜单(/pages/rank/rank)；我的(/pages/user/user)。
        </div>
        <div class="el-upload__tip" v-if="form.linkType === 3">
          H5链接，http开头的网页地址，需要确保链接对应的域名已经加入小程序业务域名。
        </div>
      </el-form-item>
      <el-form-item class="link" label="链接：">
        <div class="url-wrapper">
          <el-input v-model.trim="form.destinationUrl" clearable></el-input>
          <el-button v-if="form.linkType === 1" class="btn" @click="choosearticle">选择文章</el-button>
        </div>
      </el-form-item>
      <el-form-item class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('form')">确 定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="选择文章"
      width="80%"
      :visible.sync="showselectarticle">
      <div class="dialog-content">
        <file-choose ref="fileChoose"></file-choose>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showselectarticle = false">取 消</el-button>
        <el-button type="primary" @click="selectCurrentArticle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime, pickerOptions } from '@/utils'
import fileChoose from '@/views/topic/filechoose'

export default {
  name: 'editAdvert',
  data() {
    return {
      loading: false,
      dialogType: '',
      pickerOptions,
      uploadSuccess: false,
      form: {
        id: '',
        name: '',
        headUrl: '',
        onlineTime: [],
        effectTime: '',
        expireTime: '',
        linkType: 1,
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
          required: true,
          validator: function(rule, value, callback) {
            if (!value || value.length === 0) {
              callback(new Error('请选择启用时间'))
            }
            callback()
          },
          trigger: ['change', 'blur']
        }]
      },
      showselectarticle: false,
    }
  },
  components: {
    fileChoose
  },
  created() {
    const path = this.$route.path
    if (path === '/setting/editAdvert') {
      this.dialogType = 'edit'
      this.handleEdit()
    } else {
      this.dialogType = 'add'
      this.handleAdd()
    }
  },
  methods: {
    choosearticle() {
      this.showselectarticle = true
    },
    // 格式化时间
    releaseTimeFilter(time) {
      return parseTime(Number(time))
    },
    // 发布时间改变触发
    onlineTimeChange(value) {
      value = value || ['', '']
      this.form.effectTime = value[0]
      this.form.expireTime = value[1]
    },
    // 新增广告
    handleAdd() {
      this.form = {
        id: '',
        name: '',
        headUrl: '',
        effectTime: '',
        expireTime: '',
        linkType: 1,
        destinationUrl: ''
      }
    },
    // 编辑广告
    handleEdit() {
      const id = this.$route.query.id || ''
      if (!id) return
      this.loading = true
      this.$store.dispatch('getAdvertById', { id }).then((res) => {
        this.loading = false
        this.form = {
          id,
          name: res.data.name,
          headUrl: res.data.headUrl,
          onlineTime: [new Date(Number(res.data.effectTime)), new Date(Number(res.data.expireTime))],
          effectTime: this.releaseTimeFilter(res.data.effectTime),
          expireTime: this.releaseTimeFilter(res.data.expireTime),
          linkType: res.data.linkType || 1,
          destinationUrl: res.data.destinationUrl
        }
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
    closeCurrentTab() {
      this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
        const latestView = views.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView)
        } else {
          this.$router.push('/')
        }
      })
    },
    // 取消
    handleCancel() {
      this.closeCurrentTab()
    },
    // 提交新增/编辑
    handleConfirm(formName) {
      if (this.dialogType === 'edit' && !this.form.id) {
        this.$message({
          type: 'error',
          message: '广告不存在，无法编辑!'
        })
        return
      }
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
              this.closeCurrentTab()
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
    selectCurrentArticle() {
      this.showselectarticle = false
      this.form.destinationUrl = `/pages/detail/detail?id=${this.$refs.fileChoose.currentArticle.id}`
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.editAdvert-container {
  position: relative;
  height: 100%;
  color: #606266;
  .form {
    width: 680px;
    padding: 20px;
    .el-form-item {
      position: relative;
      .el-form-item__label {
        position: absolute;
        width: 90px;
        font-size: 12px;
      }
      .url-wrapper {
        display: flex;
        justify-content: flex-start;
        .btn {
          margin-left: 10px;
          flex: 0 0;
        }
      }
      .el-form-item__content {
        padding-left: 90px;
        .el-input, .el-date-editor {
          width: 100%;
          font-size: 12px;
        }
        .avatar-uploader {
          line-height: normal;
        }
        .avatar-uploader .el-upload {
          width: 410px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          &:hover {
            border-color: #409EFF;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100%;
            height: 120px;
            line-height: 120px;
            text-align: center;
          }
          .avatar {
            width: 100%;
            height: 120px;
            display: block;
          }
        }
      }
    }
    .el-form-item__error {
      margin-left: 90px;
    }
  }
  .el-dialog {
    .dialog-content {
      height: 500px;
    }
    .dialog-footer {}
  }
}
</style>