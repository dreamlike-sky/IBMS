<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="auto">
        <app-aside class="aside-menu" :is-collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <i
            :class="{'el-icon-s-fold': !isCollapse,'el-icon-s-unfold': isCollapse}"
            @click="isCollapse = !isCollapse"
            style="font-size: 25px"
          ></i>
          <span>每天资讯—美好生活，天天不重样！</span>
        </div>
        <el-dropdown>
          <div class="avater-wrap">
            <img class="avater" :src="user.photo" alt="">
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'

export default {
  name: 'LayoutIndex',
  props: {},
  components: {
    AppAside
  },
  data () {
    return {
      user: {},
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout (done) {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出！'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: #34495e;
  .aside-menu {
    height: 100%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .header-left{
    display: flex;
    align-items: center;
  }
}
.avater-wrap {
  display: flex;
  align-items: center;
  .avater {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.main {
  background-color: #e9eef3;
}
</style>
