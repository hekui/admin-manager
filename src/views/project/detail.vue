<template>
  <div class="app-container property-detail">
    <div class="info">
      <h1 class="title">{{info.name}}</h1>
      <span class="address">{{info.address}}</span>
    </div>
    <div class="match-words">
      <h2>匹配词</h2>
      <div></div>
      <el-tag
        :key="word.id"
        v-for="(word, index) in info.matchWordList"
        closable
        :disable-transitions="false"
        @close="tagClose(index)">
        {{word.name}}
      </el-tag>
      <div class="add-new">
        <el-input
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="cancelInput">
        </el-input>
        <el-button v-else size="small" @click="showInput"> + 添加 </el-button>
      </div>
      <el-button class="save" type="primary" @click="saveMatchWords">保存</el-button>
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
            prop="wechatAccount"
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
          name: '',
          address: '',
          matchWordList: [],
        },
        inputVisible: false,
        inputValue: ''
      }
    },
    computed: {
      id: function() {
        return this.$route.query.id
      }
    },
    created() {
      this.fetchProjectDetail()
      this.getProjectArticleList()
    },
    methods: {
      fetchProjectDetail() {
        this.$store.dispatch('getProjectDetail', { id: this.id }).then(res => {
          this.info = Object.assign({}, res.data)
          console.log(this.info)
        }).catch(() => {

        })
      },
      saveMatchWords() {
        this.$store.dispatch('saveMatchWords', Object.assign({ id: this.id, matchWordList: this.info.matchWordList })).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.getProjectArticleList()
        }, (res) => {
          this.$message({
            type: 'error',
            message: res.data.msg || '保存失败，请稍后重试'
          })
        })
      },
      getProjectArticleList() {
        this.loading = true
        this.$store.dispatch('getProjectArticleList', Object.assign({ id: this.id }, this.page)).then(res => {
          this.articleData = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      changePage(curPage) {
        this.page.curPage = curPage
        this.getProjectArticleList()
      },
      tagClose(index) {
        this.$nextTick(_ => {
          this.info.matchWordList.splice(index, 1)
        })
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm() {
        const inputValue = this.inputValue.trim()
        if (inputValue) {
          const index = this.info.matchWordList.map(val => val.name).findIndex(value => value === inputValue)
          if (index !== -1) {
            this.info.matchWordList.splice(index, 1)
          }
          this.$nextTick(_ => {
            this.info.matchWordList.push({ id: '', name: inputValue })
          })
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      cancelInput() {
        this.inputVisible = false
        this.inputValue = ''
      },
      cancelBind(scope) {
        const article = scope.row
        this.loading = true
        this.articleData.list.splice(scope.$index, 1)
        this.$store.dispatch('cancelBindArticle', { id: this.id, contentId: article.id }).then(res => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '解除绑定成功!'
          })
        }, (res) => {
          this.articleData.list.splice(scope.$index, 0, article)
          this.loading = false
          this.$message({
            type: 'error',
            message: res.data.msg || '解除绑定失败，请稍后重试'
          })
        })
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
