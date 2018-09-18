<template>
  <div class="app-container project-page">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="楼盘名称：">
          <el-input v-model.trim="filter.name" :clearable="true" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>
        <el-form-item label="区域：">
          <el-cascader
            v-model="filter.typeId"
            :options="paccountTypeDict"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="楼盘状态：">
          <el-select v-model="filter.houseStatus" :clearable="true" placeholder="请选择">
            <el-option label="上线中" value="1"></el-option>
            <el-option label="已下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态：">
          <el-select v-model="filter.saleStatus" :clearable="true" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
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
            prop="city"
            width="120">
            <template slot-scope="scope">
              <el-input 
                v-model="scope.row.status"
                type="number"
                @blur="sequenceBlur($event, scope)"
                @keyup.enter.native="sequenceConfirm($event, scope)"
                @keyup.esc.native="sequenceCancel($event, scope)">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="区域"
            width="160">
            <template slot-scope="scope">
             高新区
            </template>
          </el-table-column>
          <el-table-column
            prop="wechatStatus"
            label="销售状态"
            width="120">
            <template slot-scope="scope">
             在售
            </template>
          </el-table-column>
          
          <el-table-column
            prop="classify"
            label="楼盘状态"
            width="100">
            <template slot-scope="scope">
              上架中
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="热门楼盘"
            width="120">
            <template slot-scope="scope">
              <el-switch class="mini_switch" v-model="scope.row.wechatStatus" @change="onChange(scope.$index,listData.list, scope.row.id, scope.row.isHotHouse)" active-value="true" inactive-value="false"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="预售信息数"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.typeName || "-"}} 
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="是否设置匹配词"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.typeName || "-"}} 
            </template>
          </el-table-column>
          <el-table-column
            prop="dataStatus"
            label="同步状态"
            width="110">
            <template slot-scope="scope">
              {{ syncStatus[scope.row.dataStatus] || "-"}} 
            </template>
          </el-table-column>
          <el-table-column
            prop="articleNum"
            label="关联文章数"
            >
            <template slot-scope="scope">
              {{ scope.row.articleNum || "-"}} 
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="170">
            <template slot-scope="scope">
              <el-button type="text" @click="addHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="syncHandle(scope.$index, listData.list, scope.row)">同步数据</el-button>
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
        region: '',
        houseStatus: '',
        saleStatus: '',
        hasMatchWord: '',
      }
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
      listData: state => state.project.listData
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
      console.log('this.filter', this.filter)
      const params = {
        typeId: Array.isArray(this.filter.typeId) ? [...this.filter.typeId].pop() : ''
      }
      console.log('-----', params)

      this.loading = true
      this.$store.dispatch('getProjectList', Object.assign({}, this.filter, params, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
    // 同步数据后需要刷新详情页的数据
    refreshDetailData(id) {
      this.fetchData()
      // 查询公众号基本信息
      this.$store.dispatch('getPaccountInfo', { id })
    },
    syncHandle(index, data, row) {
      // 同步公众号数据
      this.$store.dispatch('syncPaccount', {
        wechatAccount: row.wechatAccount
      }).then(() => {
        this.$message({
          type: 'success',
          message: '同步成功'
        })
        this.refreshDetailData(row.id)
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
      // this.$store.commit('sequenceNum', { index: scope.$index, sequenceNum: this.originalSequence[scope.$index] })
      this.$message({
        type: 'info',
        message: '已取消修改!'
      })
    },
    // 回车确认修改排序
    sequenceConfirm(event, scope) {
      const sequenceNum = scope.row.sequenceNum
      if (sequenceNum < 0) {
        this.$message({
          type: 'error',
          message: '序号不能为负数'
        })
        return
      }
      console.log('scope', scope)
      // this.$store.dispatch('updateSequenceNum', { id: scope.row.id, sequenceNum: sequenceNum }).then((res) => {
      //   event.target.blur()
      //   this.fetchData()
      //   this.$message({
      //     type: 'success',
      //     message: '修改成功!'
      //   })
      // })
    },
    // ESC取消修改
    sequenceCancel(event, scope) {
      event.target.blur()
    },
    onChange(index, data, id, isHot) {
      const isHotSale = isHot === 1 ? 1 : 0
      // const params = {
      //   id,
      //   isHotSale
      // }
      console.log(data[index])
      data[index].isHotHouse = isHotSale

      // this.$confirm('你确定切换开关么？', '提示', {
      //   type: 'warning',
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(() => {
      //   data[index].status = status
      //   this.$store.dispatch('updateArticleStatus', params).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '成功切换'
      //     })
      //     data[index].status = status
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '切换失败，请稍后重试'
      //     })
      //   })
      // })
    },
  }
}
</script>
<style lang="scss">
.project-page{
  .table-top{
    display: flex;
    justify-content: space-between;
    .tips{
      margin-top: 10px;
    }
  }
}
</style>
