<template>
  <div class="app-container project-page">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="楼盘名称：">
          <el-input v-model.trim="filter.name" :clearable="true" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>
        <el-form-item label="区域：">
          <el-select v-model="filter.regionId" :clearable="true" placeholder="请选择">
            <el-option v-for="item in region" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
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
        <el-form-item label="设置匹配词：">
          <el-select v-model="filter.hasMatchWord" :clearable="true" placeholder="请选择">
            <el-option label="没有" value="0"></el-option>
            <el-option label="有" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-wrapper">
      <div class="table-top">
        <el-button type="primary" icon="el-icon-plus" @click="addHandle()">新增楼盘</el-button>
        <div class="el-upload__tip">注意：楼盘新增和编辑，请前往买房吗后台进行操作。本处项目排序可以手动变更，数字越大越靠前</div>
      </div>
      <div class="table-main">
        <el-table
          :data="listData.list"
          v-loading="loading"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="50"
            :index="getIndex">
          </el-table-column>
          <el-table-column
            prop="name"
            label="楼盘名称"
            min-width="100">
          </el-table-column>
          <el-table-column
            label="排序"
            width="90">
            <template slot-scope="scope">
              <el-input 
                v-model="scope.row.sort"
                type="number"
                @blur="sequenceBlur($event, scope)"
                @keyup.enter.native="sequenceConfirm($event, scope)"
                @keyup.esc.native="sequenceCancel($event, scope)">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="region"
            label="区域"
            width="160">
          </el-table-column>
          <el-table-column
            label="销售状态"
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.saleStatus || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="楼盘状态"
            width="100">
            <template slot-scope="scope">
              <span>{{scope.row.houseStatus === 1 ? '上线中' : scope.row.houseStatus === 0 ? '已下架' : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="热门楼盘"
            width="80">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isHotSale" :active-value="1" :inactive-value="0" @change="handleHotHouse(scope)"></el-switch> 
            </template>
          </el-table-column>
          <el-table-column
            label="预售信息数"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.presellCount || 0}} 
            </template>
          </el-table-column>
          <el-table-column
            prop="hasMatchWord"
            label="是否设置匹配词"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.hasMatchWord === 1 ? '有' : scope.row.hasMatchWord === 0 ? '没有' : "-"}} 
            </template>
          </el-table-column>
          <el-table-column
            label="同步状态"
            width="80">
            <template slot-scope="scope">
              {{ scope.row.syncStatus || "-"}} 
            </template>
          </el-table-column>
          <el-table-column
            label="关联文章数"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.contentCount || 0}} 
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="addHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="syncHandle(scope.row)">同步数据</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages clearfix">
        <span class="demonstration">合计统计楼盘<b class="number"> {{listData.totalRecords || 0}}</b> 个。</span>
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
        curPage: 1
      },
      filter: {
        name: '',
        regionId: '',
        houseStatus: '',
        saleStatusId: '',
        hasMatchWord: '',
      },
      originalSort: []
    }
  },
  computed: {
    ...mapState({
      region: state => state.region,
      salestatus: state => state.salestatus,
      listData: state => state.project.listData
    })
  },
  created() {
    this.getRegion() // 获取区域数据
    this.getSaleStatus() // 获取销售状态数据
    this.fetchData()
  },
  methods: {
    getRegion() {
      this.$store.dispatch('getRegion')
    },
    getSaleStatus() {
      this.$store.dispatch('getSaleStatus')
    },
    fetchData() {
      this.loading = true
      this.$store.dispatch('getProjectList', Object.assign({}, this.filter, this.page)).then((res) => {
        this.loading = false
        this.originalSort = res.data.list.map(item => item.sort)
      }).catch(() => {
        this.loading = false
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
    addHandle(id) {
      if (id) {
        this.$router.push({
          path: '/project/edit',
          query: {
            id
          }
        })
      } else {
        this.$router.push({
          path: '/project/add'
        })
      }
    },
    // 同步数据
    syncHandle(row) {
      this.$store.dispatch('matchHouseContent', {
        id: row.id
      }).then(() => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: '同步成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '同步失败，请稍后重试'
        })
      })
    },
    showDetail(id) {
      this.$store.commit('paccountSet', {
        target: 'detailId',
        data: id
      })
      this.$router.push({
        path: '/paccount/detail',
        query: {
          id
        }
      })
    }, // 获取序号
    getIndex(index) {
      return (this.page.curPage - 1) * this.listData.pageSize + index + 1
    },
    // 失去焦点
    sequenceBlur(event, scope) {
      this.$store.commit('houseSort', { index: scope.$index, sort: this.originalSort[scope.$index] })
      this.$message({
        type: 'info',
        message: '已取消修改!'
      })
    },
    // 回车确认修改排序
    sequenceConfirm(event, scope) {
      const sort = scope.row.sort
      if (sort < 0) {
        this.$message({
          type: 'error',
          message: '序号不能为负数'
        })
        return
      }
      this.$store.dispatch('updateHouseSort', { id: scope.row.id, sort }).then((res) => {
        event.target.blur()
        this.fetchData()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      })
    },
    // ESC取消修改
    sequenceCancel(event, scope) {
      event.target.blur()
    },
    // 更新楼盘热门状态
    handleHotHouse(scope) {
      const isHotSale = scope.row.isHotSale
      this.$store.dispatch('updateHouseHotstatus', { id: scope.row.id, isHotSale })
        .then((res) => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
        .catch(() => {
        // 取消操作，回退数据
          isHotSale === 1 ? 0 : 1
          this.$store.commit('SET_HOT_HOUSE', { index: scope.$index, isHotSale })
          this.$message({
            type: 'info',
            message: '操作已取消！'
          })
        })
    },
  }
}
</script>
<style lang="scss">
.project-page{
  .table-top {
    display: flex;
    align-items: center;
    .el-upload__tip {
      margin-left: 10px;
      color: red;
    }
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type='number']{
    -moz-appearance: textfield;
}
</style>