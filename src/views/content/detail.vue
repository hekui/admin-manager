/**
 * @description: 内容详情及二次编辑管理
 * @author: zhangchenle
 * @date: 2018-8-6
 */
<template>
  <div class="detail-container" v-loading="loading">
    <div class="content-container">
      <section v-if="detailData.sourceUrl" class="link">
        <!-- <a class="url" target="_blank" :href="detailData.sourceUrl || '#'">{{detailData.sourceUrl || ''}}</a> -->
        <el-button type="info" size="mini" @click="handleUrl">访问原文</el-button>
      </section>
      <section class="article">
        <h1 class="title">{{detailData.title || ''}}</h1>
        <div class="subsidiary">
          <div class="sub name">{{detailData.wechatAccount || ''}}</div>
          <div class="sub origin">{{detailData.wechatName || ''}}</div>
          <div class="sub date">{{releaseTimeFilter(detailData.releaseTime) || ''}}</div>
        </div>
        <iframe class="article-content" :src="detailData.contentUrl" frameborder="0"></iframe>
        <div :class="['right-suspension', {'isEdit': flag==='edit'}]">
          <div class="count">
            <div class="praising">点赞：<span>{{detailData.likeNum || 0}}</span></div>
            <div class="reading">阅读：<span>{{detailData.readNum || 0}}</span></div>
          </div>
          <div class="edit">
            <!-- <div class="box">
              <div class="left">绑定坐标：</div>
              <div class="right">
                <span class="active" @click="handleBinding('lonlat')">{{detailData.lonlat || '新增'}}</span>
              </div>
            </div> -->
            <!-- <div class="box">
              <div class="left">绑定坐标：</div>
              <div class="right">
                <span>--</span>
              </div>
            </div> -->
            <div class="box">
              <div class="left">对应类型：</div>
              <div class="right">
                <span class="active" @click="handleBinding('articleType')">{{articleType.name.join('-') || '新增'}}</span>
              </div>
            </div>
            <div class="box">
              <div class="left">对应标签：</div>
              <div class="right">
                <span class="active" @click="handleBinding('tags')">{{articleTags.join(', ') || '新增'}}</span>
              </div>
            </div>
            <div class="box">
              <div class="left">关联项目：</div>
              <div class="right">
                <div class="house-item" v-for="(item, index) in detailData.houseList" :key="index" :title="item">
                  <div class="name">{{item.houseName}}</div>
                  <i class="el-icon-close icon-delete" @click="handleDelete(item.houseId)" title="删除"></i>
                </div>
                <div class="active" @click="handleBinding('house')">新增</div>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <template v-if="dialogType==='lonlat'">
        <div class="lonlat">
          <div class="origin">数据来源：高德地图</div>
          <div class="map">
            <el-input v-model="binding.lonlat" placeholder="请输入经纬度" :clearable="true"></el-input>
          </div>
        </div>
      </template>
      <template v-if="dialogType==='articleType'">
        <div class="type">
          <el-form>
            <el-form-item label="类型：">
              <el-cascader
                :options="articleTypeDict"
                v-model="binding.articleType"
                :change-on-select="true"
                :clearable="true">
              </el-cascader>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-if="dialogType==='tags'">
        <div class="tags">
          <el-button v-for="(item, index) in allTags" :key="item.id" :type="indexOfTag(item, index) > -1 ? 'primary': ''" @click="handleTags(item, index)">{{item.name}}</el-button>
        </div>
      </template>
      <template v-if="dialogType==='houseName'">
        <div class="house-name">
          <el-form :inline="true">
            <el-form-item label="项目名称：">
              <el-cascader
                :options="articleTypeDict"
                v-model="binding.articleType"
                :change-on-select="true"
                :clearable="true">
              </el-cascader>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      width="80%"
      :visible.sync="showHouseDialog">
      <div class="dialog-content">
        <project-dialog v-if="showHouseDialog" ref="projectDialog"></project-dialog>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { parseTime, handleInvalidType } from '@/utils'
