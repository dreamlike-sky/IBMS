<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        class="table-list"
        :data="tableData"
        style="width: 100%"
        stripe
      >
        <el-table-column
          prop="title"
          label="标题"
        />
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
        />
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
        />
        <el-table-column
          prop="comment_status"
          label="评论状态"
        >
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="comment_status"
          label="操作"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              @change="onStatusChange(scope.row)"
              :disabled="scope.row.statusDisabled"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40, 100]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      tableData: [
        {
          title: '我觉得你挺不错',
          total_comment_count: 0,
          fans_comment_count: 0,
          comment_status: true
        },
        {
          title: '需要多一点运气',
          total_comment_count: 0,
          fans_comment_count: 0,
          comment_status: true
        },
        {
          title: '要更加努力',
          total_comment_count: 0,
          fans_comment_count: 0,
          comment_status: true
        },
        {
          title: '永不言弃',
          total_comment_count: 0,
          fans_comment_count: 0,
          comment_status: true
        }
      ],
      articles: [],
      totalCount: 0,
      pageSize: 10,
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    handleSizeChange () {},
    handleCurrentChange (page) {
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      article.statusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启成功' : '关闭成功'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-list {
  margin-bottom: 30px;
}
</style>
