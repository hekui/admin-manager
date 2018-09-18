<template>
  <div class="app-container project-add">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="楼盘名称：">
          <el-input v-model.trim="filter.name" :clearable="true" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>

        <el-form-item label="楼盘状态：">
          <el-select v-model="filter.housesStatus" :clearable="true" placeholder="请选择">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态：">
          <el-select v-model="filter.salesStatus" :clearable="true" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-wrapper">
      <div class="table-top" v-if="multipleSelection.length" >
        当前已选：<span v-for="(item, index) in multipleSelection" :key="index" :data-id="item.id">{{ item.name }}</span>
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
          @select-all="handleSelectionAll"
          @select="handleSelection">
          <el-table-column
            :reserve-selection="true"
            :selectable='checkSelectable' 
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="楼盘名称"
            width="300">
            <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
          </el-table-column>
          <el-table-column
            prop="regionName"
            label="区域"
            width="220">
          </el-table-column>
          <el-table-column
            prop="saleStatusName"
            label="销售状态"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="houseStatus"
            label="楼盘状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.houseStatus === 1 ? '上线中' : '已下架'}}</template>
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
import { mapState, mapGetters } from 'vuex'
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
        housesStatus: '',
        salesStatus: '',
      },
      input: 0,
      value: true,
      multipleSelection: [],
      selectArr: [],
      getRowKeys(row) {
        return row.id
      },
      questions: [], // 分页时从后台获取的本页面数据  // 当前页选中的项
      allSelecteds: [],
    }
  },
  computed: {
    ...mapGetters(['paccountTypeDict']),
    ...mapState({
      cityId: state => state.cityId,
      options: state => state.paccountTypeDict,
      status: state => state.status,
      wechatStatus: state => state.wechatStatus,
      pclassify: state => state.pclassify,
      pickerOptions: state => state.pickerOptions,
      syncStatus: state => state.paccount.syncStatus,
      listData: state => state.paccount.listData
    })
  },
  created() {
    this.fetchData()
    this.getTypeDict()
    // console.log('this', this)
  },
  activated() {
    this.fetchData()
    this.getTypeDict()
  },
  methods: {
    fetchData() {
      console.log('this.filter,', this.filter)
      const params = {
        typeId: Array.isArray(this.filter.typeId) ? [...this.filter.typeId].pop() : ''
      }
      console.log('-----', params)
      this.loading = true
      this.$store.dispatch('getPaccountList', Object.assign({}, this.filter, params, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    checkSelectable(row, index) {
      console.log(row, index)
      if (row.id === '1037528614322569216') {
        return false
      } else {
        return true
      }
      // return row.isInFgc !== 0
    },
    getTypeDict() {
      // 获取公众号类型列表
      this.$store.dispatch('getTypeDict', {
        cityId: this.cityId,
        code: 1
      })
    },
    releaseTimeChange(value) {
      const date = value || ['', '']
      this.filter.beginDate = date[0]
      this.filter.endDate = date[1]
    },
    submitFilter() {
      this.page.curPage = 1
      this.fetchData()
    },
    changePage(curPage) {
      this.page.curPage = curPage
      this.fetchData()
    },
    checkScore(row) {
      return row.id
    },
    handleSelection(selection, row) {
      if (this.checkScore(row)) {
        this.select(selection, row)
      } else {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
      return false
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelectionAll(selection) {
      for (let i = selection.length - 1; i >= 0; i--) {
        if (!this.checkScore(selection[i])) {
          this.$refs.multipleTable.clearSelection()
        }
      }
      this.select(selection)
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
</style>
