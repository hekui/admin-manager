<template>
  <div class="app-container paccount-edit-page">
    <div class="edit-paccount" v-if="id">
      <div class="gzh-top clearfix">
        <div class="pavatar">
          <img src="/static/images/flogo.jpg" width="50" alt="">
          <p class="name">公众号名称</p>
          <p class="en-name">fangguancha</p>
        </div>
        <div class="status-choice">
          <span class="text">状态：</span>
          <el-radio label="0" v-model="status" @change="open">启用</el-radio>
          <el-radio label="1" v-model="status" @change="open">锁定</el-radio>
          <el-radio label="2" v-model="status" @change="open">停用</el-radio>

          <!-- <el-radio-group v-model="changStatus" @change="open">
            
          </el-radio-group> -->
        </div>
      </div>
      <div class="form-filter">
        <el-form ref="form" :inline="true" :model="filter">
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="filter.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="文章标题">
            <el-input v-model="filter.article" :clearable="true" placeholder="请输入名称/ID"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-cascader
              v-model="filter.category"
              :options="options"
              :clearable="true"
              change-on-select
            ></el-cascader>
          </el-form-item>
          
          <el-form-item>
            <el-button icon="el-icon-search" @click="submitFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-wrapper">
        <div class="table-top">
          <div class="tips gray">最后收录时间：<span class="date">2018-12-17 23:12</span></div>
          <el-button icon="el-icon-refresh" type="primary" @click="changeRefresh">手动更新</el-button>
        </div>
        <div class="table-main">
          <el-table
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
              prop="aname"
              label="文章标题"
              min-width="300">
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
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="readNumber"
              label="阅读量"
              width="180">
            </el-table-column>
            <el-table-column
              prop="praise"
              label="点赞量"
              width="180">
            </el-table-column>
            <el-table-column
              prop="count"
              label="字数"
              width="180">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
                <el-button type="text" @click="showEdit(scope.row.id)">二次编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pages">
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changePage"
            :current-page="page.pageNo"
            :page-size="articleData.pageSize"
            :total="articleData.totalRecords">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="add-paccount" v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="微信号" prop="name">
          <el-input v-model="form.name" placeholder="请输入微信号，注意大小写"  :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="radio">
          <el-radio-group v-model="form.radio">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">锁定</el-radio>
            <el-radio label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属分类" prop="ptype">
          <el-select v-model="form.ptype" placeholder="请选择公众号类型">
            <el-option
              v-for="item in ptype"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型" prop="category">
          <el-cascader placeholder="请选择所属类型"
            v-model="form.category"
            :options="options"
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
import { mapState } from 'vuex'
export default{
  name: 'paccountEdit',
  data() {
    return {
      id: '',
      status: '0',
      changeStatus: '0',
      loading: false,
      page: {
        pageNo: 1,
        pageSize: 10
      },
      filter: {
        article: '',
        category: [],
        date: ''
      },
      form: {
        name: '',
        radio: '0',
        ptype: '',
        category: []
      },
      rules: {
        name: [
          { required: true, message: '请输入微信号，注意大小写', trigger: 'blur' }
        ],
        radio: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        ptype: [
          { required: true, message: '请选择公众号类型', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请选择所属类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      options: state => state.options,
      pstatus: state => state.pstatus,
      ptype: state => state.ptype,
      articleData: state => state.paccount.articleData
    })
  },
  created() {
    this.id = this.$route.query.id
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('this.filter', this.filter)
      this.loading = true
      this.$store.dispatch('getArticleList', Object.assign({}, this.filter, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    submitFilter() {
      console.log('this.filter', this.filter)
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('ok', this.form)
          // this.$alert('<strong>添加成功</strong><p>如果N天后无数据更新，请联系技术查看</p>', {
          //   type: 'success',
          //   dangerouslyUseHTMLString: true,
          //   confirmButtonText: '知道了'
          // })

          this.$alert('<strong>添加失败</strong><p>请稍后重试，或者联系技术解决</p>', {
            type: 'error',
            dangerouslyUseHTMLString: true,
            confirmButtonText: '知道了'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    open() {
      const type = this.status
      this.$confirm('你确定切换状态吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
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
    },
    changePage(curPage) {
      this.page.pageNo = curPage
      this.fetchData()
    },
    changeRefresh() {
      console.log('手动更新')
    },
    showDetail(id) {
      console.log('id', id)
      this.$router.push({
        path: '/content/detail',
        query: {
          id
        }
      })
    },
    showEdit(id) {
      console.log('id', id)
      this.$router.push({
        path: '/content/edit',
        query: {
          id
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
      display: flex;
      justify-content: space-between;
      .date{
        color: #333;
      }
    }
  }
  .add-paccount{
    width: 480px;
    margin-left: 200px;
    .el-form{
      padding-top: 20px;
    }
  }
}

</style>

