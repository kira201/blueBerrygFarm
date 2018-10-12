/**
 * 农场场景 
*/

cc.Class({
    extends: cc.Component,

    properties: {
        playerAvatar: cc.Node,//用户头像
        playerName: cc.Label,//用户名字
        playerLevel: cc.Label,//用户等级
        playerExp: cc.Label,//用户经验值
        playerBar: {
            default: null,
            type: cc.ProgressBar,//用户经验条
        },

        landArrNode: cc.Node, //庄稼数组父节点
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setPlayerInfo('self');
    },

    start () {
      this.refreshLandItems(); 
    },

    onDestroy() {
        console.log('scene destroy ');
        cc.game.removePersistRootNode(userInfoNode);// 释放常驻节点
    },

    /**
     * 刷新农场庄稼
     */ 
    refreshLandItems () {
        /************临时测试数据******************* */        
        let landInfoArrObj = [];
        for(let i = 1 ; i <= 24; i++){
            let state = Math.floor(Math.random()*(5))
            landInfoArrObj.push({'state': state}) 
        }
        /******************************* */


        for(let m = 1 ; m <= 24; m++){
            let landItemNodeName = 'landItem_' + m;
            let landItem = this.landArrNode.getChildByName(landItemNodeName);
            landItem.getComponent('landmanage').setLandItemState(landInfoArrObj[m - 1].state, m);//@todo这里 为临时数据
        }
    },

    /**
     * 设置用户信息 头像 名字 等级
     * @param {String} type  self为当前用户信息 其他为好友信息
     * */ 

    setPlayerInfo (type) {
        if (type === 'self') { //设置当前用户的信息
            let userInfoNode = cc.find('UserInfoNode');//获取场景常驻节点
            let userInfo = userInfoNode.getComponent('userInfo').getUserInfo();//获取用户信息
            
            this._setPlayerName(userInfo.userName);//设置名字
            if(cc.props.isOpenWx){
               this._setPlayerAvatar(userInfo.userAvatar);//设置用户头像 
            }
            

            this._setPlayerLevel(999); //test @todo 替换服务器获取数据
            this._setPlayerExp(80,200);//test @todo 替换服务器获取数据
        }else{//设置好友用户的信息
        
        }

    },

    /**
     * 设置用户名字
     * @param {String} nameStr 用户名字
     * */
    _setPlayerName (nameStr) {
        this.playerName.string = nameStr;//设置名字
    },

    /**
     * 设置用户头像
     * @param {String} avatarStr 用户头像的url
     * */    
    _setPlayerAvatar (avatarStr) {
        let playerAvatarSprite = this.playerAvatar.getComponent('cc.Sprite');
    
        cc.loader.load({
            url: avatarStr,
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            playerAvatarSprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    },

    /**
     * 设置用户等级
     * @param {String} level 用户等级
     * */    
    _setPlayerLevel (level) {
        this.playerLevel.string = level;
    },

    /**
     * 设置用户经验
     * @param {Number} curExp 用户当前经验
     * @param {Number} tolExp 用户升级经验
     * */    
    _setPlayerExp (curExp, tolExp) {
        this.playerExp.string = curExp + '/' + tolExp;

        let expProgress = curExp / tolExp;
        this.playerBar.progress = expProgress;
        
    }

    // update (dt) {},
});
