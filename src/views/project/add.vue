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
            <el-option label="已下架" value="0"></el-option>
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
      <div v-if="selection.length > 0" class="table-top">
        <div>当前已选：</div>
        <div v-for="item in selection" class="item" :key="item.id">{{ item.name }}</div>
      </div>
      <div class="table-main" v-loading="loading">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="listData.list"
          :row-key="getRowKeys"
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
            label="销售状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.saleStatus || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="houseStatus"
            label="楼盘状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.houseStatus === 1 ? '上线中' : scope.row.houseStatus === 0 ? '已下架' : '-' }}
            </template>
          </el-table-column>
        </el-table>
        <el-button v-if="!loading" :disabled="selection.length===0" class="btn-submit" @click="handleSubmit">确定</el-button>
      </div>
      <div class="pages clearfix">
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
  name: 'projectAdd',
  data() {
    return {
      loading: false,
      page: {
        curPage: 1
      },
      filter: {
        name: '',
        houseStatus: '',
        saleStatusId: '',
      },
      selection: [], // 选中的数据
      getRowKeys(row) {
        return row.id
      }
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
    // 当某一行被点击时会触发该事件
    handleRowClick(row, event, column) {

    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    handleSelection(selection, row) {
      this.selection = this.selectionFilter(selection)
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelectionAll(selection) {
      this.selection = this.selectionFilter(selection)
    },
    // 过滤选中的楼盘
    selectionFilter(selection) {
      return selection.filter(item => {
        if (item.isInFgc !== 1) { return true }
        return false
      })
    },
    // 提交新增楼盘
    handleSubmit() {
      const houseList = this.selection.map(item => {
        return { id: item.id, name: item.name }
      })
      this.$store.dispatch('getProjectAdd', { houseList }).then((res) => {
        // 关闭当前页面并跳转到楼盘列表页
        this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
          this.$router.replace({ path: '/project/list' })
        })
      }).catch(() => {
      })
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
    .item {
      margin-right: 10px;
      margin-bottom: 5px;
      padding: 0 5px;
      color: #409eff;
      border: 1px solid #409eff;
      border-radius: 2px;
    }
  }
  .table-main {
    position: relative;
    .btn-submit {
      position: absolute;
      left: 0px;
      bottom: -58px;
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
