<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;width: 400px;display: inline-block">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-button type="success" plain class="add-user">添加用户</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: ''
    }
  }
}
</script>

<style lang="less" scoped>
 .add-user {
   margin-left: 20px;
 }
</style>
