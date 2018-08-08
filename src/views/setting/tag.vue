/**
 * @description: 标签管理
 * @author: zhangchenle
 * @date: 2018-8-7
 */
<template>
  <div class="tag-container">
    <div class="content-container">
      <section class="form">
        <el-form :inline="true" :model="filter">
          <el-form-item label="标签名称：">
            <el-input v-model="filter.tagName" placeholder="请输入名称" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="submitFilter">搜索</el-button>
          </el-form-item>
          <div class="add">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增标签</el-button>
          </div>
        </el-form>
      </section>
      <section class="table">
        <el-table
          :data="listData.list"
          border
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            :index="getIndex">
          </el-table-column>
          <el-table-column
            prop="tagName"
            label="标签名称">
          </el-table-column>
          <el-table-column
            prop="order"
            label="排序"
            width="50">
          </el-table-column>
          <el-table-column
            label="是否前端引导"
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.guide === 0 ? '否' : '是'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型">
            <template slot-scope="scope">
              <span>{{tagTypeFilter(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.status === 0 ? '锁定' : '激活'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleLock(scope.row)" type="text" size="small">{{ scope.row.status === 1 ? '锁定' : '激活' }}</el-button>
              <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <section class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listData.totalPage">
        </el-pagination>
      </section>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="标签名称*：">
          <el-input v-model="form.tagName" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="是否前端引导*：">
          <el-radio-group v-model="form.guide">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态*：">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">激活</el-radio>
            <el-radio :label="0">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型：">
          <el-cascader
            expand-trigger="hover"
            :options="tagOptions"
            v-model="form.tagType"
            :clearable="true">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'tag',
  data() {
    return {
      loading: false,
      showDialog: false,
      dialogType: '',
      filter: {
        tagName: '' // 标签名称
      },
      page: {
        pageNo: 1,
        pageSize: 10
      },
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
      tagOptions: state => state.tag.tagOptions,
      listData: state => state.tag.listData
    }),
    dialogTitle() {
      return this.dialogType === 'add' ? '新增标签' : '编辑标签'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 查询标签
    fetchData() {
      this.loading = true
      this.$store.dispatch('getTagList', Object.assign({}, this.filter, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取序号
    getIndex(index) {
      return (this.page.pageNo - 1) * this.page.pageSize + index + 1
    },
    // 过滤标签类型
    tagTypeFilter(data) {
      const tagType = []
      let targetOptions = this.tagOptions
      for (let i = 0; i < data.tagType.length; i++) {
        const value = data.tagType[i]
        targetOptions = getLabel(value, targetOptions)
      }

      function getLabel(value, data) {
        if (data.length === 0) return
        let children = []
        for (let i = 0; i < data.length; i++) {
          const option = data[i]
          if (option.value === value) {
            tagType.push(option.label)
            children = option.children
            break
          }
        }
        return children
      }
      return tagType.join('-') || '-'
    },
    // 改变每页条数
    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.fetchData()
    },
    // 条件查询
    submitFilter() {
      this.page.pageNo = 1
      this.fetchData()
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
    handleLock(data) {
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
.tag-container {
  position: relative;
  height: 100%;
  color: #606266;
  .content-container {
    padding: 10px 20px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .form {
      position: relative;
      padding: 20px 0 30px;
      .add {
        position: absolute;
        left: 0;
        bottom: 5px;
      }
    }
    .pagination {
      margin-top: 12px;
      text-align: right;
    }
    .ad-pic {
      width: 100%;
      height: 100%;
    }
  }
}
.el-input {
  width: 220px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.tag-container {
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