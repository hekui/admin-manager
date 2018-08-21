/**
 * @description: 城市管理
 * @author: zhangchenle
 * @date: 2018-8-16
 */
<template>
  <div class="tag-container">
    <div class="content-container">
      <!-- <section class="form">
        <div class="add">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增城市</el-button>
        </div>
      </section> -->
      <section class="table">
        <el-table
          :data="listData"
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
            prop="code"
            label="城市编码">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            label="状态"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.status === 1 ? '激活' : scope.row.status === 2 ? '锁定' : ''}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === 1 || scope.row.status === 2" @click="handleStatus(scope.row)" type="text" size="small">{{ scope.row.status === 1 ? '锁定' : scope.row.status === 2 ? '激活' : '' }}</el-button>
              <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </section>
      <!-- <section class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.curPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listData.totalPage">
        </el-pagination>
      </section> -->
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form v-loading="dialogLoading" ref="form" :model="form" :rules="rules">
        <el-form-item label="城市名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="城市拼音：" prop="pinyin">
          <el-input v-model="form.pinyin" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="城市编码：" prop="code">
          <el-input v-model="form.code" placeholder="请输入名称" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleConfirm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { handleInvalidType } from '@/utils'

export default {
  name: 'tag',
  data() {
    return {
      loading: false,
      dialogLoading: false,
      showDialog: false,
      dialogType: '',
      page: {
        // curPage: 1,
        // pageSize: 20
      },
      form: {
        id: '',
        name: '',
        pinyin: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入城市名称', trigger: ['change', 'blur'] }
        ],
        pinyin: [
          { required: true, message: '请输入城市拼音', trigger: ['change', 'blur'] }
        ],
        code: [
          { required: true, message: '请输入城市编码', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      listData: state => state.city.allCitys
    }),
    dialogTitle() {
      return this.dialogType === 'add' ? '新增城市' : '编辑城市'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 查询标签
    fetchData() {
      this.loading = true
      this.$store.dispatch('getAllCitys', Object.assign({}, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取序号
    getIndex(index) {
      // return (this.page.curPage - 1) * this.page.pageSize + index + 1
      return index + 1
    },
    // 改变每页条数
    handleSizeChange(val) {
      this.page.curPage = 1
      this.page.pageSize = val
      this.fetchData()
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
    handleStatus(data) {
      this.loading = true
      this.$store.dispatch('changeCityStatus', data).then((res) => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
      }).catch(() => {
        this.loading = false
      })
    },
    // 编辑标签
    handleEdit(data) {
      this.dialogType = 'edit'
      this.showDialog = true
      this.dialogLoading = true
      const param = { id: data.id }
      this.$store.dispatch('queryCityById', param).then((res) => {
        this.dialogLoading = false
        res.data.typeId = []
        getTypeId(res.data.typeDictList)
        this.form = Object.assign({}, res.data)
        this.form.typeId = [1, 2, 5]
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
            const param = Object.assign({}, this.form)
            param.typeId = param.typeId.pop() || '' // 取最后一个元素作为typeId保存到数据库
            this.$store.dispatch('saveOrEditCity', param).then(() => {
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
        display: none;
      }
      .editable_copy {
        padding: 5px;
        display: none;
        width: 100%;
        border: none;
        outline: 1px solid aquamarine;
      }
      .visible {
        display: block;
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