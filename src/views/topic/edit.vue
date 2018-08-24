<template>
  <div class="app-container topic-edit">
    <el-form ref="form" :rules="rules" :model="form" label-width="130px">
      <el-form-item label="专题名称" prop="name">
        <el-input v-model.trim="form.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="专题副标题" prop="subtitle">
        <el-input v-model.trim="form.subtitle" clearable></el-input>
      </el-form-item>
      <el-form-item label="专题模板" prop="template">
        <el-select v-model="form.template">
          <el-option
            v-for="item in topicTemplate"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专题生效时间" prop="effectTime">
        <el-date-picker
          v-model="date"
          type="datetimerange"
          :picker-options="datePickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="首页推荐" prop="recommend">
        <el-radio v-model="form.recommend" :label="1">是</el-radio>
        <el-radio v-model="form.recommend" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="专题标签">
        <el-checkbox-group
          class="topic-tags"
          v-model="form.labelIdList">
          <el-checkbox
            v-for="(item, index) in allTags"
            :key="index"
            :label="item.id">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="专题头图" prop="headUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          :http-request="handleUpload"
          :show-file-list="false"
          :on-success="uploadAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.headUrl" :src="form.headUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="指向地址">
        <el-radio v-model="isAddress" label="0">链接</el-radio>
      </el-form-item>
      <el-form-item label="链接" prop="destinationUrl">
        <div class="url-wrapper">
          <el-input v-model.trim="form.destinationUrl" clearable></el-input>
          <el-button class="btn" @click="choosearticle">选择文件链接</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="savebtn"
          @click="submit">
          保存
        </el-button>
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
  import { mapState } from 'vuex'
  import fileChoose from './filechoose'
  import api from '@/api'
  import { formatDate } from '@/filters'

  export default {
    name: 'topicEdit',
    data() {
      return {
        id: '',
        allTags: [],
        isAddress: '0',
        form: {
          id: '',
          name: '',
          subtitle: '',
          template: 1,
          effectTime: '',
          expireTime: '',
          recommend: 0,
          labelIdList: [],
          headUrl: '',
          destinationUrl: ''
        },
        topicTemplate: [{
          value: 1,
          label: '指向类'
        }],
        showselectarticle: false,
        datePickerOptions: {
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
        rules: {
          name: [
            { required: true, message: '请输入专题名称', trigger: 'change' }
          ],
          subtitle: [
            { required: true, message: '请输入专题副标题', trigger: 'change' }
          ],
          template: [
            { required: true, message: '请选择专题模板', trigger: 'blur' }
          ],
          effectTime: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          recommend: [
            { required: true, message: '请选择首页推荐', trigger: 'change' }
          ],
          headUrl: [
            { required: true, message: '请上传专题头图', trigger: 'change' }
          ],
          destinationUrl: [
            { required: true, message: '请输入链接', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        listData: state => state.topic.listData
      }),
      date: {
        set: function(newVal) {
          this.form.effectTime = newVal[0]
          this.form.expireTime = newVal[1]
        },
        get: function() {
          if (!this.form.effectTime.length) {
            return []
          }
          return [this.form.effectTime, this.form.expireTime]
        }
      }
    },
    created() {
      this.id = this.$route.params.topicId || ''

      api.post('/label/list', { cityID: this.$store.state.cityId }).then(res => {
        this.allTags = res.data.list
      }, res => {
        console.log('error')
      })

      if (this.id.length) {
        api.post('/topic/find', { id: this.id }).then(res => {
          this.form = res.data
          this.form.effectTime = formatDate(res.data.effectTime, 'YYYY-MM-DD HH:mm:ss')
          this.form.expireTime = formatDate(res.data.expireTime, 'YYYY-MM-DD HH:mm:ss')

          console.log(this.form.effectTime, this.form.expireTime)
        }, res => {
          console.log('error')
        })
      }
    },
    methods: {
      choosearticle() {
        this.showselectarticle = true
      },

      uploadAvatarSuccess(res, file) {
        this.form.headUrl = res.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
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
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.save()
          }
        })
      },
      save() {
        if (this.id.length) {
          this.form.id = this.id
        }

        api.post(this.id.length !== 0 ? '/topic/edit' : '/topic/add', Object.assign({}, this.form)).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.closeCurrentTab()
        }, res => {
          this.$message({
            type: 'error',
            message: res.data.msg || '保存失败，请稍后重试'
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
      selectCurrentArticle() {
        this.showselectarticle = false
        this.form.destinationUrl = `/pages/detail/detail?id=${this.$refs.fileChoose.currentArticle.id}`
      }
    },
    components: {
      fileChoose
    }
  }
</script>

<style lang="scss">
  .topic-edit {
    .el-form {
      .el-input {
        max-width: 500px;
      }
      .topic-tags {
        justify-content: start;
        .el-checkbox {
          margin-left: 0px;
          margin-right: 30px;
        }
      }
      .avatar-uploader  {
        .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          &:hover {
            border-color: #409EFF;
          }
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }
        .avatar {
          /*min-width: 178px;*/
          height: 178px;
          display: block;
        }
      }
      .enable-time-wrapper {
        color: #606266;
      }
      .url-wrapper {
        display: flex;
        justify-content: flex-start;
        .btn {
          margin-left: 10px;
          flex: 0 0;
        }
      }
      .savebtn {
        width: 200px;
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