import ProjectDialog from '@/components/ProjectDialog'
export default {
  name: 'contentdetail',
  components: {
    ProjectDialog,
  },
  data() {
    return {
      loading: false,
      // flag: this.$route.path === '/content/edit' ? 'edit' : 'detail',
      flag: 'edit',
      id: this.$route.query.id,
      showDialog: false,
      showHouseDialog: false,
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
      allTags: state => state.tag.allTags
    }),
    ...mapGetters(['articleTypeDict']),
    dialogTitle() {
      return this.dialogType === 'lonlat' ? '绑定坐标' : this.dialogType === 'articleType' ? '对应类型' : this.dialogType === 'tags' ? '对应标签' : this.dialogType === 'house' ? '关联项目' : ''
    },
    articleType() {
      const name = []
      const id = []
      if (!this.detailData.typeDictList || Object.prototype.toString.call(this.detailData.typeDictList) !== '[object Array]') return { id, name }
      getType(this.detailData.typeDictList)

      function getType(list) {
        if (list.length > 0) {
          name.push(list[0].name)
          id.push(list[0].id)
          getType(list[0].childList || [])
        }
      }
      return { id, name }
    },
    articleTags() {
      const labels = []
      if (!this.detailData.labels || Object.prototype.toString.call(this.detailData.labels) !== '[object Array]') return labels
      this.detailData.labels.forEach(element => {
        labels.push(element.name)
      })
      return labels
    }
  },
  created() {
    console.log('created')
    this.$store.dispatch('getTypeDict', { code: 3 }) // 查询文章类型
    this.fetchData()
    this.getAllTags()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('getContentDetail', Object.assign({}, { id: this.id })).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取所有标签
    getAllTags() {
      this.$store.dispatch('getAllTags')
    },
    releaseTimeFilter(time) {
      return parseTime(Number(time))
    },
    indexOfTag(item, index) {
      for (let i = 0; i < this.binding.tags.length; i++) {
        if (this.binding.tags[i].id === item.id) {
          this.binding.tags[i].$index = index
          return i
        }
      }
      return -1
    },
    // 访问
    handleUrl() {
      window.open(this.detailData.sourceUrl)
    },
    // 显示绑定弹窗
    handleBinding(type) {
      if (this.flag !== 'edit') return
      this.dialogType = type
      if (type === 'house') {
        this.showHouseDialog = true
      } else {
        this.showDialog = true
      }
      this.binding.lonlat = this.detailData.lonlat
      this.binding.articleType = handleInvalidType(this.articleTypeDict, this.articleType.id)
      this.binding.tags = [...this.detailData.labels]
    },
    // 删除项目关联
    handleDelete(houseId) {
      this.$confirm('确认要删除该项目关联么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteHouse', { id: this.detailData.id, houseId }).then(() => {
          this.$store.commit('SET_REFRESH_LIST', true) // 更新内容管理列表
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作!'
        })
      })
    },
    // 新增项目关联
    addHouse(houseId) {
      this.$store.dispatch('addHouse', { id: this.detailData.id, houseId }).then(() => {
        this.$store.commit('SET_REFRESH_LIST', true) // 更新内容管理列表
        this.$message({
          message: '新增成功！',
          type: 'success'
        })
      })
    },
    // 编辑标签
    handleTags(item, index) {
      let flag = false
      for (let i = 0; i < this.binding.tags.length; i++) {
        if (this.binding.tags[i].id === item.id) {
          this.binding.tags.splice(i, 1)
          flag = true
        }
      }
      if (!flag) this.binding.tags.push(item)
    },
    // 对话框取消按钮
    handleCancel() {
      this.showDialog = false
      this.showHouseDialog = false
    },
    // 对话框确认按钮
    handleConfirm() {
      if (this.dialogType === 'lonlat') this.handleSaveLonLat()
      if (this.dialogType === 'articleType') this.handleSaveArticleType()
      if (this.dialogType === 'tags') this.handleSaveTags()
      if (this.dialogType === 'house') {
        const houseId = this.$refs.projectDialog.currentProject.id
        if (!houseId) {
          this.$message({
            message: '请选择楼盘！',
            type: 'warning'
          })
          return
        }
        this.addHouse(houseId)
      }
      this.showDialog = false
      this.showHouseDialog = false
    },
    // 保存经纬度
    handleSaveLonLat() {

    },
    // 保存标签
    handleSaveTags() {
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = { id: this.id, labels: this.binding.tags.map(tag => tag.id) }
        this.$store.dispatch('saveContentTags', params).then(() => {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作!'
        })
      })
    },
    // 保存类型
    handleSaveArticleType() {
      this.$confirm('是否要保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const articleType = [...this.binding.articleType]
        this.$store.dispatch('saveContentType', { id: this.id, typeId: articleType.pop() }).then((res) => {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作!'
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
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
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
      padding-right: 210px;
      height: calc(100% - 70px);
      overflow: hidden;
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
            .box {
              position: relative;
              padding-left: 70px;
              .left {
                position: absolute;
                left: 0;
                top: 0;
                width: 70px;
              }
              .right {
                width: 100%;
              }
              .house-item {
                position: relative;
                width: 100%;
                .name {
                  display: inline-block;
                  vertical-align: top;
                  max-width: 85px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
            .active {
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
      .article-content {
        width: 100%;
        height: calc(100% - 86px);
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.detail-container {
  .el-dialog {
    width: 500px;
    border-radius: 5px;
    .dialog-content {
      height: 500px;
    }
    .el-dialog__title {
      font-size: 14px;
    }
    .el-dialog__body {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      .lonlat {
        .origin {
          margin-bottom: 20px;
        }
        .map {
          .el-input {
            width: 100%;
          }
        }
      }
      .type .el-form-item {
        width: 100%;
        position: relative;
        .el-form-item__label {
          position: absolute;
          width: 50px;
          font-size: 12px;
        }
        .el-form-item__content {
          width: 100%;
          padding-left: 50px;
          .el-cascader {
            width: 100%;
            font-size: 12px;
          }
        }
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        .el-button {
          margin: 0 10px 10px 0;
          max-width: 100%;
          min-width: 30%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .house-name {
        .el-form-item__label {
          text-align: left;
          width: 75px;
        }
        .el-form-item__content {
          padding-left: 70px;
        }
        
      }
    }
  }
  .icon-delete {
    cursor: pointer;
    font-size: 12px;
  }
}
</style>
