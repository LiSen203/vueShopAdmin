<!--  -->
<template>
  <div class="login-warp">
    <el-form :label-position="top"
             class="login-from"
             label-width="80px"
             :model="formdata"
             :rules="rules"
             ref="formdata">
      <h2>用户登陆</h2>
      <el-form-item label="用户名"
                    prop="username">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop="password">
        <el-input v-model="formdata.password"
                  type="password"
                  prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click='login'
                   class="login-btn">登陆</el-button>
        <el-button type="info"
                   @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      top: 'top',
      formdata: {
        username: '',
        password: ''
      },
      // 表单的验证规则对象
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 点击重置按钮，重置表单
    resetLoginForm () {
      this.$refs.formdata.resetFields()
    },
    // 登陆请求
    login () {
      // this.$http.post('login', this.formdata).then(res => {
      //   console.log(res)
      // })

      this.$refs.formdata.validate(async valid => {
        if (!valid) {
          return false
        } else {
          const { data: res } = await this.$http.post('login', this.formdata)
          if (res.meta.status !== 200) {
            return this.$message.error('登录失败！')
          } else {
            this.$message.success('登录成功')
            // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
            //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
            //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
            window.sessionStorage.setItem('token', res.data.token)
            // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
            this.$router.push('/home')
          }
        }
      })
    }

  },
  // 生命周期 - 创建完成（访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted () {

  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.login-warp {
  height: 100%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-from {
  width: 400px;
  background: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-from h2 {
  font-size: 24px;
  color: #666;
}
</style>
