/**
 * 开始游戏场景 
*/
cc.Class({
    extends: cc.Component,

    properties: {
        startBtn: cc.Button,
        userInfoNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    setGlobalConfig () {
        cc.props = {
                    'isOpenWx':true, //是否开启微信接口相关   
                    
        
                   }
    },
    onLoad () {
        console.log('onLoad');
        //设置常驻节点
        cc.game.addPersistRootNode(this.userInfoNode);
        
        this.setGlobalConfig();
    },

    onEnable () {
        console.log('onEnable');
        if(!cc.props.isOpenWx){
            this.startBtn.node.on('click',this._startBtnCallBack);
        }
        
    },

    onDisable (){
        console.log('onDisable  ');
        if(!cc.props.isOpenWx){
            this.startBtn.node.off('click',this._startBtnCallBack);
        }
    },

    onDestroy() {
        console.log('scene destroy ');
       
    },

    start () {
        if(cc.props.isOpenWx){ 
            this._showWXBtn();
        }else{ //屏蔽wx接口 
            this.test(); 
        }
        
    },

    test () {
        this.userInfoNode.getComponent('userInfo').setUserInfo('11111111','22222222');
    },

    _showWXBtn (){
         // the UserInfoButton is set position by screen size.
         let systemInfo =  wx.getSystemInfoSync();
         let width = systemInfo.windowWidth;
         let height = systemInfo.windowHeight;

         let button = wx.createUserInfoButton({
            type: 'text',
            text: '开始游戏',
            style: {
                left: width * 0.50 - 100,
                top: height * 0.80,
                width: 200,//width * 0.13,
                height: 60,//height * 0.1,
                lineHeight: 40,
                backgroundColor: '#eeeeee',
                color: '#E03636',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 3
            }
        });

        let userInfo = null;
        let _self = this;

        button.onTap((res) => {
            if (userInfo) return;
            switch(res.errMsg) {
                case 'getUserInfo:ok': 
                    userInfo = res.userInfo;

                    console.log('userInfo is ',userInfo);

                    _self.userInfoNode.getComponent('userInfo').setUserInfo(userInfo.nickName,userInfo.avatarUrl);

                     cc.director.loadScene('farmScene');

                     button.destroy();   
                default:
                    console.log('wx button ontap errMsg is ',res.errMsg);
                    break;
            }
        });
    },

    _startBtnCallBack(){    
        console.log('press start');
        cc.director.loadScene('farmScene');
    },
    // update (dt) {},
});
