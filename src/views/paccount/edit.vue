<template>
  <div class="app-container paccount-edit-page">
    <div class="add-paccount">
      <el-form ref="editInfo" :model="editInfo" :rules="rules" label-width="80px" v-if="id" >
        <el-form-item label="微信号" prop="wechatAccount">
          <el-input v-model.trim="editInfo.wechatAccount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editInfo.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否授权" prop="wechatStatus">
          <el-radio-group v-model="editInfo.wechatStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
          <el-alert
            title="授权是指该公众号是否关联房观察小程序，请一定确保关联后再选择是，否则会导致小程序中该公众号的文章无法打开。"
            show-icon
            type="warning"
            :closable="false">
          </el-alert>
          <!-- <div class="el-upload__tip">
            注意：授权是指该公众号是否关联房观察小程序，请一定确保关联后再选择是，否则会导致小程序中该公众号的文章无法打开。
          </div> -->
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
          <el-button type="primary" @click="onSubmit('editInfo')">立即编辑</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-else>
        <el-form-item label="微信号" prop="wechatAccount" style="width:280px">
          <el-input v-model.trim="form.wechatAccount" placeholder="请输入微信号，注意大小写" :clearable="true" ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否授权" prop="wechatStatus">
          <el-radio-group v-model="form.wechatStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
          <el-alert
            title="授权是指该公众号是否关联房观察小程序，请一定确保关联后再选择是，否则会导致小程序中该公众号的文章无法打开。"
            show-icon
            type="warning"
            :closable="false">
          </el-alert>
          <!-- <div class="el-upload__tip red">
            注意：授权是指该公众号是否关联房观察小程序，请一定确保关联后再选择是，否则会导致小程序中该公众号的文章无法打开。
          </div> -->
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
      defaultDate: '',
      form: {
        wechatAccount: '',
        wechatStatus: 2,
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
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        wechatStatus: [{ required: true, message: '请选择是否授权', trigger: 'change' }],
        classify: [
          { required: true, message: '请选择公众号类型', trigger: 'change' }
        ]
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
      if (this.id) {
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
      }
    },
    submitFilter() {
      this.page.curPage = 1
      this.fetchData()
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) {
            const typeId = this.editInfo.typeId
            // console.log('typeId', typeId)
            // 编辑类型 是否禁用  1 / 2 区别
            const params = { typeId: typeId ? typeId[typeId.length - 1] : '' }

            // console.log('params', params)
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
              this.fetchDict()
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
                this.$alert('<strong>添加失败</strong><p>' + res.msg + '</p>', {
                  type: 'error',
                  dangerouslyUseHTMLString: true,
                  showClose: false,
                  confirmButtonText: '知道了'
                })
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
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
        this.$router.replace({ path: '/paccount/list' })
      })
    },
    changePage(curPage) {
      this.page.curPage = curPage
      this.fetchData()
    },
    getIndex(index) { // 获取序号
      return (this.page.curPage - 1) * this.page.pageSize + index + 1
    },
    formatTypeId(data) {
      data.map((item) => {
        if (item.status === 1) {
          this.typeDictList.push(item.id)
          if (item.childList) {
            this.formatTypeId(item.childList)
          }
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
    // width: 480px;
    // margin-left: 200px;
    .el-form{
      padding-top: 20px;
    }
  }
}

</style>

