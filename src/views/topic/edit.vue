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
        <el-date-picker
          v-model="form.enabletime"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="专题标签">
        <el-radio v-model="form.tag" label="1">首页推荐</el-radio>
        <el-radio v-model="form.tag" label="2">标签1</el-radio>
        <el-radio v-model="form.tag" label="3">标签2</el-radio>
      </el-form-item>
      <el-form-item label="专题头图">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
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
    <transition name="el-fade-in-linear">
      <div class="choosefile-wrapper" v-show="showselectarticle">
        <filechoose @closearticle="showselectarticle = false"></filechoose>
      </div>
    </transition>
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
          enabletime: '',
          tag: '1',
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
      }
    },
    components: {
      filechoose
    }
  }
</script>
<style lang="sass">
  .topic-edit
    .el-input
      max-width: 500px
    .url-wrapper
      display: flex
      justify-content: flex-start
      .btn
        margin-left: 10px
        flex: 0 0
    .savebtn
      width: 200px
    .choosefile-wrapper
      position: fixed
      z-index: 1002
      top: 0
      left: 0
      width: 100%
      height: 100%
      padding: 5% 10%
      overflow: scroll
      background: rgba(0,0,0,0.5)
</style>
