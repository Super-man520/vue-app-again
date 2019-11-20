<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain class="adduser" @click="addRole">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <h1 v-if="row.children.length === 0">暂无权限</h1>
          <el-row v-for="item1 in row.children" :key="item1.id" class="tag-line">
            <el-col :span="4">
              <el-tag @close="delRole(row,item1.id)"
                closable
                type="primary">
                {{item1.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag @close="delRole(row,item2.id)"
                    closable
                    type="info">
                    {{item2.authName}}
                  </el-tag>
                </el-col>
                <el-col :span="18">
                  <el-tag  @close="delRole(row,item3.id)" v-for="item3 in item2.children" :key="item3.id"  closable
                    type="success">{{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="300"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button plain type="success" icon="el-icon-edit" size="small" @click="editRole(row)"></el-button>
          <el-button plain type="danger" icon="el-icon-delete" size="small" @click="deleteRole(row)"></el-button>
          <el-button plain type="primary" icon="el-icon-check" size="small" @click="assignRole(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加用户的弹框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible"  width="40%" @close="resetForm">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
         <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureChangeRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 树形结构 -->
    <el-dialog title="分配权限" :visible.sync="dialogTreeVisible" width="40%">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        ref="tree"
        :props="defaultProps">
      </el-tree>
      <template v-slot:footer>
        <el-button type="success" size="small" @click="resetRole">重 置</el-button>
        <el-button type="danger" size="small" @click="dialogTreeVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="sureAssignRole">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: [],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleList: [],
      title: '添加角色',
      dialogFormVisible: false,
      dialogTreeVisible: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: 'place enter roleName', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: 'place enter roleDesc', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data } = await this.$axios.get('roles')
      // console.log(data)
      this.roleList = data
    },
    async delRole (row, id) {
      let roleId = row.id
      let rightId = id
      let { data } = await this.$axios.delete(`roles/${roleId}/rights/${rightId}`)
      // console.log(row, data)
      row.children = data
    },
    // 添加角色
    addRole () {
      this.title = '添加角色'
      this.dialogFormVisible = true
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    // 编辑角色
    editRole (row) {
      this.dialogFormVisible = true
      this.title = '编辑角色'
      // console.log(row)
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    async sureChangeRole () {
      const method = this.title === '编辑角色' ? 'put' : 'post'
      const url = this.title === '编辑角色' ? `roles/${this.form.id}` : 'roles'
      let { meta } = await this.$axios[method](url, this.form)
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success('操作成功')
        this.getRoleList()
        this.dialogFormVisible = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色
    deleteRole (row) {
      let id = row.id
      this.$confirm('你确定眼删除么?此操作不可恢复...', '友情提示', {
        type: 'warning'
      }).then(async () => {
        let { meta } = await this.$axios.delete(`roles/${id}`)
        this.$message.success(meta.msg)
        this.getRoleList()
      }).catch(() => {
        this.$message.error('操作取消')
      })
    },
    // 分配权限
    async assignRole (row) {
      this.dialogTreeVisible = true
      // console.log(row)
      this.roleId = row.id
      // 获取所有的权限列表
      let res = await this.$axios.get(`rights/tree`)
      // console.log(res)
      this.data = res.data
      // this.ids.push(101)
      // 依次遍历拿到每个角色的id进行数据回显
      const ids = []
      row.children.forEach(item => {
        item.children.forEach(item => {
          item.children.forEach(item => {
            ids.push(item.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    resetRole () {
      this.$refs.tree.setCheckedKeys([])
    },
    async sureAssignRole () {
      let rootIds = this.$refs.tree.getCheckedKeys()
      let nodeIds = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...rootIds, ...nodeIds].join(',')
      // console.log(ids)
      let { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      if (meta.status === 200) {
        this.dialogTreeVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.adduser {
  margin: 10px 0;
}
.el-tag {
  margin: 5px;
}
.tag-line {
  border-bottom: 1px dashed #888;
  padding: 8px 0;
  &:last-child {
    border-bottom: none;
  }
}
</style>
