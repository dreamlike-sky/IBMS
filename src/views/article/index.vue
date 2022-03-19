<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="55px"
        size="small"
        v-loading="loading"
      >
        <el-form-item label="状态：">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{ totalCount }} 条结果：</span>
      </div>
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        class="list-table"
        size="small"
        v-loading="loading"
      >
        <el-table-column
          prop="date"
          label="封面"
        >
          <template slot-scope="scope">
            <!-- 处理没有图片的情况，这种是使用 Element 官方组件的处理 -->
            <!-- lazy 配置图片显示懒加载 -->
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <!-- 设置加载失败的图标 -->
              <!-- <div slot="error" class="image-slot" style="font-size: 45px">
                <i class="el-icon-picture-outline"></i>
              </div> -->
              <div slot="placeholder" class="image-slot">
                加载中<span>...</span>
              </div>
            </el-image>
            <!-- 处理没有图片的情况，这种是用自己的图片然后判断处理 -->
            <!-- <img class="article-cover" v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" alt="">
            <img class="article-cover" v-else src="./no-cover.gif" alt=""> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" circle icon="el-icon-edit"></el-button>
            <el-button
              size="small"
              type="danger"
              circle icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        background
        @current-change="onCurrentChange"
        :disabled="loading"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { text: '草稿', status: 0 },
        { text: '待审核', status: 1, type: 'warning' },
        { text: '审核通过', status: 2, type: 'success' },
        { text: '审核失败', status: 3, type: 'danger' },
        { text: '已删除', status: 4, type: 'info' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页数据条数
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表格数据加载中 loading
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    this.loadArticles(1)
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      console.log(articleId.toString())
      this.$confirm('确认删除吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.loadArticles(this.page)
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除！'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .filter-card {
    margin-bottom: 30px;
  }
  .list-table {
    margin-bottom: 20px;
  }
  .article-cover {
    width: 100px;
    background-size: cover;
  }
  .image-slot {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
