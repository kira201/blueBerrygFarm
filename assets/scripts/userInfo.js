/**
 * 用户信息 
*/
cc.Class({
    extends: cc.Component,

    properties: {
        userName: cc.String,
        userAvatar: cc.String,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setUserInfo (userName,userAvatar) {
        console.log('setUserInfo   userName is ',userName);
        console.log('setUserInfo   userAvatar is ',userAvatar);
        this.userName = userName;
        this.userAvatar = userAvatar;
    },

    getUserInfo () {
        let infoObj = {
            userName: this.userName,
            userAvatar: this.userAvatar,
        }

        return infoObj;
    }

    // update (dt) {},
});
