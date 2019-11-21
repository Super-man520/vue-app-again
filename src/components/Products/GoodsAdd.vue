<template>
  <div class="goodsadd">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-tabs tab-position="left" v-model="value" @tab-click="changeTab">
      <el-tab-pane label="用户管理" name="0">
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
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              clearable
              v-model="form.goods_cat"
              :options="options"
              :props="props"></el-cascader>
          </el-form-item>
        </el-form>
        <el-button style="margin-top: 12px;" @click="next1" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="1">
        <el-upload
          :limit="limit"
          :headers="headers"
          name="file"
          multiple
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button style="margin-top: 12px;" @click="next2" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="2">
        <quill-editor ref="myTextEditor"
          v-model="form.goods_introduce"
          :content="content"
          @change="onEditorChange($event)">
        </quill-editor>
        <el-button style="margin-top: 12px;" type="primary" @click="addGoods">完成</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      limit: 5,
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      active: 0,
      value: '0',
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_introduce: '',
        goods_cat: [],
        pics: []
      },
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
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      },
      content: '<h2>I am Example</h2>'
    }
  },
  created () {
    this.getCategory()
  },
  methods: {
    async next1 () {
      try {
        await this.$refs.form.validate()
        if (this.form.goods_cat.length === 0) {
          this.$message.error('请选择商品分类')
          return
        }
        this.active++
        this.value = this.active + ''
        // console.log(this.form.goods_cat)
        // this.form.goods_cat = [...this.form.goods_cat].join(',')
        // console.log(this.form.goods_cat)
      } catch (e) {
        console.log(e)
      }
    },
    async next2 () {
      // await this.$refs.form.validate()
      this.active++
      this.value = this.active + ''
    },
    changeTab (value) {
      // console.log(value)
      // console.log(value.name)
      this.active = +value.index
    },
    async getCategory () {
      let { data } = await this.$axios.get('categories?type=3')
      this.options = data
    },
    // 照片上传
    handleRemove (file, fileList) {
      console.log(file)
      const { data } = file.response
      let tmpPath = data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== tmpPath)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess (response, file, fileList) {
      // console.log(response)
      const { data, meta } = response
      if (meta.status === 200) {
        // this.$message.success(meta.msg)
        this.form.pics.push({
          pic: data.tmp_path
        })
        if (this.form.pics.length === 5) {
          // this.form.pics.shift()
          this.$message.info('最多只能上传5张')
        }
      } else {
        this.$message.error(meta.msg)
      }
      // console.log(this.form.pics)
    },
    // 富文本编辑器
    onEditorChange ({ editor, html, text }) {
      console.log('editor change!', html, text)
      this.content = html
    },
    async addGoods () {
      let { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: [...this.form.goods_cat].join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push({ name: 'goods' })
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 深度作用选择器
.el-tabs {
  margin: 15px 0;
}
.quill-editor
::v-deep.ql-container {
  height: 300px;
}
// .quill-editor
// /deep/.ql-container {
//   height: 300px;
// }
</style>
