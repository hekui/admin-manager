<template>
  <div class="app-container property-detail">
    <div class="info">
      <h1 class="title">{{info.title}}</h1>
      <span class="address">{{info.address}}</span>
    </div>
    <div class="match-words">
      <h2>匹配词</h2>
      <div></div>
      <el-tag
        :key="word"
        v-for="(word, index) in words"
        closable
        :disable-transitions="false"
        @close="tagClose(index)">
        {{word}}
      </el-tag>
      <div class="add-new">
        <el-input
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm">
        </el-input>
        <el-button v-else size="small" @click="showInput"> + 添加 </el-button>
      </div>
      <el-button class="save" type="primary">保存</el-button>
    </div>
    <div class="table">
      <h2>关联文章列表</h2>
      <div class="main">
        <el-table :data="articleData.list"
                  v-loading="loading"
                  border
                  style="width: 100%">
          <el-table-column
            label="序号"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.$index + (page.curPage - 1) * page.pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="文章标题"
            prop="title"
            min-width="140">
          </el-table-column>
          <el-table-column
            label="公众号"
            prop="paccount"
            min-width="80">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="cancelBind(scope)">解除绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages clearfix">
        <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            @current-change="changePage"
            :current-page="page.curPage"
            :page-size="articleData.pageSize"
            :total="articleData.totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'propertyDetail',
  data() {
    return {
      loading: false,
      page: {
        curPage: 1,
        pageSize: 10
      },
      articleData: [],
      info: {
        title: '新希望大宝天天见',
        address: '锦江地铁2号线牛王庙站B出口',
      },
      words: ['标签一', '标签二', '标签三'],

      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('getTopicContentList', Object.assign({}, this.filter, this.page)).then(res => {
        this.loading = false
        this.articleData = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    changePage(curPage) {
      this.page.curPage = curPage
      this.fetchData()
    },

    tagClose(index) {
      this.$nextTick(_ => {
        this.words.splice(index, 1)
      })
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        const index = this.words.findIndex(value => value === inputValue)
        if (index !== -1) {
          this.words.splice(index, 1)
        }
        this.$nextTick(_ => {
          this.words.push(inputValue)
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    cancelBind(article) {
      console.log(article)
    }
  }
}
</script>
<style lang="sass">
.property-detail
  .info
    .address
      color: #409EFF
  .match-words
    .el-tag
      margin-right: 10px
      margin-bottom: 10px
    .add-new
      display: inline-block
      margin-bottom: 10px
      width: 90px
      height: 32px
      line-height: 32px
    .save
      display: block
</style>
