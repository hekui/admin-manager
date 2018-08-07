/**
 * @description: 类型管理
 * @author: zhangchenle
 * @date: 2018-8-7
 */
<template>
  <div class="content-container">
    类型管理
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'category',
  data() {
    return {
      loading: false,
      filter: {
        deliveryTime: '', // 发布时间
        publicType: [], // 公众号类型
        publicName: '', // 公众号名称
        articleTitle: '', // 文章标题
        articelType: [] // 文章类型
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
      },
      page: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapState({
      options: state => state.options,
      articleOptions: state => state.content.options,
      listData: state => state.content.listData
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('getContentList', Object.assign({}, this.filter, this.page)).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 改变每页条数
    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.fetchData()
    },
    submitFilter() {
      this.page.pageNo = 1
      this.fetchData()
    },
    handleDetail(data) {
      this.$router.push({ path: '/content/detail', query: { id: data.id }})
    },
    handleEdit(data) {
      this.$router.push({ path: '/content/edit', query: { id: data.id }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content-container {
  padding: 10px 20px;
  min-height: 100%;
  .pagination {
    margin-top: 12px;
    text-align: right;
  }
}
.el-form {
  padding-bottom: 20px;
  border-bottom: 1px dashed #ccc;
}
.el-input {
  width: 220px;
}
</style>
