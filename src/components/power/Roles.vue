<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-button type="primary"
                     @click="addVistable=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-row>
        <el-col>
          <el-table :data="RolesList"
                    border
                    stripe>
            <!-- 展开的table -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row v-for="(item1,index) in scope.row.children"
                        :key="item1.id"
                        :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']">
                  <!-- 渲染一级权限 -->
                  <el-col :span="5">
                    <el-tag closable
                            @close="delRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二三级权限 -->
                  <el-col :span="19">
                    <el-row v-for="(item2,index1) in item1.children"
                            :key="item2.id"
                            :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']">
                      <el-col :span="6">
                        <el-tag type="success"
                                closable
                                @close="delRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag type="warning"
                                v-for="item3 in item2.children"
                                :key="item3.id"
                                closable
                                @close="delRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row v-if="scope.row.children.length==0">
                  <el-col :span="24">没有分配权限</el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称"
                             prop="roleName"></el-table-column>
            <el-table-column label="角色描述"
                             prop="roleDesc"></el-table-column>
            <el-table-column label="操作"
                             width="300px">
              <template slot-scope="">
                <el-button size="mini"
                           type="primary"
                           icon="el-icon-edit">编辑</el-button>
                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete">删除</el-button>
                <el-button size="mini"
                           type="warning"
                           icon="el-icon-setting">分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      RolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      }
      this.RolesList = res.data
      console.log(this.RolesList)
    },
    // 根据id删除对应的权限
    async delRightById (role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }

      // this.getRolesList()
      // 将服务器返回数据赋值给当前角色
      role.children = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
