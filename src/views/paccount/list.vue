<template>
  <div class="app-container paccount-page">
    <div class="form-filter">
      <el-form ref="form" :inline="true" :model="filter">
        <el-form-item label="公众号名称">
          <el-input v-model="filter.name" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.status" :clearable="true" placeholder="活动状态">
            <el-option label="启用" value="0"></el-option>
            <el-option label="锁定" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-cascader
            v-model="filter.category"
            :options="options"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="filter.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="true"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="submitFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-wrapper">
      <div class="table-top">
        <el-button type="primary" icon="el-icon-plus" @click="addHandle">新增公众号监控</el-button>
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
                <img src="/static/images/flogo.jpg" width="50" alt="">
                <p class="name">{{scope.row.pname}}</p>
                <p class="en-name">{{scope.row.penName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="cityName"
            label="所在城市"
            width="120">
          </el-table-column>
          <el-table-column
            prop="province"
            label="状态"
            width="120">
            <template slot-scope="scope">
              {{pstatus[scope.row.status]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="分类"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="add-date"
            label="添加时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="last-date"
            label="最后收录时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="count"
            label="收录文章数量"
            width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages clearfix">
        <span class="demonstration">合计统计公众号<b class="number">{{listData.totalRecords || '-'}}</b> 个。</span>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="changePage"
          :current-page="page.pageNo"
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
        pageNo: 1,
        pageSize: 20
      },
      filter: {
        name: '',
        category: [],
        date: ''
      },
      pickerOptions: { // 日期快捷选项
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    ...mapState({
      options: state => state.options,
      pstatus: state => state.pstatus,
      listData: state => state.paccount.listData
    })
  },
  created() {
    this.fetchData()
    console.log('this', this)
  },
  methods: {
    fetchData() {
      console.log('this.filter', this.filter)
      this.loading = true
      this.$store.dispatch('getPaccountList', Object.assign({}, this.filter, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    submitFilter() {
      this.page.pageNo = 1
      this.fetchData()
    },
    changePage(curPage) {
      this.page.pageNo = curPage
      this.fetchData()
    },
    addHandle() {
      this.$router.push({
        path: '/paccount/add'
      })
    },
    showDetail(id) {
      console.log('id', id)
      this.$router.push({
        path: '/paccount/edit',
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
