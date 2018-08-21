/**
 * @description: 类型管理
 * @author: zhangchenle
 * @date: 2018-8-7
 */
<template>
  <div class="category-container">
    <div class="content-container" v-loading="loading">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <div class="add">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">新增类型</el-button>
        </div>
        <div class="table">
          <div class="head">
            <span style="margin-left: 24px;">类型</span>
            <span class="custom-right-text">
              <span class="status">状态</span>
              <span class="handle">操作</span>
            </span>
          </div>
          <el-tab-pane label="文章" name="article">
            <el-tree
              :data="articleTypeDict"
              :props="props"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="custom-left-text">
                  <span>{{ node.label }}</span>
                  <span>
                    <span title="新增子类" @click="handleAdd(node)">
                      <SvgIcon :iconClass="'add'" :className="'icon-add'"></SvgIcon>
                    </span>
                    <!-- <span title="删除" @click="handleDelete(node)">
                      <SvgIcon :iconClass="'delete'" :className="'icon-delete'"></SvgIcon>
                    </span> -->
                  </span>
                </span>
                <span class="custom-right-text">
                  <span class="status">{{ node.data.status === 1 ? '激活' : node.data.status === 2 ? '锁定' : '' }}</span>
                  <span class="handle">
                    <el-button
                      v-if="node.data.status === 1 || node.data.status === 2"
                      type="text"
                      size="mini"
                      @click="handleStatus(node)">
                      {{ node.data.status === 1 ? '锁定' : node.data.status === 2 ? '激活' : '' }}
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="handleEdit(node)">
                      编辑
                    </el-button>
                  </span>
                </span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="公众号" name="publicNo">
            <el-tree
              :data="paccountTypeDict"
              :props="props"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="custom-left-text">
                  <span>{{ node.label }}</span>
                  <span>
                    <span title="新增子类" @click="handleAdd(node)">
                      <SvgIcon :iconClass="'add'" :className="'icon-add'"></SvgIcon>
                    </span>
                    <!-- <span title="删除" @click="handleDelete(node)">
                      <SvgIcon :iconClass="'delete'" :className="'icon-delete'"></SvgIcon>
                    </span> -->
                  </span>
                </span>
                <span class="custom-right-text">
                  <span class="status">{{ node.data.status === 1 ? '激活' : node.data.status === 2 ? '锁定' : '' }}</span>
                  <span class="handle">
                    <el-button
                      v-if="node.data.status === 1 || node.data.status === 2"
                      type="text"
                      size="mini"
                      @click="handleStatus(node)">
                      {{ node.data.status === 1 ? '锁定' : node.data.status === 2 ? '激活' : '' }}
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="handleEdit(node)">
                      编辑
                    </el-button>
                  </span>
                </span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="标签" name="tag">
            <el-tree
              :data="tagTypeDict"
              :props="props"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="custom-left-text">
                  <span>{{ node.label }}</span>
                  <span>
                    <span title="新增子类" @click="handleAdd(node)">
                      <SvgIcon :iconClass="'add'" :className="'icon-add'"></SvgIcon>
                    </span>
                    <!-- <span title="删除" @click="handleDelete(node)">
                      <SvgIcon :iconClass="'delete'" :className="'icon-delete'"></SvgIcon>
                    </span> -->
                  </span>
                </span>
                <span class="custom-right-text">
                  <span class="status">{{ node.data.status === 1 ? '激活' : node.data.status === 2 ? '锁定' : '' }}</span>
                  <span class="handle">
                    <el-button
                      v-if="node.data.status === 1 || node.data.status === 2"
                      type="text"
                      size="mini"
                      @click="handleStatus(node)">
                      {{ node.data.status === 1 ? '锁定' : node.data.status === 2 ? '激活' : '' }}
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="handleEdit(node)">
                      编辑
                    </el-button>
                  </span>
                </span>
              </span>
            </el-tree>
          </el-tab-pane>
        </div>
      </el-tabs>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form v-if="showDialog" v-loading="dialogLoading" ref="form" :model="form" :rules="rules">
        <el-form-item label="类型名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="上级类型：">
          <el-cascader
            :change-on-select="true"
            :options="getOptions()"
            v-model="form.parentId"
            :clearable="true"
            :disabled="dialogType !== 'addnew'">
          </el-cascader>
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
import { mapState, mapGetters } from 'vuex'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'category',
  components: { SvgIcon },
  data() {
    return {
      activeName: 'publicNo',
      loading: false,
      dialogLoading: false,
      showDialog: false,
      dialogType: '',
      props: {
        value: 'id',
        label: 'name',
        children: 'childList'
      },
      form: {
        id: '',
        name: '',
        parentId: []
      },
      rules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      paccountTypeDict: state => state.category.paccountTypeDict,
      tagTypeDict: state => state.category.tagTypeDict,
      articleTypeDict: state => state.category.articleTypeDict
    }),
    ...mapGetters({
      paccountTypeDictActivated: 'paccountTypeDict',
      tagTypeDictActivated: 'tagTypeDict',
      articleTypeDictActivated: 'articleTypeDict',
    }),
    dialogTitle() {
      return this.dialogType === 'edit' ? '编辑类型' : '新增类型'
    }
  },
  created() {
    const code = this.activeName === 'publicNo' ? 1 : this.activeName === 'tag' ? 2 : 3
    this.fetchData(code) // 查询该类型所有数据
    this.fetchActivatedData(code) // 查询该类型激活数据
  },
  methods: {
    getOptions() {
      if (this.activeName === 'publicNo') return this.paccountTypeDictActivated
      if (this.activeName === 'tag') return this.tagTypeDictActivated
      if (this.activeName === 'article') return this.articleTypeDictActivated
      return []
    },
    handleTabClick(tab) {
      const code = tab.name === 'publicNo' ? 1 : tab.name === 'tag' ? 2 : 3
      this.fetchData(code) // 查询该类型所有数据
      this.fetchActivatedData(code) // 查询该类型激活数据
    },
    // 查询该类型所有数据
    fetchData(code) {
      this.loading = true
      this.$store.dispatch('getAllTypeDict', { code: code }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询该类型激活数据
    fetchActivatedData(code) {
      this.$store.dispatch('getTypeDict', { code: code })
    },
    // 删除标签
    handleDelete(node) {
      this.$confirm('是否要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('deleteCategory', { id: node.data.id }).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const code = this.activeName === 'publicNo' ? 1 : this.activeName === 'tag' ? 2 : 3
          this.fetchData(code)
          this.fetchActivatedData(code)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 新增标签
    handleAdd(node) {
      if (node) {
        if (node.data.status !== 1) {
          this.$message({
            type: 'warning',
            message: '类型未激活，无法新增子类'
          })
          return
        }
        this.dialogType = 'addsub'
      } else {
        this.dialogType = 'addnew'
      }
      this.form = {
        id: '',
        name: '',
        parentId: this.getParentId(node)
      }
      this.showDialog = true
    },
    // 根据节点获取类型级联Id
    getParentId(node, typeId) {
      typeId = typeId || []
      if (node && node.level > 0) {
        typeId.unshift(node.data.id)
        this.getParentId(node.parent, typeId)
      }
      return typeId
    },
    // 编辑标签
    handleEdit(node) {
      if (node.data.status !== 1) {
        this.$message({
          type: 'warning',
          message: '类型未激活，无法编辑'
        })
        return
      }
      this.form = Object.assign({}, {
        id: node.data.id,
        name: node.data.name,
        parentId: []
      })
      this.form.parentId = this.getParentId(node.parent)
      this.dialogType = 'edit'
      this.showDialog = true
    },
    // 锁定/激活
    handleStatus(node) {
      const tips = node.data.status === 1 ? '是否要锁定' : '是否要激活'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('changeCategoryStatus', { id: node.data.id, status: node.data.status === 1 ? 2 : 1 }).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.showDialog = false
          const code = this.activeName === 'publicNo' ? 1 : this.activeName === 'tag' ? 2 : 3
          this.fetchData(code)
          this.fetchActivatedData(code)
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
            const param = Object.assign({}, this.form)
            if (this.activeName === 'publicNo') param.code = 1
            if (this.activeName === 'tag') param.code = 2
            if (this.activeName === 'article') param.code = 3
            param.parentId = param.parentId.pop() || '' // 取最后一个元素作为typeId保存到数据库
            this.$store.dispatch('saveOrEditType', param).then(() => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.showDialog = false
              const code = this.activeName === 'publicNo' ? 1 : this.activeName === 'tag' ? 2 : 3
              this.fetchData(code)
              this.fetchActivatedData(code)
            }).catch(() => {
              this.loading = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作!'
            })
          })
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.category-container {
  position: relative;
  height: 100%;
  color: #606266;
  .content-container {
    padding: 10px 20px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .add {
      margin-bottom: 10px;
    }
    .table {
      padding-bottom: 5px;
      border: 1px solid #eee;
      border-radius: 5px;
      .head {
        padding-right: 8px;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #909399;
        user-select: none;
        font-weight: bold;
        border-bottom: 1px solid #eee;
      }
      .custom-tree-node {
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        .custom-left-text {
          .icon-add, .icon-delete {
            display: none;
            color: #409EFF;
            font-size: 17px;
            &:hover {
              color: rgba(64, 158, 255, .8)
            }
          }
          .icon-add {
            margin-left: 5px;
          }
        }
        &:hover {
          .icon-add, .icon-delete {
            display: inline;
          }
        }
      }
      .head, .custom-tree-node {
        .custom-right-text {
          height: 100%;
          display: flex;
          align-items: center;
          .status {
            padding-left: 8px;
            height: 100%;
            display: flex;
            align-items: center;
            width: 80px;
            border-left: 1px solid #eee;
          }
          .handle {
            padding-left: 8px;
            width: 80px;
            height: 100%;
            display: flex;
            align-items: center;
            border-left: 1px solid #eee;
          }
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.category-container {
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
    .el-form-item {
      position: relative;
      .el-form-item__label {
        position: absolute;
        width: 110px;
        font-size: 12px;
      }
      .el-form-item__content {
        padding-left: 110px;
        .el-input, .el-cascader {
          width: 100%;
          font-size: 12px;
        }
      }
    }
    .el-form-item__error {
      margin-left: 110px;
    }
  }
}
</style>