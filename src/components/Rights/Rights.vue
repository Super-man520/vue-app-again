<template>
  <div class="rights">
     <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table style="width: 100%" :data="rightsList">
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column label="权限名称" prop="authName" width="300"></el-table-column>
      <el-table-column label="路径" prop="path" width="300"></el-table-column>
      <el-table-column label="层级">
        <template v-slot:default="{row}">
          <el-tag type="success" v-if="row.level === '0'">一级</el-tag>
          <el-tag type="warning" v-if="row.level === '1'">二级</el-tag>
          <el-tag type="danger" v-if="row.level === '2'">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      let { data } = await this.$axios.get(`rights/list`)
      this.rightsList = data
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 10px;
}
</style>
