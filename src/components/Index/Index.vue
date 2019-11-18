<template>
  <div class="index">
    <el-container>
      <el-header>
        <div class="logo">
          <img src="../../assets/logo.png" alt />
        </div>
        <h1>宇宙系统管理后台</h1>
        <div class="logout">
          <span>欢迎光临 ~</span>
          <a href="javascript:void(0);" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-row class="tac">
            <el-col>
              <el-menu
                :default-active="defaultActive"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                unique-opened
                router
              >
                <el-submenu :index="item.path" v-for="item in menusList" :key="item.id">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.authName}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item :index="item.path" v-for="item in item.children" :key="item.id">
                      <i class="el-icon-menu"></i>{{item.authName}}
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menusList: []
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.substr(1)
    }
  },
  async created () {
    let res = await this.$axios.get('menus')
    // console.log(res)
    // console.log(this.$route.path.substr(1))
    const { data, meta } = res
    if (meta.status === 200) {
      this.menusList = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    logout () {
      this.$confirm('你确定要退出么?此操作不可恢复...', '温馨提示', {
        type: 'success'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push({ name: 'login' })
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.index,
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  height: 70px !important;
  display: flex;
  align-items: center;
  .logo {
    width: 200px;
    img {
      width: 50px;
      display: block;
      margin: 0 auto;
    }
  }
  h1 {
    flex: 1;
    text-align: center;
    color: #555;
  }
  .logout {
    width: 200px;
    text-align: center;
    a {
      color: #daa520;
    }
  }
}
.el-aside {
  background-color: #d3dce6;
  .el-row {
    height: 100%;
    background-color: #545c64;
  }
}
.el-main {
  background-color: #e9eef3;
}
</style>
<style lang="less">
  .el-menu-item-group__title {
    padding: 0px;
  }
  .el-menu {
    border-right: none;
  }
</style>
