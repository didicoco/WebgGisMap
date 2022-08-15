<template>
    <div id="app">
        <el-container class="app-out-pannel">
            <el-header class="sys-header">
                <span> 一张图项目系统 </span>
                <div class="sys-header-user">
                    <i class="el-icon-user"></i>
                    <span>当前用户:</span>
                    <span @click="handleUserLogin">{{ username }}</span>
                </div>
            </el-header>
            <el-container class="app-content-pannel">
                <el-aside class="sys-menu">
                    <el-menu
                        default-active="1-4-1"
                        class="el-menu-vertical-demo"
                        @select="handleMenuSelect"
                        background-color="#545c64"
                        text-color="fff"
                        active-text-color="#ffd04b"
                        :collapse="true"
                    >
                        <el-menu-item index="1">
                            <i class="el-icon-monitor"></i>
                            <span slot="title">首页大屏</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <i class="el-icon-picture-outline"></i>
                            <span slot="title">一张图</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>

                <el-main class="sys-content">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
        <!-- 用户登陆界面弹出，不影响页面布局 -->
        <el-dialog title="用户登陆/注册" :visible.sync="loginDialogVisible" width="30%">
            <div class="login-content">
                <label for="username">用户名：</label>
                <el-input placeholder="请输入用户名" v-model="userNameInput" clearable id="username"> </el-input>
                <br />
                <br />
                <label for="userpsd">密码：</label>
                <el-input placeholder="请输入密码" v-model="userPsdInput" show-password id="userpsd"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userLogin">登 陆</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'App',
    components: {},
    data() {
        return {
            username: '未登录',
            loginDialogVisible: false,
            userNameInput: '',
            userPsdInput: '',
        };
    },
    methods: {
        handleMenuSelect(index) {
            if (index === '1') {
                this.$router.push('/');
            } else if (index === '2') {
                this.$router.push('/onemap');
            }
        },
        //用户登陆界面弹出
        handleUserLogin() {
            this.loginDialogVisible = true;
        },
        userLogin() {
            // const _self = this;
            const name = this.userNameInput;
            const psd = this.userPsdInput;
            axios
                .get('http://localhost:3001/user/get', {
                    params: {
                        name,
                    },
                })
                .then((response) => {
                    if (response.data.status === 'success') {
                        if (response.data.data[0].password === psd) {
                            this.$message({
                                message: '恭喜你，登陆成功',
                                type: 'success',
                            });
                            this.loginDialogVisible = false;
                            this._data.username = name;
                        } else {
                            this.$message.error('登陆失败，用户名或密码错误');
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    this.loginDialogVisible = false;
                });
        },
    },
};
</script>

<style>
html,
body,
#app {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
}
.app-out-pannel,
.app-content-pannel {
    height: 100%;
}
.sys-header {
    background-color: #32373e;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
}
.sys-menu {
    background-color: #545c64;
    width: 64px !important;
    overflow: hidden !important;
}
.sys-content {
    padding: 5px !important;
}
.sys-header-user {
    font-size: 15px;
    font-weight: 300;
}
.sys-header-user > span:last-child:hover {
    color: #409eff;
    /* 鼠标移入形式：变小手 */
    cursor: pointer;
}
</style>
