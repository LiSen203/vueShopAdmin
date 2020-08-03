<!--  -->
<template>
  <div class="login-warp">
    <el-form :label-position="top"
             class="login-from"
             label-width="80px"
             :model="formdata">
      <h2>用户登陆</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary"
                 @click.prevent='hangdleLogin()'
                 class="login-btn">登陆</el-button>
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
      }

    }
  },
  methods: {
    // 登陆请求
    hangdleLogin () {
      this.$http.post('login', this.formdata).then(res => {
        console.log(res)
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
.login-btn {
  width: 100%;
}
</style>
