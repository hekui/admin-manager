<template>
  <div class="app-container paccount-page">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="公众号名称">
          <el-input v-model.trim="filter.name" :clearable="true" placeholder="请输入公众号名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.status" :clearable="true" placeholder="请选择">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否授权">
          <el-select v-model="filter.wechatStatus" :clearable="true" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-cascader
            v-model="filter.typeId"
            :options="paccountTypeDict"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="defalultDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="true"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="releaseTimeChange"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="submitFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-wrapper">
      <div class="table-top">
        <el-button type="primary" icon="el-icon-plus" @click="addHandle()">新增公众号监控</el-button>
      </div>
      <div class="table-main">
        <el-table
          :data="listData.list"
          v-loading="loading"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="公众号信息"
            min-width="180">
            <template slot-scope="scope">
              <div class="pavatar">
                <img v-if="scope.row.headImg" :src="scope.row.headImg" width="50" alt="公众号头像" >
                <img v-else src="./../../../public/images/wchat-ddefault.jpg" width="50" alt="公众号头像">
                <p class="name">{{scope.row.name}}</p>
                <p class="en-name">{{scope.row.wechatAccount}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="所在城市"
            prop="city"
            width="80">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="60">
            <template slot-scope="scope">
              {{ status[scope.row.status]  }}
            </template>
          </el-table-column>
          <el-table-column
            prop="wechatStatus"
            label="是否授权"
            width="120">
            <template slot-scope="scope">
              {{ wechatStatus[scope.row.wechatStatus]  }}
            </template>
          </el-table-column>
          
          <el-table-column
            prop="classify"
            label="分类"
            width="100">
            <template slot-scope="scope">
              {{ pclassify[scope.row.classify] || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="类型"
            width="120">
            <template slot-scope="scope">
              {{ scope.row.typeName || "-"}} 
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="添加时间"
            width="140">
            <template slot-scope="scope">
              {{ scope.row.createTime | formatDate('YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="lastRecordTime"
            label="最后收录时间"
            width="140">
            <template slot-scope="scope">
              {{ scope.row.lastRecordTime | formatDate('YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="articleNum"
            label="收录文章数量"
            width="110">
            <template slot-scope="scope">
              {{ scope.row.articleNum || "-"}} 
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
            fixed="right"
            label="操作"
            width="170">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
              <el-button type="text" @click="addHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="syncHandle(scope.$index, listData.list, scope.row)">同步数据</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages clearfix">
        <span class="demonstration">合计统计公众号<b class="number"> {{listData.totalRecords || 0}}</b> 个。</span>
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
        wechatStatus: '',
        status: '',
        typeId: [],
        beginDate: '',
        endDate: ''
      },
      defalultDate: ''
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
      this.$store.commit('paccountSet', {
        target: 'editId',
        data: id
      })
      if (id) {
        this.$router.push({
          path: '/paccount/edit',
          query: {
            id
          }
        })
      } else {
        this.$router.push({
          path: '/paccount/add'
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
    }
  }
}
</script>
<style lang="scss">
.paccount-page{
  .pavatar{
    img{
      float: left; margin-right: 10px;
    }
    p{
      margin: 0 auto;
    }
    .name{
      font-size: 16px; font-weight: bold;
    }
    .en-name{
      font-size: 12px;
    }
  }
  .table-top{
    display: flex;
    justify-content: space-between;
    .tips{
      margin-top: 10px;
    }
  }
}
</style>
