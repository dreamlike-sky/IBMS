<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        :model="article"
        label-width="65px"
        :rules="formRules"
        ref="publish-form"
      >
        <el-form-item label="标题：" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="350"
            placeholder="请输入你的内容......"
          />
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="article.cover.type > 0">
            <upload-cover
              :key="cover"
              v-for="(cover, index) in article.cover.type"
              v-model="article.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  HorizontalRule,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Image,
  CodeBlock
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
import UploadCover from './components/upload-cover'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
      channels: [],
      article: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: null
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true, menubar: false }),
        new Italic(),
        new Strike(),
        new HorizontalRule(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Image({
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
        }),
        new CodeBlock() // 代码块
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return
        }
        const articleId = this.$route.query.id
        if (articleId) {
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        } else {
          addArticle(this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
          })
          this.$router.push('/article')
        }
      })
    },
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>

<style scoped lang="less">

</style>
