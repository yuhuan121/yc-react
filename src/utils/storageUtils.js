/*
保存用户名到localStorage
*/

import store from 'store'
const USER_KEY='user_key' //定义localStorage内的键名为user_key

export default{
    //1.保存user到localStorage
    saveUser(user){
        store.set(USER_KEY,user)  //store库写法，自动把user解析为字典
    },

    //2.从localSorage读取user
    getUser () {
        return store.get(USER_KEY) || {}
    },

    //3.从localStorage删除user
    removeUser (){
        store.remove(USER_KEY)
    }
}