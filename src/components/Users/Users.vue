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
        <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
      </el-input>
    </div>
    <el-button type="success" plain class="add-user" @click="showAdd">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="username" label="姓名" width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column label="用户状态" width="200">
        <template v-slot:default="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" plain size="small" icon="el-icon-edit" @click="showEdit(row)"></el-button>
          <el-button type="danger" plain size="small" icon="el-icon-delete" @click="delUser(row)"></el-button>
          <el-button type="success" plain size="small" icon="el-icon-check" @click="assignUser(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </div>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="showAddUser" width="40%" @close="resetForm">
      <el-form ref="addForm" :rules="rules" :model="addForm" status-icon label-width="100px">
        <el-form-item label="username" prop="username">
          <el-input v-model="addForm.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="addForm.password" placeholder="password" show-password type="password"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="addForm.email" placeholder="email"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="showAddUser = false">取 消</el-button>
          <el-button type="primary" @click="sureAddUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="showEditUser" width="40%">
      <el-form ref="editForm" :rules="rules" :model="editForm" status-icon label-width="100px">
        <el-form-item label="username">
          <el-button type="success" plain disabled>{{username}}</el-button>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="editForm.email" placeholder="email"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="showEditUser = false">取 消</el-button>
          <el-button type="primary" @click="sureEditUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="showAssign" width="40%">
      <el-form label-width="100px" :model="assignForm">
        <el-form-item label="用户名">
          <el-button type="primary" disabled>{{username}}</el-button>
        </el-form-item>
        <el-form-item label="角色列表">
          <!-- option选中的值即为rid -->
            <el-select v-model="assignForm.rid" placeholder="请选择">
              <el-option
                clearable
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="showAssign = false">取 消</el-button>
          <el-button @click="assignRole" type="primary">分  配</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1, // 当前页码
      pagesize: 5, // 每页条数
      totalPage: null, // 总页数
      userList: [],
      showAddUser: false,
      showEditUser: false,
      showAssign: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        email: '',
        mobile: ''
      },
      assignForm: {
        id: '',
        rid: ''
      },
      username: '',
      id: '',
      options: [],
      value: '',
      rules: {
        username: [
          { required: true, message: 'place enter username', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'place enter password', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: 'place enter email', trigger: ['blur', 'change'] },
          { type: 'email', message: 'place enter true email', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: 'place enter mobile', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: 'place enter true mobile', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      let { data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      this.userList = data.users
      this.totalPage = data.total
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    // 改变状态
    async changeState (row) {
      // console.log(row)
      let id = row.id
      let type = row.mg_state
      let { meta } = await this.$axios.put(`users/${id}/state/${type}`)
      if (meta.status === 200) {
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加用户
    showAdd () {
      this.showAddUser = true
    },
    resetForm () {
      this.$refs.addForm.resetFields()
    },
    async sureAddUser () {
      try {
        await this.$refs.addForm.validate()
        let { meta } = await this.$axios.post('users', this.addForm)
        this.$message.success(meta.msg)
        this.totalPage++
        this.pagenum = Math.ceil(this.totalPage / this.pagesize)
        this.getUserList()
        this.showAddUser = false
      } catch (e) {
        console.log(e)
      }
    },
    // 删除用户
    delUser (row) {
      let id = row.id
      this.$confirm('你确定要删除么?此操作不可修复...', '友情提示', {
        type: 'warning'
      }).then(async () => {
        let { meta } = await this.$axios.delete(`users/${id}`)
        this.$message.success(meta.msg)
        if (this.pagenum > 1 && this.userList.length === 1) {
          this.pagenum--
        }
        this.getUserList()
      }).catch(() => this.$message.error('操作取消'))
    },
    // 编辑用户
    showEdit (row) {
      // console.log(row)
      this.showEditUser = true
      this.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.id = row.id
    },
    async sureEditUser () {
      try {
        await this.$refs.editForm.validate()
        let { meta } = await this.$axios.put(`users/${this.id}`, this.editForm)
        this.$message.success(meta.msg)
        this.getUserList()
        this.showEditUser = false
      } catch (e) {
        console.log(e)
      }
    },
    // 分配角色
    async assignUser (row) {
      // console.log(row)
      this.assignForm.id = row.id
      this.username = row.username
      this.showAssign = true
      // 数据回显 恢复默认状态  根据用户id查询角色rid
      let res = await this.$axios.get(`users/${row.id}`)
      // 新添加用户的rid为-1
      this.assignForm.rid = res.data.rid === -1 ? '' : res.data.rid
      let { data } = await this.$axios.get('roles')
      this.options = data
    },
    async assignRole () {
      // console.log(this.assignForm)
      const { id, rid } = this.assignForm
      if (rid === '') {
        this.$message.error('请选择角色')
        return
      }
      let { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getUserList()
        this.showAssign = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 表单颜色
    tableRowClassName ({ row, rowIndex }) {
      // console.log(rowIndex)
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // 查询用户
    queryUser () {
      this.getUserList()
      this.pagenum = 1
    }
  }
}
</script>

<style lang="less" scoped>
.add-user {
  margin-left: 20px;
}
.el-table {
  margin-top: 10px;
}
.block {
  margin-top: 10px;
}
.el-table
::v-deep.warning-row {
  background: oldlace;
}
.el-table
/deep/.success-row {
    background: #f0f9eb;
  }
</style>
<style>
  /* .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  } */
</style>
