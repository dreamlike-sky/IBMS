<template>
  <el-menu
    default-active="/"
    background-color="#34495e"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <div class="logo_aside">
      <img src="../logo_aside_left.png" alt="">
      <img v-if="!isCollapse" src="../logo_aside_right.png" alt="">
    </div>
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-s-order"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-picture"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="el-icon-s-promotion"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="el-icon-s-comment"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-star-on"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="settings">
      <i class="el-icon-s-tools"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  components: {},
  props: ['is-collapse'],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
  }
}
</script>

<style scoped lang="less">
  .logo_aside {
    padding: 0 10px;
    height: 70px;
    margin-top: 10px;
  }
</style>
