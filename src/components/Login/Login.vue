<template>
  <div class="login">
    <h1>宇宙后台管理系统</h1>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="loginform"
      status-icon
      @keyup.enter.native="loginBtn"
    >
      <el-form-item label="username" prop="username">
        <el-input v-model="form.username" placeholder="username"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="form.password" placeholder="password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="loginbtn" @click="loginBtn">登录</el-button>
        <el-button type="success" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'place enter username', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '请输入字符数3~12', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'place enter password', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '请输入字符数3~12', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async loginBtn () {
      try {
        await this.$refs.form.validate()
        let res = await this.$axios.post('login', this.form)
        const { data, meta } = res
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$router.push({ name: 'index' })
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
 .login {
   width: 400px;
   background-color: #fff;
   padding: 50px 30px 10px;
   border-radius: 10px;
   margin: 150px auto;
   box-shadow: 0 0 20px #ddd;
   h1 {
     text-align: center;
     position: relative;
     top: -26px;
   }
   .loginbtn {
     margin-right: 10px;
   }
 }
</style>
