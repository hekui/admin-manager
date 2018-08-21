<template>
  <div class="app-container paccount-edit-page">
    <div class="edit-paccount" v-if="id">
      <div class="gzh-top clearfix">
        <div class="pavatar">
          <img :src="infoData.headImg" width="50" alt="">
          <p class="name">{{ infoData.name }}</p>
          <p class="en-name">{{ infoData.wechatAccount }}</p>
        </div>
        <div class="status-choice">
          <span class="text">状态：</span>
          <el-radio-group v-model="status">
            <el-radio :label="1" @change="changState">启用</el-radio>
            <el-radio :label="2" @change="changState">禁用</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="form-filter">
        <el-form ref="filter" :inline="true" :model="filter">
          <el-form-item label="文章标题">
            <el-input v-model="filter.title" :clearable="true" placeholder="请输入名称"></el-input>
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
          <el-button icon="el-icon-refresh" type="primary" @click="changeRefresh" class="refresh-button">手动更新</el-button>
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
              width="60">
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
                {{ scope.row.readNum || "-"}} 
              </template>
            </el-table-column>
            <el-table-column
              prop="likeNum"
              label="点赞量"
              width="80">
                <template slot-scope="scope">
                {{ scope.row.likeNum || "-"}} 
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
              width="200">
              <template slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
                <el-button type="text" @click="showEdit(scope.row.id)">二次编辑</el-button>
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
    <div class="add-paccount" v-else>
      <el-form ref="editInfo" :model="editInfo" :rules="rules" label-width="80px" v-if="wxid" >
        <el-form-item label="微信号" prop="wechatAccount">
          <el-input v-model="editInfo.wechatAccount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editInfo.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否授权">
          <el-radio-group v-model="editInfo.wechatStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属分类" prop="classify">
          <el-select v-model="editInfo.classify" placeholder="请选择">
            <el-option
              v-for="(value, key, index) in pclassify"
              :key="index"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型">
          <el-cascader placeholder="请选择所属类型"
            v-model="editInfo.typeId"
            :options="paccountTypeDict"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item v-if="editInfo.wechatAccount">
          <el-button type="primary" @click="onSubmit('editInfo')">立即添加</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-else>
        <el-form-item label="微信号" prop="wechatAccount">
          <el-input v-model="form.wechatAccount" placeholder="请输入微信号，注意大小写" :clearable="true" ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否授权">
          <el-radio-group v-model="form.wechatStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属分类" prop="classify">
          <el-cascader placeholder="请选择所属分类"
            v-model="form.classify"
            :options="pclassifyTypeDict"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="所属类型">
          <el-cascader placeholder="请选择所属类型"
            v-model="form.typeId"
            :options="paccountTypeDict"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">立即添加</el-button>
        </el-form-item>
      </el-form>
         
      
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default{
  name: 'paccountEdit',
  data() {
    return {
      id: '',
      wxid: '',
      status: '',
      changeStatus: '',
      loading: false,
      page: {
        curPage: 1,
        pageSize: 20
      },
      filter: {
        typeId: [],
        title: '',
        endDate: '',
        beginDate: '',
        id: ''
      },
      defaultDate: '',
      form: {
        wechatAccount: '',
        wechatStatus: 1,
        classify: [],
        typeId: [],
        status: 1
      },
      typeDictList: [], // 编辑的时候获取状态 this.formatTypeId
      editInfo: {
        id: '',
        wechatAccount: '',
        wechatStatus: '',
        classify: [],
        typeId: [],
        status: '',
      },
      rules: {
        wechatAccount: [
          { required: true, message: '请输入微信号，注意大小写', trigger: 'blur' }
        ],
        classify: [
          { required: true, message: '请选择公众号类型', trigger: 'change' }
        ],
      }
    }
  },
  computed: {
    ...mapGetters(['paccountTypeDict', 'pclassifyTypeDict']),
    ...mapState({
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
    this.id = this.$route.query.id
    this.wxid = this.$route.query.wxid
    this.fetchDict()
    if (this.id) { // 查看和编辑分开接口调用
      this.fetchData()
    }
  },
  methods: {
    fetchDict() {
      // 获取公众号类型列表
      this.$store.dispatch('getTypeDict', {
        cityId: this.cityId,
        code: 1
      })
      // 查询公众号基本信息
      if (this.id || this.wxid) {
        this.$store.dispatch('getPaccountInfo', {
          id: this.id ? this.id : this.wxid
        }).then((res) => {
          this.status = res.data.status
          this.changeStatus = res.data.status
          const typeid = res.data.typeDictList
          if (typeid) {
            this.formatTypeId(typeid)
          }
          this.editInfo = {
            id: res.data.id,
            wechatAccount: res.data.wechatAccount,
            wechatStatus: res.data.wechatStatus,
            classify: '' + res.data.classify,
            typeId: this.typeDictList,
            status: res.data.status
          }
        })
      }
    },
    releaseTimeChange(value) {
      const date = value || ['', '']
      this.filter.beginDate = date[0]
      this.filter.endDate = date[1]
    },
    fetchData() {
      // 公众号详情-分页
      const params = {
        id: this.id,
        typeId: this.filter.typeId ? this.filter.typeId.pop() : ''
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
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.wxid) {
            const params = { typeId: this.editInfo.typeId[this.editInfo.typeId.length - 1] }
            this.loading = true
            this.$store.dispatch('editPaccountInfo', Object.assign({}, this.editInfo, params)).then(() => {
              this.loading = false
              this.$alert('<strong>编辑成功</strong><p>如果N天后无数据更新，请联系技术查看</p>', {
                type: 'success',
                dangerouslyUseHTMLString: true,
                showClose: false,
                confirmButtonText: '知道了'
              }).then(() => {
                this.$router.replace({ path: '/paccount/list' })
              })
            }).catch(() => {
              this.loading = false
              this.$alert('<strong>编辑失败</strong><p>请稍后重试，或者联系技术解决</p>', {
                type: 'error',
                dangerouslyUseHTMLString: true,
                showClose: false,
                confirmButtonText: '知道了'
              })
            })
          } else {
            const params = {
              classify: this.form.classify[this.form.classify.length - 1],
              typeId: this.form.typeId[this.form.typeId.length - 1]
            }
            this.loading = true
            this.$store.dispatch('addPaccountInfo', Object.assign({}, this.form, params)).then(() => {
              this.loading = false
              this.$alert('<strong>添加成功</strong><p>如果N天后无数据更新，请联系技术查看</p>', {
                type: 'success',
                dangerouslyUseHTMLString: true,
                showClose: false,
                confirmButtonText: '知道了'
              }).then(() => {
                this.$router.replace({ path: '/paccount/list' })
              })
            }).catch(() => {
              this.loading = false
              this.$alert('<strong>添加失败</strong><p>请稍后重试，或者联系技术解决</p>', {
                type: 'error',
                dangerouslyUseHTMLString: true,
                showClose: false,
                confirmButtonText: '知道了'
              })
            })
          }
        } else {
          return false
        }
      })
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
          this.changeStatus = type
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '切换失败，请稍后重试'
          })
          this.status = this.changeStatus
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '切换失败，请稍后重试'
        })
        this.status = this.changeStatus
      })
    },
    changePage(curPage) {
      this.page.curPage = curPage
      this.fetchData()
    },
    changeRefresh() {
      this.page.curPage = 1
      this.fetchData()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '切换失败，请稍后重试'
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

