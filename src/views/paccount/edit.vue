<template>
  <div class="app-container paccount-edit-page">
    <div class="add-paccount">
      <el-form ref="editInfo" :model="editInfo" :rules="rules" label-width="80px" v-if="id" >
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
      editId: state => state.paccount.editId,
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
  },
  watch: {
    editId: function(newVal) {
      this.id = newVal
      this.fetchDict()
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
      this.$store.dispatch('getPaccountInfo', {
        id: this.id
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
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) {
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
                this.closeSelectedTag()
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
            this.$store.dispatch('addPaccountInfo', Object.assign({}, this.form, params)).then((res) => {
              this.loading = false
              if (res.code !== 0) {
                this.loading = false
              } else {
                this.$alert('<strong>添加成功</strong><p>如果N天后无数据更新，请联系技术查看</p>', {
                  type: 'success',
                  dangerouslyUseHTMLString: true,
                  showClose: false,
                  confirmButtonText: '知道了'
                }).then(() => {
                  this.closeSelectedTag()
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    changePage(curPage) {
      this.page.curPage = curPage
      this.fetchData()
    },
    // changeRefresh() { 刷新
    //   this.page.curPage = 1
    //   this.fetchData()
    // },
    getIndex(index) { // 获取序号
      return (this.page.curPage - 1) * this.page.pageSize + index + 1
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
    syncHandle(wechatAccount) {
      // 同步公众号数据
      this.$store.dispatch('syncPaccount', {
        wechatAccount
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

