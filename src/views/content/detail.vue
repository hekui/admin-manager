<template>
  <div class="detail-container">
    <div class="content-container">
      <section class="link">
        <a class="url" target="_blank" :href="detailData.url || '#'">{{detailData.url || ''}}</a>
        <el-button type="info" size="mini" @click="handleUrl">访问</el-button>
      </section>
      <section class="article">
        <h1 class="title">{{detailData.articleTitle || ''}}</h1>
        <div class="subsidiary">
          <div class="sub name">{{detailData.name || ''}}</div>
          <div class="sub origin">{{detailData.origin || ''}}</div>
          <div class="sub date">{{detailData.date || ''}}</div>
        </div>
        <div class="article-content" v-html="detailData.articleContent || ''"></div>
        <div :class="['right-suspension', {'isEdit': flag==='edit'}]">
          <div class="count">
            <div class="praising">点赞：<span>{{detailData.praisingQuantity || 0}}</span></div>
            <div class="reading">阅读：<span>{{detailData.readingQuantity || 0}}</span></div>
          </div>
          <div class="edit">
            <div class="lon-lat" @click="handleBinding('lonlat')">绑定坐标：<span>{{detailData.lonlat || '暂无'}}</span></div>
            <div class="lon-lat" @click="handleBinding('articleType')">对应类型：<span>{{articleTypeFilter() || '暂无'}}</span></div>
            <div class="lon-lat" @click="handleBinding('tags')">对应标签：<span>{{detailData.tags.join(',') || '暂无'}}</span></div>
          </div>
          <div class="btn">
            <el-button type="info" class="to-edit" @click="handleToEdit">二次编辑</el-button>
            <el-button type="info" class="save" @click="handleSave">保存</el-button>
          </div>
        </div>
      </section>
      <section v-if="showDialog" class="dialog">
        <div class="message-box">
          <div class="title">{{dialogTitle}}</div>
          <template v-if="dialogType==='lonlat'">
            <div class="origin">数据来源：高德地图</div>
            <div class="map">
              <el-input v-model="binding.lonlat" placeholder="请输入经纬度"></el-input>
            </div>
          </template>
          <template v-if="dialogType==='articleType'">
            <div class="type">
              <el-form :inline="true">
                <el-form-item label="公众号类型：">
                  <el-cascader
                    expand-trigger="hover"
                    :options="articleOptions"
                    v-model="binding.articleType">
                  </el-cascader>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template v-if="dialogType==='tags'">
            <div class="tags">
              <el-button v-for="item in tagOptions" :key="item" :type="tagFilter(item)" @click="handleTags(item)">{{item}}</el-button>
            </div>
          </template>
          <div class="btn-group">
            <el-button size="mini" @click="handleCancel">取 消</el-button>
            <el-button type="primary" size="mini" @click="handleConfirm">确 定</el-button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'contentdetail',
  data() {
    return {
      loading: false,
      flag: this.$route.path === '/content/edit' ? 'edit' : 'detail',
      id: this.$route.query.id,
      showDialog: false,
      dialogType: '',
      binding: {
        lonlat: '',
        articleType: [],
        tags: []
      }
    }
  },
  computed: {
    ...mapState({
      detailData: state => state.content.detailData,
      articleOptions: state => state.content.options,
      tagOptions: state => state.content.tagOptions
    }),
    dialogTitle() {
      return this.dialogType === 'lonlat' ? '绑定坐标' : this.dialogType === 'articleType' ? '对应类型' : this.dialogType === 'tags' ? '对应标签' : ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    articleTypeFilter() {
      const articleType = []
      let targetOptions = this.articleOptions
      for (let i = 0; i < this.detailData.articleType.length; i++) {
        const value = this.detailData.articleType[i]
        targetOptions = getLabel(value, targetOptions)
      }

      function getLabel(value, data) {
        if (data.length === 0) return
        let children = []
        for (let i = 0; i < data.length; i++) {
          const option = data[i]
          if (option.value === value) {
            articleType.push(option.label)
            children = option.children
            break
          }
        }
        return children
      }
      return articleType.join('/')
    },
    tagFilter(item) {
      return this.binding.tags.indexOf(item) > -1 ? 'primary' : ''
    },
    fetchData() {
      this.loading = true
      this.$store.dispatch('getContentDetail', Object.assign({}, { id: this.id })).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 访问
    handleUrl() {
      window.open(this.detailData.url)
    },
    // 显示绑定弹窗
    handleBinding(type) {
      if (this.flag !== 'edit') return
      this.dialogType = type
      this.showDialog = true
      this.binding.lonlat = this.detailData.lonlat
      this.binding.articleType = [...this.detailData.articleType]
      this.binding.tags = [...this.detailData.tags]
    },
    handleToEdit() {
      this.$router.push({ path: '/content/edit', query: { id: this.id }})
    },
    handleTags(item) {
      var index = this.binding.tags.indexOf(item)
      if (index > -1) {
        this.binding.tags.splice(index, 1)
      } else {
        this.binding.tags.push(item)
      }
      // 排序
      this.binding.tags = this.tagOptions.filter(tag => {
        return this.binding.tags.indexOf(tag) > -1
      })
    },
    handleCancel() {
      this.showDialog = false
    },
    handleConfirm() {
      this.showDialog = false
      const targetObj = {
        [this.dialogType]: this.binding[this.dialogType]
      }
      this.$store.commit('contentSet', {
        target: 'detailData',
        data: Object.assign({}, this.detailData, targetObj)
      })
    },
    // 保存
    handleSave() {
      this.loading = true
      this.$store.dispatch('saveContentEdit').then(() => {
        this.loading = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
      }).catch(() => {
        this.loading = false
        this.$message({
          message: '保存失败！',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.detail-container {
  position: relative;
  height: 100%;
  color: #606266;
  .content-container {
    padding: 10px 20px;
    min-height: 100%;
    .link {
      margin: 20px 0;
      display: flex;
      justify-content: flex-start;
      height: 30px;
      line-height: 30px;
      .url {
        margin-right: 10px;
        color: #409eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .article {
      position: relative;
      padding-right: 200px;
      .right-suspension {
        position: absolute;
        right: 0;
        top: 0;
        width: 200px;
        .count, .edit {
          margin-bottom: 10px;
          padding: 10px;
          font-size: 18px;
          line-height: 26px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .count {
          span {
            color: #333;
            font-weight: 700;
          }
        }
        .edit {
          font-size: 14px;
        }
        .to-edit, .save {
          margin: 0;
          width: 100%;
          display: block;
        }
        .save {
          display: none;
        }
        &.isEdit {
          .edit {
            span {
              cursor: pointer;
              color: #409eff;
              &:hover {
                text-decoration: underline;
              }
            }
          }
          .to-edit, .save {
            display: none;
          }
          .save {
            display: block;
          }
        }
      }
      .subsidiary {
        display: flex;
        .sub {
          margin-right: 20px;
          &.origin {
            color: #409eff;
          }
        }
      }
    }
  }
  .dialog {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    font-size: 14px;
    z-index: 1000;
    .message-box {
      padding: 20px;
      width: 400px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 4px #ccc;
      background: #fff;
      .title {
        margin-bottom: 20px;
      }
      .origin {
        color: #999;
        font-size: 12px;
        margin-bottom: 20px;
      }
      .map, .type, .tags {
        margin-bottom: 20px;
      }
      .tags .el-button {
        margin: 0 10px 10px 0;
      }
    }
  }
}
  
</style>
