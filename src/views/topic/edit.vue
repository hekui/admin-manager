<template>
  <div class="app-container topic-edit">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="专题名称">
        <el-input v-model="form.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="专题副标题">
        <el-input v-model="form.subname" clearable></el-input>
      </el-form-item>
      <el-form-item label="专题模板">
        <el-select v-model="form.type">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专题生效时间">
        <div class="enable-time-wrapper">
          <el-date-picker
            v-model="form.enabletimebegin"
            type="datetime"
            placeholder="开始时间"
            default-time="12:00:00">
          </el-date-picker>
          至
          <el-date-picker
            v-model="form.enabletimeend"
            type="datetime"
            placeholder="结束时间"
            default-time="12:00:00">
          </el-date-picker>
        </div>

      </el-form-item>
      <el-form-item label="首页推荐">
        <el-radio v-model="form.recommend" label="1">是</el-radio>
        <el-radio v-model="form.recommend" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="专题标签">
        <el-checkbox v-model="form.tag" label="1">标签1</el-checkbox>
        <el-checkbox v-model="form.tag" label="2">标签2</el-checkbox>
        <el-checkbox v-model="form.tag" label="3">标签3</el-checkbox>
      </el-form-item>
      <el-form-item label="专题头图">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="指向地址">
        <el-radio v-model="form.focusaddress" label="1">链接</el-radio>
      </el-form-item>
      <el-form-item label="链接">
        <div class="url-wrapper">
          <el-input v-model="form.articleurl" clearable></el-input>
          <el-button class="btn" @click="choosearticle">选择文件链接</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="savebtn">
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="选择文章"
      width="80%"
      :visible.sync="showselectarticle">
      <div class="dialog-content">
        <filechoose></filechoose>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showselectarticle = false">取 消</el-button>
        <el-button type="primary" @click="showselectarticle = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import filechoose from './filechoose'

  export default {
    name: 'topicEdit',
    data() {
      return {
        form: {
          name: '',
          subname: '',
          type: '选项1',
          enabletimebegin: '',
          enabletimeend: '',
          imageUrl: '',
          recommend: '0',
          tag: [],
          focusaddress: '1',
          articleurl: ''
        },
        options: [
          {
            value: '选项1',
            label: '指向类'
          }
        ],
        showselectarticle: false
      }
    },
    computed: {
      ...mapState({
        options: state => state.options,
        listData: state => state.topic.listData
      })
    },
    created() {
    },
    methods: {
      choosearticle() {
        this.showselectarticle = true
      },

      handleAvatarSuccess(res, file) {
        this.form.imageUrl = URL.createObjectURL(file.raw)
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
      }
    },
    components: {
      filechoose
    }
  }
</script>

<style lang="scss">
  .topic-edit {
    .el-form {
      .el-input {
        max-width: 500px;
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
          width: 178px;
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
