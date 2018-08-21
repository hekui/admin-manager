/**
 * @description: 标签管理
 * @author: zhangchenle
 * @date: 2018-8-7
 */
<template>
  <div class="tag-container">
    <div class="content-container">
      <section class="form-filter">
        <el-form :inline="true" :model="filter">
          <el-form-item label="标签名称：">
            <el-input v-model="filter.name" placeholder="请输入名称" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="submitFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </section>
      <div class="table-top">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增标签</el-button>
      </div>
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
            prop="name"
            label="标签名称">
          </el-table-column>
          <el-table-column
            label="排序"
            width="80">
            <template slot-scope="scope">
              <div class="sequenceNum">
                <div :id="'editable_value_' + scope.$index"
                  class="editable_value visible"
                  @click="sequenceNumFocus($event, scope)">
                  {{scope.row.sequenceNum}}
                </div>
                <input type="number" :id="'editable_copy_' + scope.$index"
                  class="editable_copy"
                  v-model="beforeEditableValue"
                  value="number"
                  @blur="sequenceNumBlur($event, scope)"
                  @keyup.enter="sequenceNumConfirm($event, scope)"
                  @keyup.esc="sequenceNumCancel($event, scope)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="是否前端引导"
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.hasGuide === 0 ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.typeName || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.labelStatus === 0 ?  '激活' : '锁定'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleStatus(scope.row)" type="text" size="small">{{ scope.row.labelStatus === 0 ? '锁定' : '激活' }}</el-button>
              <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <section class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="page.curPage"
          :page-size="listData.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="listData.totalRecords">
        </el-pagination>
      </section>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form v-if="showDialog" v-loading="dialogLoading" ref="form" :model="form" :rules="rules">
        <el-form-item label="标签名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="是否前端引导：" prop="hasGuide">
          <el-radio-group v-model="form.hasGuide">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：" prop="labelStatus">
          <el-radio-group v-model="form.labelStatus">
            <el-radio :label="0">激活</el-radio>
            <el-radio :label="1">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型：">
          <el-cascader
            :change-on-select="true"
            :options="tagTypeDict"
            v-model="form.typeId"
            :clearable="true">
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
import { handleInvalidType } from '@/utils'

export default {
  name: 'tag',
  data() {
    return {
      loading: false,
      dialogLoading: false,
      showDialog: false,
      dialogType: '',
      beforeEditableValue: '',
      filter: {
        name: '' // 标签名称
      },
      page: {
        curPage: 1
      },
      form: {
        id: '',
        name: '',
        hasGuide: 1,
        labelStatus: 0,
        typeId: []
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: ['change', 'blur'] }
        ],
        hasGuide: [
          { required: true, message: '请选择是否前端引导', trigger: 'change' }
        ],
        labelStatus: [
          { required: true, message: '请选择标签状态', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      listData: state => state.tag.listData
    }),
    ...mapGetters(['tagTypeDict']),
    dialogTitle() {
      return this.dialogType === 'add' ? '新增标签' : '编辑标签'
    }
  },
  created() {
    this.$store.dispatch('getTypeDict', { code: 2 })
    this.fetchData()
  },
  methods: {
    // 条件查询
    submitFilter() {
      this.page.curPage = 1
      this.fetchData()
    },
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
      return (this.page.curPage - 1) * this.listData.pageSize + index + 1
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page.curPage = val
      this.fetchData()
    },
    // 新增标签
    handleAdd() {
      this.form = {
        id: '',
        name: '',
        hasGuide: 1,
        labelStatus: 0,
        typeId: []
      }
      this.dialogType = 'add'
      this.showDialog = true
    },
    // 获取焦点
    sequenceNumFocus(event, scope) {
      this.beforeEditableValue = scope.row.sequenceNum
      const nextElement = document.getElementById('editable_copy_' + scope.$index)
      event.target.className = 'editable_value'
      nextElement.className = 'editable_copy visible'
      nextElement.focus()
    },
    // 失去焦点
    sequenceNumBlur(event, scope) {
      const prevElement = document.getElementById('editable_value_' + scope.$index)
      event.target.className = 'editable_copy'
      prevElement.className = 'editable_value visible'
    },
    // 回车确认修改排序
    sequenceNumConfirm(event, scope) {
      this.$store.dispatch('updateSequenceNum', { id: scope.row.id, index: scope.$index, sequenceNum: this.beforeEditableValue }).then((res) => {
        this.sequenceNumBlur(event, scope)
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      })
    },
    // ESC取消修改
    sequenceNumCancel(event, scope) {
      this.sequenceNumBlur(event, scope)
      this.$message({
        type: 'info',
        message: '已取消修改!'
      })
    },
    handleStatus(data) {
      const tips = data.labelStatus === 0 ? '是否要锁定' : '是否要激活'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = Object.assign({}, {
          id: data.id,
          labelStatus: data.labelStatus === 0 ? 1 : 0,
        })
        this.loading = true
        this.$store.dispatch('changeTagStatus', param).then((res) => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
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
    // 编辑标签
    handleEdit(data) {
      this.dialogType = 'edit'
      this.showDialog = true
      this.dialogLoading = true
      const param = { id: data.id }
      this.$store.dispatch('queryTagById', param).then((res) => {
        this.dialogLoading = false
        res.data.typeId = []
        getTypeId(res.data.typeDictList)
        this.form = Object.assign({}, res.data)
        this.form.typeId = handleInvalidType(this.tagTypeDict, this.form.typeId)

        function getTypeId(list) {
          if (!list) return
          for (let i = 0; i < list.length; i++) {
            res.data.typeId.push(list[i].id)
            getTypeId(list[i].childList)
            return
          }
        }
      }).catch(() => {
        this.dialogLoading = false
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
            this.dialogLoading = true
            const param = Object.assign({}, {
              id: this.form.id,
              name: this.form.name,
              hasGuide: this.form.hasGuide,
              labelStatus: this.form.labelStatus,
              typeId: ([...this.form.typeId]).pop() || '' // 取最后一个元素作为typeId保存到数据库
            })
            this.$store.dispatch('saveOrEditTag', param).then(() => {
              this.dialogLoading = false
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.showDialog = false
              this.fetchData()
            }).catch(() => {
              this.dialogLoading = false
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type='number']{
    -moz-appearance: textfield;
}
.tag-container {
  position: relative;
  height: 100%;
  color: #606266;
  .content-container {
    padding: 10px 20px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .sequenceNum {
      padding: 1px;
      .editable_value {
        cursor: text;
        display: none;
        border: 1px solid #dcdfe6;
      }
      .editable_copy {
        padding: 5px;
        display: none;
        width: 100%;
        line-height: 23px;
        border: 1px solid #409eff;
        outline: none;
        color: #606266;
        font-family: Microsoft YaHei, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Arial, sans-serif;
      }
      .visible {
        display: block;
        border-radius: 4px;
        padding: 0 15px;
      }
    }
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
    .el-form-item__error {
      margin-left: 110px;
    }
  }
}
</style>