<template>
  <div class="filechoose">
    <div class="filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="文章标题">
          <el-input v-model="filename" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="submitFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="data"
        v-loading="loading"
        fit="true"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="公众号名称"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市"
          width="120">
        </el-table-column>
        <el-table-column
          prop="articletitle"
          label="文章标题"
          width="120">
        </el-table-column>
        <el-table-column
          prop="publish-date"
          label="发布时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="count"
          label="阅读量"
          width="120">
        </el-table-column>
      </el-table>
    </div>
    <div class="result">
      <el-button @click="$emit('closearticle')">取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>
  import api from '@/api'

  export default {
    name: 'topicList',
    data() {
      return {
        filename: '',
        loading: false,
        data: []
      }
    },
    created() {
      this.submitFilter()
    },
    methods: {
      submitFilter() {
        api.post('/topic/articlesearch', { 'filter': this.filename }).then(res => {
          this.data = res.data
        }, res => {
          console.log('error')
        })
      },
      close() {
        console.log('asdasdadasdas')
        this.$emit('closearticle')
      }
    }
  }
</script>
<style lang="sass">
  .filechoose
    display: flex
    flex-direction: column
    height: 100%
    width: 100%
    background: white
    padding: 20px
    .filter
      flex: 0 0
    .table
      flex: 1 1
      border: solid #46a0fc
      overflow: scroll
      margin-bottom: 10px
    .result
      flex: 0 0
</style>
