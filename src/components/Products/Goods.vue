<template>
  <div class="goods">
    <!-- 搜索框 -->
    <div style="margin-top: 15px;width: 400px;display: inline-block">
      <el-input placeholder="请输入内容" v-model="Pnp" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="queryGoods"></el-button>
      </el-input>
    </div>
    <el-button type="success" plain @click="goGoodsAdd" class="goodsadd">添加商品</el-button>
    <el-table :data="goodsList" style="width: 100%">
     <el-table-column type="index" width="100" :index="indexMethod"></el-table-column>
     <el-table-column prop="goods_name" label="商品名称" width="200"></el-table-column>
     <el-table-column prop="goods_price" label="商品价格" width="200"></el-table-column>
     <el-table-column prop="goods_weight" label="商品重量" width="200"></el-table-column>
     <el-table-column label="创建时间" width="300">
       <template v-slot:default="{row}">
         {{row.add_time|timer}}
       </template>
     </el-table-column>
     <el-table-column label="操作">
       <template v-slot:default="{row}">
         <el-button plain size="small" type="primary" icon="el-icon-edit" @click="editGood(row)"></el-button>
         <el-button plain size="small" type="danger" icon="el-icon-delete" @click="delGood(row)"></el-button>
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
    <!-- 编辑商品的弹出框 -->
    <el-dialog title="编辑商品" :visible.sync="dialogGoodVisible" width="40%" @close="resetForm">
       <el-form ref="form" :rules="rules" label-width="100px" status-icon :model="form">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <el-button type="primary" @click="dialogGoodVisible = false">取 消</el-button>
          <el-button type="success" @click="sureEditGood">确 定</el-button>
        </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Pnp: '',
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      totalPage: null,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      },
      dialogGoodVisible: false,
      rules: {
        goods_name: [
          { required: true, message: 'error goods_name', trigger: ['blur', 'change'] }
        ],
        goods_price: [
          { required: true, message: 'error goods_price', trigger: ['blur', 'change'] }
        ],
        goods_weight: [
          { required: true, message: 'error goods_weight', trigger: ['blur', 'change'] },
          { pattern: /^[1-9]\d{0,}$/, message: '请输入纯数字', trigger: ['blur', 'change'] }
        ],
        goods_number: [
          { required: true, message: 'error goods_number', trigger: ['blur', 'change'] },
          { pattern: /^[1-9]\d{0,}$/, message: '请输入纯数字', trigger: ['blur', 'change'] }
        ]
      },
      id: null
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      let { data } = await this.$axios.get('goods', {
        params: {
          Pnp: this.Pnp,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      this.totalPage = data.total
      this.goodsList = data.goods
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    indexMethod (index) {
      return (this.pagenum - 1) * this.pagesize + index + 1
    },
    goGoodsAdd () {
      this.$router.push({ name: 'goods-add' })
    },
    // 查询商品
    queryGoods () {
      this.getGoodsList()
      this.pagenum = 1
    },
    // 编辑商品
    editGood (row) {
      this.dialogGoodVisible = true
      // console.log(row)
      // 数据回显
      this.form.goods_name = row.goods_name
      this.form.goods_price = row.goods_price
      this.form.goods_weight = row.goods_weight
      this.form.goods_number = row.goods_number
      this.id = row.goods_id
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    async sureEditGood () {
      try {
        await this.$refs.form.validate()
        this.$message.warning('暂无数据')
        this.dialogGoodVisible = false
      } catch (e) {
        console.log(e)
      }
    },
    delGood (row) {
      this.$confirm('需要删除么?再想想吧...', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('操作取消')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 10px 0;
}
.goodsadd {
  margin-left: 15px;
}
</style>
