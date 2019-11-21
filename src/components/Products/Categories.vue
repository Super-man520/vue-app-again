<template>
  <div class="categories">
    <el-button type="success" plain @click="addCategory">添加分类</el-button>
    <el-table :data="categoryList"
    style="width: 100%"
    row-key="cat_id"
    border
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column  prop="cat_name" label="分类名称" width="200"></el-table-column>
      <el-table-column label="是否有效" width="300">
        <template v-slot:default="{row}">
          {{row.cat_deleted?'否':'是'}}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级" width="300"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button size="small" plain icon="el-icon-edit" type="primary" @click="editCategory(row)"></el-button>
          <el-button size="small" plain icon="el-icon-delete" type="danger" @click="delCategory(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
      <!-- 添加分类的弹出框 -->
      <el-dialog title="添加分类" :visible.sync="showAddCategory" width="30%" @close="resetForm">
        <el-form :model="addForm" :rules="rules" status-icon label-width="100px" ref="addForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <!-- 此处prop用于清空  而不是校验 -->
          <el-form-item label="父类名称" prop="cat_pid">
            <el-cascader
              :props="props"
              clearable
              v-model="addForm.cat_pid"
              :options="options"></el-cascader>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button @click="showAddCategory = false">取 消</el-button>
            <el-button type="primary" @click="sureAddCategory">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 编辑分类的弹出框 -->
      <el-dialog title="编辑分类" :visible.sync="showEditCategory" width="30%">
        <el-form :model="editForm" :rules="rules" status-icon label-width="100px" ref="editForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <span class="dialog-footer">
            <el-button @click="showEditCategory = false">取 消</el-button>
            <el-button type="primary" @click="sureEditCategory">确 定</el-button>
          </span>
      </template>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      categoryList: [],
      pagenum: 1,
      pagesize: 10,
      totalPage: null,
      showAddCategory: false,
      showEditCategory: false,
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      editForm: {
        cat_name: ''
      },
      rules: {
        cat_name: [
          { required: true, message: 'place enter cat_name', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        checkStrictly: true,
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      id: ''
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      let res = await this.$axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      const { data } = res
      this.loading = false
      this.categoryList = data.result
      this.totalPage = data.total
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoryList()
    },
    // 添加分类
    async addCategory () {
      this.showAddCategory = true
      let res = await this.$axios.get('categories?type=2')
      // console.log(res)
      this.options = res.data
    },
    async sureAddCategory () {
      try {
        await this.$refs.addForm.validate()
        // 父级id  拿到数组cat_pid的最后一项，0表示没有父级  level即长度
        // console.log(this.addForm.cat_pid)
        let catpid = this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0
        let catlevel = this.addForm.cat_pid.length
        let catname = this.addForm.cat_name
        let { meta } = await this.$axios.post('categories', {
          cat_pid: catpid,
          cat_name: catname,
          cat_level: catlevel
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.showAddCategory = false
          // 先自增
          this.totalPage++
          this.pagenum = Math.ceil(this.totalPage / this.pagesize)
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除分类
    delCategory (row) {
      this.$confirm('你确定要删除么?此操作不可修复...', '温馨提示', {
        type: 'warning'
      }).then(async () => {
        // console.log(row)
        let { meta } = await this.$axios.delete(`categories/${row.cat_id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.pagenum > 1 && this.categoryList.length === 1) {
            this.pagenum--
          }
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      }).catch(() => {
        this.$message.error('操作取消')
      })
    },
    resetForm () {
      this.$refs.addForm.resetFields()
    },
    // 编辑分类
    editCategory (row) {
      // console.log(row)
      this.showEditCategory = true
      this.editForm.cat_name = row.cat_name
      this.id = row.cat_id
    },
    async sureEditCategory () {
      try {
        await this.$refs.editForm.validate()
        let { meta } = await this.$axios.put(`categories/${this.id}`, { cat_name: this.editForm.cat_name })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getCategoryList()
          this.showEditCategory = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 20px 0;
}
</style>
