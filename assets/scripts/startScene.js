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
                    // 'isOpenWx':false, //是否开启微信接口相关   
                    'server':'https://test.mayphant.com',//测试内网IP
                    // 'server':'http://test.mayphant.com/',//测试内网IP
                    'openId':4,//
                    'userInfo': {'level':0,
                                'curExp':0,
                                'tolExp':100,
                                'money':0,
                                'blueBerry':0,
                                'tolMoney': 0 ,
                                'tolBerry': 0,
                                },
                                
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
        // if(!cc.props.isOpenWx){
            this.startBtn.node.on('click',this._startBtnCallBack);
        // }
        
    },

    onDisable (){
        console.log('onDisable  ');
        // if(!cc.props.isOpenWx){
            this.startBtn.node.off('click',this._startBtnCallBack);
        // }
    },

    onDestroy() {
        console.log('scene destroy ');
       
    },

    start () {
        if(cc.props.isOpenWx){ 
            // this._showWXBtn();
            this.startBtn.node.active = false;
            this._wxLogin();
        }else{ //屏蔽wx接口 
            this.test(); 
        }
        
    },

    test () {
        this.userInfoNode.getComponent('userInfo').setUserInfo('名字就是这么长','22222222');
    },

    _showWXBtn (){
         // the UserInfoButton is set position by screen size.
         let systemInfo =  wx.getSystemInfoSync();
         let width = systemInfo.windowWidth;
         let height = systemInfo.windowHeight;

         let button = wx.createUserInfoButton({
            // type: 'text',
            // text: '开始游戏',
            type: 'image',
            image: 'https://mayphant.oss-cn-beijing.aliyuncs.com/buleBerry/playBtn.png',
            style: {
                left: width * 0.50 - 29,
                top: height * 0.50 + 82,
                width: 58,//125//width * 0.13,
                height: 38,//78//height * 0.1,
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

    _wxLogin () {
        wx.login({
            success (res) {
              if (res.code) {
                  console.log('res.code is ',res.code);
                //   this._showWXBtn();
                //发起网络请求
                wx.request({
                  url: cc.props.server + '/api/wx_login',
                  data: {
                    code: res.code
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success (res) {
                    console.log('wx.request success res is  ',res);
                    console.log('res.data.result.openid is ',res.data.result.openid);
                    cc.props.openId = res.data.result.openid;


                    cc.director.getScene().getChildByName('Canvas').getComponent('startScene')._showWXBtn();
                  },
                  fail(res) {
                    console.log('wx.request fail res  is  ',res);
                  },
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
    }    
    // update (dt) {},
});
