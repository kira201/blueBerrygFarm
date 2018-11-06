/**
 * 农场场景 
*/

const errCodeArr = {
    201 : '蓝莓未成熟',
    202 : '金币不足',
    203 : '不可重复购买',
    204 : '罐头仍在生产中',
    205 : '蓝莓数量不足',
};//错误码

cc.Class({
    extends: cc.Component,

    properties: {
        playerAvatar: cc.Node,//玩家头像
        playerName: cc.Label,//玩家名字
        playerLevel: cc.Label,//玩家等级
        playerExp: cc.Label,//玩家经验值
        playerBar: {
            default: null,
            type: cc.ProgressBar,//玩家经验条
        },

        playerMoneyLabel: cc.Label, //玩家金币
        playerBerryLabel: cc.Label, //玩家蓝莓数量


        landArrNode: cc.Node, //庄稼数组父节点

        boardNode: cc.Node, //留言板节点
        treeNode: cc.Node, //树父节点
        shopNode: cc.Node, //商店节点
        factoryNode: cc.Node, //工厂节点
        dogHouseNode: cc.Node, //狗窝节点

        uiNode: cc.Node, //UI弹窗节点    
        confirmLayer: cc.Node, //确认框节点    

        levelUpNode: cc.Node, //升级界面节点

        addBtn: cc.Node, //添加钻石按钮

        getBerryItem: {
            default: null,
            type: cc.Prefab
        },
        
        dogAnimationNode: { //狗狗动画
            default: null,
            type: cc.Animation,
        },

        okAudio : {
            default: null,
            type: cc.AudioClip,
        },

        cancelAudio : {
            default: null,
            type: cc.AudioClip,
        },

        _blueBerryPrice: 0,//蓝莓价格
        _landPrice: 0,//土地价格
        _curBuyBerryPos: -1,//当前购买蓝莓土地位置
        _dogAniType: 1,//当前狗狗类型 1~10
        _dressArr:[],//长度为5 物品类型 1~5  商店 工厂 树 宠物 留言板
        _berryTime: 0,//蓝莓成熟时间

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.setPlayerInfo();
        this.refreshInfo();

        //播放小动物动画
        // this.dogAnimationNode.
    },

    onEnable () {
        if(cc.props.isOpenWx){
            this.showAddGoldBtn();
        }

        this.addBtn.on('click',this.showAddGoldBtnCallBack,this);
    },

    onDisable () {
        this.addBtn.off('click',this.showAddGoldBtnCallBack,this);
    },

    start () {
      if(cc.props.isOpenWx){
        wx.getSystemInfo({
            success (res) {
              console.log(res.model)
              console.log(res.pixelRatio)
              console.log(res.windowWidth)
              console.log(res.windowHeight)
              console.log(res.language)
              console.log(res.version)
              console.log(res.platform)
            }
          })
        }
    },

    onDestroy() {
        console.log('scene destroy ');
        cc.game.removePersistRootNode(userInfoNode);// 释放常驻节点
    },

    /**
     * 设置按钮点击事件
     * @param {cc.Node} btnNode 要设置的按钮
     * @param {Boolean} isClick 是否可点击
     * @param {function} callBack 按钮回调
     **/
    _setBtnClick (btnNode,isClick,callBack) {
        if(isClick){
            if(btnNode.hasEventListener('click')){
                btnNode.off('click'); 
            }
            btnNode.on('click', callBack ,this);

        }else{
            btnNode.off('click', callBack , this);    
        }
        
    },

    /**
     *  刷新货币信息 和 土地信息
     **/
    refreshInfo () {
        this.sendData('POST','ReqGetUserInfo','openId='+cc.props.openId);
        this.sendData('POST','RepGetLandInfo','openId='+cc.props.openId);
    },

    /**
     * 刷新农场庄稼
     * @param {Array} landInfoArr 土地信息数组
     */ 
    refreshLandItems (landInfoArrObj) {
        let buySeedCallBack = this._buySeedCallBack.bind(this);
        let buyLandCallBack = this._buyLandCallBack.bind(this);
        let getFruitCallBack = this._getFruitCallBack.bind(this);

        for(let m = 1 ; m <= 24; m++){
            let landItemNodeName = 'landItem_' + m;
            let landItem = this.landArrNode.getChildByName(landItemNodeName);

            landItem.getComponent('landmanage').setLandItemState(landInfoArrObj[m - 1],
                buySeedCallBack,buyLandCallBack,getFruitCallBack,this._berryTime);
        }
    },

    /**
     *  点击购买种子回调
     *  */
    _buySeedCallBack (pos) {
        console.log('点击购买种子回调 _plantPos is ',pos);
        cc.audioEngine.play(this.okAudio, false, 1);//播放音效
        this._curBuyBerryPos = pos;
        this._showBuyBerryWindow(true);//显示购买窗口
        
        // this.sendData('POST','ReqBuyBuleBerry','openId=1&pos='+pos);
    },
    
    /**
     *  点击购买土地回调
     *  */
    _buyLandCallBack (pos) {
        cc.audioEngine.play(this.okAudio, false, 1);//播放音效
        console.log('点击购买土地回调 111_plantPos is ',pos);
        this.sendData('POST','GetUnLockLandInfo','openId='+cc.props.openId);
        // this.uiNode.active = true;
        // this.uiNode.getChildByName('buyLandNode').active = true;        
    },

    /**
     *  点击收货回调
     *  */
    _getFruitCallBack (pos) {
        console.log('点击收货回调 _plantPos is ',pos); 
        cc.audioEngine.play(this.okAudio, false, 1);//播放音效
        this.sendData('POST','ReqGetBuleBerry','openId='+cc.props.openId+'&pos=' + pos);   
    },

    /**
     *  显示购买土地窗口
     * @param {Number} level
     * @param {Boolean} isShow true为显示 false为关闭
     **/ 
    _showBuyLandWindow (level,isShow) {
        if(isShow){
            this.uiNode.active = true;
            let buyLandNode = this.uiNode.getChildByName('buyLandNode');        
            buyLandNode.active = true;  
            this.buyLandNode = buyLandNode;

            let detailLabel = buyLandNode.getChildByName('detailLabel');     
            detailLabel.getComponent(cc.Label).string =  "等级到达"+level+"级后可解锁新的可种植土地，\n或者花费"+ this._landPrice +"金币直接解锁。"
            let closeBtn = buyLandNode.getChildByName('closeBtn');
            this._setBtnClick(closeBtn,true,function(){
                this.buyLandNode.active = false;
                this.uiNode.active = false;
                cc.audioEngine.play(this.cancelAudio, false, 1);//播放音效
            });

            let unlockBtn = buyLandNode.getChildByName('unlockBtn');
    
            //判断金币是否可以购买
            if(cc.props.userInfo.money < this._landPrice){
                buyLandNode.getChildByName('noticeLabel').active = true;
                unlockBtn.getComponent(cc.Button).interactable = false;
            }else{
                buyLandNode.getChildByName('noticeLabel').active = false;
                unlockBtn.getComponent(cc.Button).interactable = true;
              
                this._setBtnClick(unlockBtn,true,this._unlockBtnTouckCallBack);
            }
        }else{
            this.uiNode.active = false;
            if(this.buyLandNode){
                this.buyLandNode.active = false;
            }
            // let buyLandNode = this.uiNode.getChildByName('buyLandNode');        
            // buyLandNode.active = false;  
        }


    },

    /**
     *  显示购买蓝莓幼苗窗口
     * @param {Boolean} isShow true为显示 false为关闭
     **/ 
    _showBuyBerryWindow (isShow) {
        if(isShow){
            this.uiNode.active = true;
            let buyBerryNode = this.uiNode.getChildByName('buyBerryNode');        
            buyBerryNode.active = true;  
            this.buyBerryNode = buyBerryNode;
            buyBerryNode.getChildByName('itemFrame').getChildByName('berryPrice').getComponent(cc.Label).string = this._blueBerryPrice;

            let detailLabel = buyBerryNode.getChildByName('detailLabel');     
            detailLabel.getComponent(cc.Label).string =  "购买蓝莓幼苗需要花费" + this._blueBerryPrice + "珍想钻石";
            let closeBtn = buyBerryNode.getChildByName('closeBtn');
            this._setBtnClick(closeBtn,true,function(){
                this.buyBerryNode.active = false;
                this.uiNode.active = false;
                cc.audioEngine.play(this.cancelAudio, false, 1);//播放音效
            });
            let buyBtn = buyBerryNode.getChildByName('buyBtn');
    
            //判断金币是否可以购买
            if(cc.props.userInfo.money < this._blueBerryPrice){
                buyBerryNode.getChildByName('noticeLabel').active = true;
                buyBtn.getComponent(cc.Button).interactable = false;
            }else{
                buyBerryNode.getChildByName('noticeLabel').active = false;
                buyBtn.getComponent(cc.Button).interactable = true;

                this._setBtnClick(buyBtn,true,this._buyBerryTouckCallBack);
            }
        }else{
            this.uiNode.active = false;
            if (this.buyBerryNode) {
                this.buyBerryNode.active = false;
            }
            // let buyBerryNode = this.uiNode.getChildByName('buyBerryNode');        
            // buyBerryNode.active = false;  
        }


    },

    //购买蓝莓幼苗按钮回调
    _buyBerryTouckCallBack () {
        console.log('_buyBerryTouckCallBack');
        this._showNoticeWindow('buyBerry',true);
        cc.audioEngine.play(this.okAudio, false, 1);//播放音效
    },

    //解锁土地按钮回调
    _unlockBtnTouckCallBack () {
        console.log('111111111111111');
        this._showNoticeWindow('unlockLand',true);
        cc.audioEngine.play(this.okAudio, false, 1);//播放音效

    },
    /**
     * 显示确认信息
     * @param {String} type 确认窗口类型
     * @param {Boolean} isShow 若为true则显示 false则关闭
     * @param {Object} data 额外数据
     */
    _showNoticeWindow (type,isShow,data){
        if(isShow){
            this.confirmLayer.active = true;
            let noticeDetailStr = '';
            let confirmNode = this.confirmLayer.getChildByName('confirmNode');
            let confirmDetails = confirmNode.getChildByName('confirmDetails');
            let confirmBtn = confirmNode.getChildByName('confirmBtn');
            let cancelBtn = confirmNode.getChildByName('cancelBtn');
            // cancelBtn.on('click',(function(){
            //     this.confirmLayer.active = false;
            // }).bind(this));
            this._setBtnClick(cancelBtn,true,(function(){
                this.confirmLayer.active = false;
                cc.audioEngine.play(this.cancelAudio, false, 1);//播放音效
            }));

    
            if(type == 'unlockLand'){//解锁土地弹窗
                noticeDetailStr = '确定花费'+ this._landPrice +'珍想钻石，解锁新的可种植土地？'
                // confirmBtn.on('click',(function(){
                //     this.sendData('POST','ReqUnLockLand','openId=1');
                // }).bind(this));
                this._setBtnClick(confirmBtn,true,(function(){
                    this.sendData('POST','ReqUnLockLand','openId=' + cc.props.openId);
                    cc.audioEngine.play(this.okAudio, false, 1);//播放音效
                }));

                confirmDetails.getComponent(cc.Label).string = noticeDetailStr;
            }else if(type == 'buyBerry'){//购买蓝莓种子
                noticeDetailStr = '确定花费'+ this._blueBerryPrice +'珍想钻石, 种植蓝莓幼苗？'

                this._setBtnClick(confirmBtn,true,(function(){
                    this.sendData('POST','ReqBuyBuleBerry','openId='+ cc.props.openId+'&pos='+this._curBuyBerryPos);
                    cc.audioEngine.play(this.okAudio, false, 1);//播放音效
                }));

                confirmDetails.getComponent(cc.Label).string = noticeDetailStr;
            }else if(type == 'errCode'){ //错误码                
                if(errCodeArr[data.errCode]){
                    noticeDetailStr = errCodeArr[data.errCode];//@todo 可能有问题
                }else{
                    noticeDetailStr = '参数错误';
                }
                
                this._setBtnClick(confirmBtn,true,(function(){
                    this.confirmLayer.active = false;
                    cc.audioEngine.play(this.okAudio, false, 1);//播放音效
                }));

                confirmDetails.getComponent(cc.Label).string = noticeDetailStr;
            }else if(type == 'buyDress'){ //购买皮肤                
                noticeDetailStr = "确定花费"+ data.price +"金币,解锁这个外观?"

                //this.sendData('POST','ReqBuyDress','openId=' + cc.props.openId + '&type=' + (this._type - 1) + '&kind=' + (this._kind - 1));
                this._setBtnClick(confirmBtn,true,(function(){
                    this.sendData('POST','ReqBuyDress','openId=' + cc.props.openId + '&type=' + (data.type - 1) + '&kind=' + (data.kind - 1));                   
                    cc.audioEngine.play(this.okAudio, false, 1);//播放音效
                }));

                confirmDetails.getComponent(cc.Label).string = noticeDetailStr;
            }
        }else{
            this.confirmLayer.active = false;
        }

    },

    /**
     * 设置玩家信息 头像 名字 等级
     * */ 

    setPlayerInfo () {
            let userInfoNode = cc.find('UserInfoNode');//获取场景常驻节点
            let userInfo = userInfoNode.getComponent('userInfo').getUserInfo();//获取玩家信息
            
            this._setPlayerName(userInfo.userName);//设置名字
            if(cc.props.isOpenWx){
               this._setPlayerAvatar(userInfo.userAvatar);//设置玩家头像 
            }
                    
    },

    /**
     * 设置玩家名字
     * @param {String} nameStr 玩家名字
     * */
    _setPlayerName (nameStr) {
        this.playerName.string = nameStr;//设置名字
    },

    /**
     * 设置玩家头像
     * @param {String} avatarStr 玩家头像的url
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
     * 设置玩家等级
     * @param {String} level 玩家等级
     * */    
    _setPlayerLevel (level) {
        this.playerLevel.string = level;
    },

    /**
     * 设置玩家经验
     * @param {Number} curExp 玩家当前经验
     * @param {Number} tolExp 玩家升级经验
     * */    
    _setPlayerExp (curExp, tolExp) {
        this.playerExp.string = curExp + '/' + tolExp;

        let expProgress = curExp / tolExp;
        this.playerBar.progress = expProgress;
        
    },
    /**
     * 设置玩家金币
     * @param {Number} money 玩家当前金币
     * */    
    _setPlayerMoney (money) {
        this.playerMoneyLabel.string = money;
    
    },
    /**
     * 设置玩家蓝莓数量
     * @param {Number} berryNum 玩家当前蓝莓
     * */    
    _setPlayerBerry (berryNum) {
        this.playerBerryLabel.string = berryNum;
    
    },

    /**
     * 刷新 装饰
     * @param {Array} dressArr
     */
    refreshDress (dressArr) {
        for(let i = 0 ; i < 5 ;i++){
            this._setOrnament(i + 1 ,dressArr[i] + 1); 
        }
    },

    /**
     *  更换装饰
     *  @param {Number} type 装饰类型 1~5  商店 工厂 树 宠物 留言板 
     *  @param {Number} level 装饰等级 1~10
     */
    _setOrnament (type , level){
        let picNode = null;

        if (type == 1){
            picNode = this.shopNode;
        }else if (type == 2) {
            picNode = this.factoryNode;     
        }else if (type == 3) {
            picNode = this.treeNode; 
        }else if (type == 4) {            
            picNode = this.dogHouseNode;
            this._dogAniType = level;
            this.showDogAnimation();

        }else if (type == 5) {
            picNode = this.boardNode;
        }
        
        picNode.getComponent('dressItem').setOrnament(type , level);

    },

    /**
     * 上传微信数据
     * 
     */
    setWXData () {
        let tolBerry = String(cc.props.userInfo.tolBerry);//;
        let tolMoney = String(cc.props.userInfo.tolMoney);//;
        let level = String(cc.props.userInfo.level);//;
        console.log('setWXData  tolBerry is ',tolBerry);
        console.log('setWXData tolMoney is ',tolMoney);
        console.log('setWXData level is ',level);
        wx.setUserCloudStorage(
            {
                KVDataList:[{key:"tolBlueBerry", value: tolBerry},
                {key:"tolMoney", value: tolMoney},
                {key:"level", value: level}],
                success: (res) =>
                {
                    console.log("setUserCloudStorage   success!");
                },
                fail: (res) =>
                {
                    console.log("setUserCloudStorage fail!");
                },
                complete: (res) =>
                {   
                    console.log("setUserCloudStorage complete!");
                }
            });
    },  


    /**
     * 发送网络数据给服务器
     * @param {String} type 'POST','GET'
     * @param {String} name ReqGetUserInfo
     * @param {String} data 'openId=1'
     */
    sendData (type, name, data) {
        console.log('发送网络请求 ',name);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open(type, cc.props.server + '/api/' + name); //'http://test.mayphant.com/api/ReqGetUserInfo'
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");        
        if (data) {
            xhr.send(data);
        }else{
            xhr.send();
        }
        
        this.setParseData (xhr,name);
        this.showLoading(true);
    },

    /**
     * 解析服务器返回的数据
     *  
     */
    setParseData (xhr,name) {
        xhr.onreadystatechange = (function () {
            if (xhr.readyState == 4) {
                this.showLoading(false);
                if(xhr.status == 200){
                    console.log('接收请求 ',name);
                    console.log('xhr.responseText is ',xhr.responseText);
                    let status_code = JSON.parse(xhr.responseText).status_code;
                    if(status_code == 200){
                        if (name == 'ReqGetUserInfo') { //获取玩家信息
                            let data = JSON.parse(xhr.responseText).data[0];
                            this._blueBerryPrice = data.bluePrice;//设置蓝莓价格
                            this._landPrice = data.landCost;//设置土地价格
                            this._getBlueBerryNum = data.blueNum;//设置每次摘取蓝莓数量
                            this._berryTime = data.berryTime;//设置蓝莓成熟时间
                            this.refreshDress(data.dressArr);
                            this._upDateUserInfo(data.level, data.curExp, data.tolExp, data.money, data.blueBerry,data.integral_history,data.blueberry_sum_history);//更新玩家信息
                        
                        }else if (name == 'RepGetLandInfo') { //获取土地信息
                            let data = JSON.parse(xhr.responseText).data;
                            this.refreshLandItems(data);
    
                        }else if (name == 'GetUnLockLandInfo') { //获取解锁土地信息
                            let level = JSON.parse(xhr.responseText).data[0].level;
                            this._showBuyLandWindow(level,true);
    
                        }else if (name == 'ReqUnLockLand') { //获取解锁土地
                            //关闭UI弹窗
                            this._showNoticeWindow('unlockLand',false);
                            this._showBuyLandWindow(null,false);
                            this.refreshInfo();//刷新信息
                        }else if (name == 'ReqBuyBuleBerry') { //购买蓝莓种子种植蓝莓
                            // //关闭UI弹窗
                            this._showNoticeWindow('buyBerry',false);
                            this._showBuyBerryWindow(false);
                            this.refreshInfo();//刷新信息
                        }else if (name == 'ReqGetBuleBerry'){//收货蓝莓种子
                            //显示摘取动画
                            let data = JSON.parse(xhr.responseText).data[0];
                            let pos = data.pos;
                            this.showGetBerryAction(pos)

                            let landItem = this.landArrNode.getChildByName("landItem_" + (data.pos+1));
                            landItem.getComponent('landmanage').clearLandTimeout();

                            //刷新信息
                            this.refreshInfo();
                            //判断是否升级
                            if(data.isLevelUp){
                                this.showLevelUpWindow(data.isUnLockLand,data.money);
                            }
                        
                        }else if (name == 'ReqGetShopInfo'){//获取商店商品信息
                            this.uiNode.getChildByName('shopNode').getComponent('shopManager').setParseData(xhr,name);
                        
                        }else if (name == 'ReqBuyDress'){//购买商店皮肤
                            this.uiNode.getChildByName('shopNode').getComponent('shopManager').setParseData(xhr,name);
                            this.confirmLayer.active = false;
                            this.sendData('POST','ReqGetUserInfo','openId='+cc.props.openId);//刷新个人信息
                            //@todo 显示购买成功弹窗

                        }else if (name == 'ReqSetDress'){//更换皮肤
                            this.uiNode.getChildByName('shopNode').getComponent('shopManager').setParseData(xhr,name);                            

                            let type =  JSON.parse(xhr.responseText).type;
                            let kind =  JSON.parse(xhr.responseText).kind;
                            this._setOrnament(type + 1, kind + 1);

                        }else if (name == 'ReqGetFactoryInfo'){//获取工厂信息
                            this.uiNode.getChildByName('factoryNode').getComponent('factory').setParseData(xhr,name);
                            this.refreshInfo();//刷新信息

                        }else if (name == 'ReqMakeBerry'){//生产罐头
                            this.uiNode.getChildByName('factoryNode').getComponent('factory').setParseData(xhr,name);
                        
                        }else if (name == 'ReqMakeBerryNow'){//立即完成
                            this.uiNode.getChildByName('factoryNode').getComponent('factory').setParseData(xhr,name);
                        
                        }else if (name == 'ReqFillInfo'){//提交收货信息
                            this.uiNode.getChildByName('adressNode').getComponent('address').setParseData(xhr,name);
                        
                        }                 
                        else{
    
                        }   
                        
                        console.log('请求成功');
                    }else{
                        this._showNoticeWindow('errCode',true,{"errCode":status_code});
                        console.log('请求失败');
                    }

                }else{
                    console.log('通信请求失败');
                }
            }
        }).bind(this);
    },

    /**
     * 更新玩家信息
     * 
     */
    _upDateUserInfo (level,curExp,tolExp,money,blueBerry,tolMoney,tolBerry) {
        if(level){
            cc.props.userInfo.level = level;
        }
        if(curExp){
            cc.props.userInfo.curExp = curExp;
        }
        if(tolExp){
            cc.props.userInfo.tolExp = tolExp;
        }
        if(money){
            cc.props.userInfo.money = money;
        }
        if(blueBerry){
            cc.props.userInfo.blueBerry = blueBerry;
        }
        if(tolMoney){
            cc.props.userInfo.tolMoney = tolMoney;
        }
        if(tolBerry){
            cc.props.userInfo.tolBerry = tolBerry;
        }

        this._setPlayerLevel(level); 
        this._setPlayerExp(curExp,tolExp);
        this._setPlayerMoney(money);
        this._setPlayerBerry(blueBerry);

        if(cc.props.isOpenWx){ //上传玩家数据
            this.setWXData();
        }
    },


    /**
     * 显示loading界面 
     * @param {Boolean} isShow 为true则显示 false则关闭
     */
    showLoading (isShow) {
        let loadingLayer = cc.find('Canvas/loadingLayer');
        loadingLayer.active = isShow;
        let loadingIcon = loadingLayer.getChildByName('loadingIcon');

        if(isShow){
            let action = cc.repeatForever(cc.rotateBy(1.3,360));
            loadingIcon.runAction(action);
        }else{
            loadingIcon.stopAllActions();
        }
    },

    /**
     * 显示摘取蓝莓动画
     * @param {Number} pos 蓝莓所在土地位置
     */
    showGetBerryAction (pos){
        let landItemNodeName = 'landItem_' + (pos + 1);
        let landItem = this.landArrNode.getChildByName(landItemNodeName);
        let landItemPos = landItem.getPosition();
        
        var prefab = cc.instantiate(this.getBerryItem);
        prefab.parent = this.node;
        prefab.position = {x:landItemPos.x,y:landItemPos.y + 20};
        prefab.getChildByName('berryNum').getComponent(cc.Label).string = '+' + this._getBlueBerryNum;
        // this._getBlueBerryNum

        let sequence1 = cc.sequence(
            cc.moveBy(0.7, cc.v2(0, 100)),     
            cc.fadeOut(0.3),  
            cc.removeSelf(true),
        );

        prefab.runAction(sequence1);
    },

    /**
     * 显示狗狗动画 每10秒播放一次
     * @param {Number} type 狗狗类型 1~10
     */
    showDogAnimation () {
        // let startAni = function(){
            this.dogAnimationNode.play('dog'+this._dogAniType);
        //     setTimeout(startAni,1000*5);
        // }.bind(this);

        // setTimeout(startAni,1000); 
    },

    /**
     * 显示升级界面 
     * @param {Boolean}  isLand 是否赠予土地  
     * @param {Number} money 是否赠予金币
     */
    showLevelUpWindow (isLand,money) {
        this.uiNode.active = true;
        this.levelUpNode.active = true;
        this.levelUpNode.getComponent('levelUp').setLevelUpWindow(isLand,money);
    },

    /**
     * 显示购买钻石按钮
     * 
     */
    showAddGoldBtn () {
        let self = this;
        wx.getSystemInfo({
            success (res) {
              console.log(res.model)
              console.log(res.pixelRatio)
              console.log(res.windowWidth)
              console.log(res.windowHeight)
              console.log(res.language)
              console.log(res.version)
              console.log(res.platform)
               
              if (res.platform == 'android') {
                self.addBtn.active = true
              }else{
                self.addBtn.active = false
              }
            //   self.label.string = res.platform;
            }
          })
    },

    /**
     * 添加钻石按钮回调 
     */
    showAddGoldBtnCallBack () {
        console.log('!!!!!!!!!!');
        this.uiNode.active = true;
        this.uiNode.getChildByName('goldShopNode').active = true;
    }

    // update (dt) {},
});
