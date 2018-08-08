/**
 * @description: 类型管理
 * @author: zhangchenle
 * @date: 2018-8-7
 */
<template>
  <div class="category-container">
    <div class="content-container" v-loading="loading">
      <el-tabs v-model="activeName" @tab-click="handleChangeTabs">
        <div class="add">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增类型</el-button>
        </div>
        <div class="head">
          <span>类型</span>
          <span class="custom-right-text">
            <span class="status">状态</span>
            <span class="handle">操作</span>
          </span>
        </div>
        <el-tab-pane label="公众号" name="publicNo">
          <el-tree
            :data="treeData1"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="custom-right-text">
                <span class="status">{{ node.status === 1 ? '激活' : '锁定' }}</span>
                <span class="handle">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleStatus(node)">
                    {{ node.status === 1 ? '锁定' : '激活' }}
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
            :data="treeData2"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="custom-right-text">
                <span class="status">{{ node.status === 1 ? '激活' : '锁定' }}</span>
                <span class="handle">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleStatus(node)">
                    {{ node.status === 1 ? '锁定' : '激活' }}
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
        <el-tab-pane label="文章" name="article">
          <el-tree
            :data="treeData3"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="custom-right-text">
                <span class="status">{{ node.status === 1 ? '激活' : '锁定' }}</span>
                <span class="handle">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleStatus(node)">
                    {{ node.status === 1 ? '锁定' : '激活' }}
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
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'category',
  data() {
    return {
      activeName: 'publicNo',
      loading: false,
      showDialog: false,
      dialogType: '',
      form: {
        id: '',
        tagName: '',
        guide: 0,
        status: 1,
        category: []
      }
    }
  },
  computed: {
    ...mapState({
      treeData1: state => state.category.treeData1,
      treeData2: state => state.category.treeData2,
      treeData3: state => state.category.treeData3
    }),
    dialogTitle() {
      return this.dialogType === 'add' ? '新增标签' : '编辑标签'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleChangeTabs() {

    },
    // 查询标签
    fetchData() {
      this.loading = true
      this.$store.dispatch('getTreeList', Object.assign({}, this.filter, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增标签
    handleAdd() {
      this.form = {
        id: '',
        tagName: '',
        guide: 0,
        status: 1,
        category: []
      }
      this.dialogType = 'add'
      this.showDialog = true
    },
    // 锁定/激活
    handleStatus(data) {
      this.$confirm('是否要下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('offlineAdvert', data).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.showDialog = false
          this.fetchData()
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '操作失败！',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作!'
        })
      })
    },
    // 编辑标签
    handleEdit(data) {
      this.form = Object.assign({}, data)
      this.dialogType = 'edit'
      this.showDialog = true
    },
    // 取消
    handleCancel() {
      this.showDialog = false
    },
    // 提交新增/编辑
    handleConfirm() {
      this.$confirm('是否要提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('saveAdvert', this.form).then(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.showDialog = false
          this.fetchData()
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '操作失败！',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作!'
        })
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
    .head {
      padding: 10px 8px 10px 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #909399;
      user-select: none;
      font-weight: bold;
      border-bottom: 1px solid #eee;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .head, .custom-tree-node {
      .custom-right-text {
        display: flex;
        align-items: center;
        .status {
          margin-right: 300px;
          width: 50px;
        }
        .handle {
          width: 80px;
          text-align: center;
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
    .el-input {
      width: 380px;
      font-size: 12px;
    }
    .el-form-item__label {
      width: 110px;
      font-size: 12px;
    }
  }
}
</style>