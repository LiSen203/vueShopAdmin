<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Card 卡片将信息聚合在卡片容器中展示。 -->
    <el-card>
      <!-- 分栏间隔 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    clearable
                    v-model="queryInfo.query">
            <el-button slot="append"
                       clearable
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisible = true"
                     @close="addDialogClosed">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist"
                highlight-current-row
                style="width: 100%">
        <el-table-column type="index">
          <template slot-scope="scope">
            <span>{{scope.$index + (queryInfo.pagenum - 1) * queryInfo.pagesize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名"
                         prop="username"></el-table-column>
        <el-table-column label="邮箱"
                         prop="email"></el-table-column>
        <el-table-column label="电话"
                         prop="mobile"></el-table-column>
        <el-table-column label="角色"
                         prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     :total="total"
                     :current-page="queryInfo.pagenum"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               center>
      <!-- 添加用户内容主体区域 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px"
               class="addRuleForm">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部确定与取消 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               width="50%"
               center
               @close="editDialogClosed">
      <!-- 添加用户信息内容主体区域 -->
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="100px"
               class="editRuleForm">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="editForm.username"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部确定与取消 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色分配对话框 -->
    <el-dialog title="角色分配"
               :visible.sync="setRoleDialogVisible"
               width="50%"
               center
               @close="setRoleDialogClosed">
      <!-- 角色用户信息内容主体区域 -->
      <div class="roleWarp">
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p><span>分配新角色：</span>
          <el-select v-model="selectedRoleId"
                     placeholder="请选择">
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部确定与取消 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }

      callback(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return callback()
      }

      callback(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 添加对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      // 查询的用户信息对象
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
    }
  },

  created () {
    this.getUserList()
    // this.indexMethod()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      } else {
        this.userlist = res.data.users
        this.total = res.data.total
        console.log(res)
      }
    },
    // 解决分页翻页后索引为1问题
    // indexMethod (index) {
    //   // console.log(this.queryInfo.pagenum - 1)
    //   // console.log(this.queryInfo.pagesize)
    //   // 正序
    //   // return index + (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize + 1
    // },
    // 监听pagesize的改变事件
    handleSizeChange (pageNum) {
      // console.log(pageNum)
      this.queryInfo.pagesize = pageNum
      this.getUserList()
    },
    // 监听当前页数的改变
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听添加用户关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听switch开关状态的改变
    async userStateChanged (userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听角色分配关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    },
    // 点击确定按钮，添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false
        } else {
          // 可以发起添加用户的网络请求
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            // 隐藏添加用户的对话框
            this.addDialogVisible = false
            // 重置表单
            this.addDialogClosed()
            // 重新获取用户列表数据
            this.getUserList()
          }
        }
      })
    },
    // 用户编辑修改对话框
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      } else {
        this.editForm = res.data
        this.editDialogVisible = true
      }
    },
    // 处理修改用户关闭对话框事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        } else {
          // 发起修改用户信息的数据请求
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户信息失败！')
          }
          // 关闭对话框
          this.editDialogVisible = false
          // 更新列表
          this.getUserList()
          // 提示修改成功
          this.$message.success('更新用户信息成功！')
        }
      })
    },
    // 根据id删除对应用户信息
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 在展开对话框前获取所有角色内容
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      } else {
        this.rolesList = res.data
        this.setRoleDialogVisible = true
      }
    },
    // 确定分配角色
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        this.$message.error('请选择要分配的角色！')
      } else {
        const { data: res } = await this.$http.put(
          `users/${this.userInfo.id}/role`,
          {
            rid: this.selectedRoleId
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.getUserList()
        this.setRoleDialogVisible = false
      }
    }
  }
}
</script>
<style scoped>
/* 角色分配样式 */
.roleWarp {
  padding: 20px;
  border: 1px solid #f2f2f2;
  border-radius: 10px;
}
</style>
