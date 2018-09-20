<template>
  <div class="app-container project-add">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="楼盘名称：">
          <el-input v-model.trim="filter.name" :clearable="true" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>

        <el-form-item label="楼盘状态：">
          <el-select v-model="filter.houseStatus" :clearable="true" placeholder="请选择">
            <el-option label="上线中" value="1"></el-option>
            <el-option label="已下架" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态：">
          <el-select v-model="filter.saleStatusId" :clearable="true" placeholder="请选择">
            <el-option v-for="item in salestatus" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-wrapper">
      <div class="table-top">
        当前已选：<span v-if="item.isInFgc !== 1" v-for="(item, index) in selection" :key="index" :data-id="item.id">{{ item.name }}</span>
      </div>
      <div class="table-main">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="listData.list"
          :row-key="getRowKeys"
          v-loading="loading"
          border
          style="width: 100%"
          :row-class-name="rowClassName"
          @row-click="handleRowClick"
          @select-all="handleSelectionAll"
          @select="handleSelection">
          <el-table-column
            :reserve-selection="true"
            :selectable='selectable' 
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="楼盘名称"
            width="300">
          </el-table-column>
          <el-table-column
            prop="region"
            label="区域"
            width="220">
          </el-table-column>
          <el-table-column
            prop="saleStatus"
            label="销售状态"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="houseStatus"
            label="楼盘状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.houseStatus === 1 ? '上线中' : scope.row.houseStatus === 0 ? '已下架' : '-'}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages clearfix">
        <el-button @click="selectAll">确定</el-button>
        <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            @current-change="changePage"
            :current-page="page.curPage"
            :page-size="listData.pageSize"
            :total="listData.totalRecords">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'paccountList',
  data() {
    return {
      loading: false,
      page: {
        curPage: 1,
        pageSize: 20
      },
      filter: {
        name: '',
        houseStatus: '',
        saleStatusId: '',
      },
      input: 0,
      value: true,
      multipleSelection: [],
      selection: [], // 选中的数据
      selectArr: [],
      getRowKeys(row) {
        return row.id
      },
      questions: [], // 分页时从后台获取的本页面数据  // 当前页选中的项
      allSelecteds: [],
    }
  },
  computed: {
    ...mapState({
      salestatus: state => state.salestatus,
      listData: state => state.project.mfmList
    })
  },
  created() {
    this.getSaleStatus() // 获取销售状态数据
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getSaleStatus() {
      this.$store.dispatch('getSaleStatus')
    },
    fetchData() {
      this.loading = true
      this.$store.dispatch('getProjectMfm', Object.assign({}, this.filter, this.page)).then((res) => {
        this.loading = false
        this.toggleRowSelection(res.data.list) // 勾选上已经添加的楼盘
      }).catch(() => {
        this.loading = false
      })
    },
    // 勾选上已经添加的楼盘
    toggleRowSelection(list) {
      const toggleRowSelection = this.$refs.multipleTable.toggleRowSelection
      list.forEach(item => {
        if (item.isInFgc === 1) {
          toggleRowSelection(item, true)
        }
      })
    },
    // 行类名
    rowClassName({ row, rowIndex }) {
      return row.isInFgc === 1 ? 'disabled' : ''
    },
    // checkbox是否可以勾选
    selectable(row, index) {
      return row.isInFgc !== 1
    },
    // 搜索
    submitFilter() {
      this.page.curPage = 1
      this.fetchData()
    },
    // 翻页
    changePage(curPage) {
      this.page.curPage = curPage
      this.fetchData()
    },
    checkScore(row) {
      return row.id
    },
    // 当某一行被点击时会触发该事件
    handleRowClick(row, event, column) {

    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    handleSelection(selection, row) {
      this.selection = selection
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelectionAll(selection) {
      this.selection = selection
    },
    select(selection, row) {
      let isSave = false
      const selectionLength = selection.length
      if (this.allSelecteds.length < 1) {
        this.allSelecteds = this.allSelecteds.concat(selection)
      } else { // select 事件
        if (row) {
          // 点击选中试题
          if (JSON.stringify(selection).indexOf(JSON.stringify(row)) !== -1) {
            this.delOrSaveSeleted(row, true)
          } else {
            // 从全部选中试题里把取消的这条数据删除
            this.delOrSaveSeleted(row)
          } // select-all 事件
        } else {
          // 点击全选全部选中本页
          if (selectionLength > 0) {
            isSave = true
          } else {
            // 点击全选取消选中本页的试题
            isSave = false
            selection = this.multipleSelection
          }
          for (let i = 0; i < selection.length; i++) {
            this.delOrSaveSeleted(selection[i], isSave)
          }
        }
      }
      if (selectionLength > 0) {
        this.multipleSelection = selection
      } else {
        this.multipleSelection = []
      }
    },
    // 删除或添加全部选中的试题
    delOrSaveSeleted(row, isSave) {
      const len = this.allSelecteds.length
      for (let i = 0; i < len; i++) {
        if (this.allSelecteds[i].id === row.id) {
          if (!isSave) {
            this.allSelecteds.splice(i, 1)
          }
          return
        }
      }
      if (isSave) {
        this.allSelecteds.push(row)
      }
    },
    selectAll() {
      const selection = this.multipleSelection
      this.selectArr = []
      if (selection) {
        selection.forEach(row => {
          if (row) {
            this.selectArr.push({
              id: row.id,
              name: row.name
            })
          }
        })
      }
      console.log('当前确定', this.selectArr)
    },
    getIndex(index) {
      return (this.page.curPage - 1) * this.listData.pageSize + index + 1
    },
  }
}
</script>
<style lang="scss">
.project-add{
  .table-top{
    display: flex;
    flex-wrap: wrap;
    color: #606266;
    span{
      margin-right: 10px;
      color: #409eff;
    }
  }
}
.el-table__row.disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
