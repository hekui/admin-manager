<template>
  <div class="app-container paccount-edit-page">
    <div class="edit-paccount">
      <div class="gzh-top clearfix">
        <div class="pavatar">
          <img v-if="infoData.headImg" :src="infoData.headImg" width="50" alt="公众号头像" >
          <img v-else src="./../../../public/images/wchat-ddefault.jpg" width="50" alt="公众号头像">
          <p class="name">{{ infoData.name }}</p>
          <p class="en-name">{{ infoData.wechatAccount }}</p>
        </div>
        <div class="status-choice">
          <span class="text">状态：</span>
          <el-radio-group v-model="infoData.status">
            <el-radio :label="1" @change="changState">启用</el-radio>
            <el-radio :label="2" @change="changState">停用</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="form-filter">
        <el-form ref="filter" :inline="true" :model="filter">
          <el-form-item label="文章标题">
            <el-input v-model.trim="filter.title" :clearable="true" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="文章类型">
            <el-cascader
              v-model="filter.typeId"
              :options="paccountTypeDict"
              :clearable="true"
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="defaultDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="true"
              value-format="yyyy-MM-dd HH:mm"
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
          <el-button icon="el-icon-refresh" type="primary" @click="syncHandle" class="refresh-button">手动更新</el-button>
          <p class="tips">最后收录时间：<span class="date">{{ infoData.lastRecordTime | formatDate('YYYY-MM-DD HH:mm') }}</span></p>
        </div>
        <div class="table-main">
          <el-table v-if="articleData.list"
            :data="articleData.list"
            v-loading="loading"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60"
              :index="getIndex">
            </el-table-column>
            <el-table-column
              prop="title"
              label="文章标题"
              min-width="300">
            </el-table-column>
            <el-table-column
              prop="city"
              label="所在城市"
              width="80">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="60">
              <template slot-scope="scope">
                {{ detailsStatus[scope.row.status]  }}
              </template>
            </el-table-column>
            <el-table-column
              prop="releaseTime"
              label="发布时间"
              width="140">
              <template slot-scope="scope">
                {{ scope.row.releaseTime | formatDate('YYYY-MM-DD HH:mm')  }}
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
              prop="readNum"
              label="阅读量"
              width="80">
              <template slot-scope="scope">
                {{ scope.row.readNum || 0}} 
              </template>
            </el-table-column>
            <el-table-column
              prop="likeNum"
              label="点赞量"
              width="80">
                <template slot-scope="scope">
                {{ scope.row.likeNum || 0}} 
              </template>
            </el-table-column>
            <el-table-column
              prop="wordsNum"
              label="字数"
              width="80">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
                <!-- <el-button type="text" @click="showEdit(scope.row.id)">二次编辑</el-button> -->
                <el-button type="text" @click="updateArticle(scope.$index,articleData.list, scope.row.id, scope.row.status)"> {{ scope.row.status === 1 ? '停用' : '启用' }} </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pages clearfix">
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changePage"
            :current-page="page.curPage"
            :page-size="articleData.pageSize"
            :total="articleData.totalRecords">
          </el-pagination>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default{
  name: 'paccountDetail',
  data() {
    return {
      id: '',
      loading: false,
      page: {
        curPage: 1
      },
      filter: {
        typeId: [],
        title: '',
        endDate: '',
        beginDate: '',
        id: ''
      },
      defaultDate: '',
      typeDictList: [], // 编辑的时候获取状态 this.formatTypeId
      wechatAccount: '', // 公从号
    }
  },
  computed: {
    ...mapGetters(['paccountTypeDict', 'pclassifyTypeDict']),
    ...mapState({
      detailId: state => state.paccount.detailId,
      cityId: state => state.cityId,
      pclassify: state => state.pclassify,
      options: state => state.paccountTypeDict,
      pickerOptions: state => state.pickerOptions,
      infoData: state => state.paccount.infoData,
      detailsStatus: state => state.paccount.detailsStatus,
      articleData: state => state.paccount.articleData
    })
  },
  created() {
    console.log('created')
    // this.id = this.$route.query.id
    // this.wxid = this.$route.query.wxid
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.fetchDict()
    this.fetchData()
  },
  watch: {
    detailId: function(newVal) {
      this.id = newVal
      this.fetchDict()
      this.fetchData()
    },
  },
  methods: {
    fetchDict() {
      // 获取文章类型列表
      this.$store.dispatch('getTypeDict', {
        cityId: this.cityId,
        code: 3
      })
      // 查询公众号基本信息
      this.$store.dispatch('getPaccountInfo', {
        id: this.id
      }).then((res) => {
        this.wechatAccount = res.data.wechatAccount
        const typeid = res.data.typeDictList
        if (typeid) {
          this.formatTypeId(typeid)
        }
      })
    },
    // 获取序号
    getIndex(index) {
      return (this.page.curPage - 1) * this.articleData.pageSize + index + 1
    },
    releaseTimeChange(value) {
      const date = value || ['', '']
      if (date[0]) this.filter.beginDate = date[0].split(' ')[0] + ' 00:00:00'
      else this.filter.beginDate = date[0]
      if (date[1]) this.filter.endDate = date[1].split(' ')[0] + ' 23:59:59'
      else this.filter.endDate = date[1]
    },
    fetchData() {
      // 公众号详情-分页
      const params = {
        id: this.id,
        typeId: Array.isArray(this.filter.typeId) ? [...this.filter.typeId].pop() : ''
      }
      console.log('this.filter', this.filter)
      this.loading = true
      this.$store.dispatch('getArticleList', Object.assign({}, this.filter, params, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    submitFilter() {
      this.page.curPage = 1
      this.fetchData()
    },
    changState() {
      const type = this.status
      const params = {
        id: this.id,
        status: type
      }
      this.$confirm('你确定切换状态吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$store.dispatch('updatestatusStateInfo', params).then(() => {
          this.$message({
            type: 'success',
            message: '成功切换'
          })
          this.fetchDict()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '切换失败，请稍后重试'
          })
          this.fetchDict()
        })
      }).catch(() => {
        this.fetchDict()
      })
    },
    changePage(curPage) {
      this.page.curPage = curPage
      this.fetchData()
    },
    syncHandle() {
      // 同步公众号数据
      this.$store.dispatch('syncPaccount', {
        wechatAccount: this.wechatAccount
      }).then(() => {
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
    updateArticle(index, data, id, s) {
      const status = s === 1 ? 2 : 1
      const params = {
        id,
        status
      }
      this.$confirm('你确定切换状态吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$store.dispatch('updateArticleStatus', params).then(() => {
          this.$message({
            type: 'success',
            message: '成功切换'
          })
          data[index].status = status
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '切换失败，请稍后重试'
          })
        })
      })
    },
    showDetail(id) {
      this.$router.push({
        path: '/content/detail',
        query: {
          id
        }
      })
    },
    showEdit(id) {
      this.$router.push({
        path: '/content/edit',
        query: {
          id
        }
      })
    },
    formatTypeId(data) {
      data.map((item) => {
        this.typeDictList.push(item.id)
        if (item.childList) {
          this.formatTypeId(item.childList)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.paccount-edit-page{
  .edit-paccount{
    .gzh-top{
      background-color: #f2f2f2;
      padding: 10px 6px;
      .pavatar{
        width: 50%;
        float: left;
        img{
          float: left; margin-right: 10px;
        }
        p{
          margin: 0 auto;
        }
        .name{
          font-size: 16px; font-weight: bold;
          padding-top: 8px;
        }
        .en-name{
          font-size: 12px;
          padding-top: 4px;
          color: #999;
        }
      }
      .status-choice{
        width: 50%;
        float: left;
        line-height: 50px;
        .text{
          padding-right: 10px;
          color: #000;
        }
      }
    }
    .form-filter{
      padding-top: 18px;
    }
    .table-top{
      // display: flex;
      // justify-content: space-between;
      .refresh-button{
        margin-right: 10px;
      }
      .tips{
        display: inline-table
      }
      .date{
        color: #333;
      }
      
    }
  }
  .add-paccount{
    width: 480px;
    // margin-left: 200px;
    .el-form{
      padding-top: 20px;
    }
  }
}

</style>

