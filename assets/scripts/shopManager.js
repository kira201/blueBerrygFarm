/****
 * 商店管理
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // btnParentNode : cc.Node,
        closeBtn : cc.Button,
        shopFrame : cc.Node, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable () {
        console.log('onEnable');
        this.closeBtn.node.on('click',this._closeBtnCallBack,this);
        
        this.sendData('POST','ReqGetShopInfo','openId=' + cc.props.openId + '&type=0');//设置默认
        
    },

    onDisable (){
        console.log('onDisable  ');
        this.closeBtn.node.off('click',this._closeBtnCallBack,this);
    },

    start () {
        console.log('shopManager !!!!!');
        this.setTabBtn();
        
    },

    _closeBtnCallBack() {
        console.log('press shop close');
        this.node.active = false;
        cc.find('Canvas/UINode').active = false;
    },

    setTabBtn () {
        for ( let i = 1 ; i <= 5 ; i++) {
            let btnItemName = 'chooseBtn' + i;
            let btn = this.node.getChildByName(btnItemName);
            let tabBtnCallBack = this.tabBtnCallBack.bind(this);
            btn.getComponent('shopBtn').setBtn(i,tabBtnCallBack);
        }
    },

    tabBtnCallBack (pos) {
        console.log('tab btn click pos is ',pos);
        // this.refreshTabBtn(pos);
        this.sendData('POST','ReqGetShopInfo','openId=' + cc.props.openId + '&type=' + (pos - 1));//设置默认
    },

    /**
     * 刷新tab按钮显示
     * @param {Number} pos 当前选择的按钮 1~5
     */
    refreshTabBtn (pos) {
        for ( let i = 1 ; i <= 5 ; i++) {
            let btnItemName = 'chooseBtn' + i;
            let btn = this.node.getChildByName(btnItemName);
            let isChoose = false;
            let zIndex = 0;
            if(pos == i ){
                isChoose = true;
                zIndex = 2;
            }
            btn.getComponent('shopBtn').setBtnState(isChoose);
            btn.zIndex = zIndex;
            // btn.node.zIndex
        }

        this.showShopItemsByTab(pos);
    },

    /**
     * 根据商品类型 显示商品
     * @param {Number} type 商品类型 1~5
     */
    showShopItemsByTab (type) { 
        this._curType = type;//记录当前商品页

        for(let i = 1; i <= 10 ; i++){
            let shopItemNode = this.shopFrame.getChildByName('shopItem_' + i);
            let itemInfo = this._curShopItems[i-1];
            
            shopItemNode.getComponent('shopItem').setShopItem(type , itemInfo.state , itemInfo.kind + 1 , itemInfo.price); 

        }   
    },

    /**
     * 发送网络数据给服务器
     * @param {String} type 'POST','GET'
     * @param {String} name ReqGetUserInfo
     * @param {String} data 'openId=1'
     */
    sendData (type, name, data) {
        cc.director.getScene().getChildByName('Canvas').getComponent('farmScene').sendData(type, name, data);
    },
    

   /**
     * 解析服务器返回的数据
     *  
     */
    setParseData (xhr,name){
        if (name == 'ReqGetShopInfo'){//获取商店商品信息
            let type = JSON.parse(xhr.responseText).type;
            let shopItems = JSON.parse(xhr.responseText).shopItems;
            this._curShopItems = shopItems;

            let pos = Number(JSON.parse(xhr.responseText).type);//@todo 这里服务器传递的是字符串 需要转换成 数字
            this.refreshTabBtn(pos + 1);
        }else if (name == 'ReqBuyDress'){//购买商店皮肤
            if(JSON.parse(xhr.responseText).status_code == 200){//购买成功
                //刷新当前商城页面
                this.sendData('POST','ReqGetShopInfo','openId=' + cc.props.openId + '&type=' + (this._curType - 1));
            }

        
        }else if (name == 'ReqSetDress'){//购买商店皮肤
            if(JSON.parse(xhr.responseText).status_code == 200){//购买成功
                //刷新当前商城页面
                this.sendData('POST','ReqGetShopInfo','openId=' + cc.props.openId + '&type=' + (this._curType - 1));
            }

        }
        else{

        }
    }
    // update (dt) {},
});
