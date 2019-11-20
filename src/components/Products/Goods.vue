<template>
  <div class="goods">
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
         <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
         <el-button plain size="small" type="danger" icon="el-icon-delete"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      totalPage: null
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      let { data } = await this.$axios.get('goods', {
        params: {
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 10px 0;
}
</style>
