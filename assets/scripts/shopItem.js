/**
 * 商店物品  
 */
const itemPicName = ['shop','factory','tree','dogHouse','board'];
const itemPicScale = [0.25, 0.3, 0.35, 0.5, 0.5];
cc.Class({
    extends: cc.Component,

    properties: {
        itemPic: cc.Sprite,//商品图片
        itemBtn: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    onEnable () {
        console.log('onEnable');
        this.node.on('click',this._shopItemClickCallBack,this);
        this.node.getChildByName('statePic').on('click',this._changeBtnCallBack,this);
        
    },

    onDisable (){
        console.log('onDisable  ');        
        this.node.off('click',this._shopItemClickCallBack,this);
        this.node.getChildByName('statePic').off('click',this._changeBtnCallBack,this);
        
    },
    // onLoad () {},

    start () {

    },

    /**
     * 设置商店物品
     * @param {Number} type 物品类型 1~5  商店 工厂 树 宠物 留言板
     * @param {Number} state 是否已购买 1~3 1为未购买 2为已购买未使用 3为使用中 
     * @param {Number} kind 物品位置 1~10
     * @param {Number} price 物品价格 可为空
     */
    setShopItem (type,state,kind,price) {
      this._type = type;
      this._state = state;
      this._kind = kind;
      this._price = price;

      //设置商品图片
      let shopItemSprite = 'building/' + itemPicName[type - 1] + kind;

      this.itemPic.node.scale = itemPicScale[type - 1];
      
      cc.loader.loadRes(shopItemSprite, cc.SpriteFrame, (function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            this.itemPic.getComponent('cc.Sprite').spriteFrame = spriteFrame
      }).bind(this)); 

      //设置商品状态
      if (state == 1 ) { //未购买
        this.node.getChildByName('blackFrame').active = true;
        this.node.getChildByName('lockIcon').active = true;
        this.node.getChildByName('berryPic').active = true;
        let priceNode = this.node.getChildByName('price');//.active = true;
        this.node.getChildByName('statePic').active = false;

        //设置价格
        priceNode.active = true;
        priceNode.getComponent(cc.Label).string = price;

        //设置商品按钮可用
        this.node.getComponent('cc.Button').enabled = true;

        //设置状态按钮不可用
        this.node.getChildByName('statePic').getComponent('cc.Button').enabled = false;

      }else {
        this.node.getChildByName('blackFrame').active = false;
        this.node.getChildByName('lockIcon').active = false;
        this.node.getChildByName('berryPic').active = false;
        this.node.getChildByName('price').active = false;
        this.node.getChildByName('statePic').active = true;

        //设置商品按钮不可用
        this.node.getComponent('cc.Button').enabled = false;

        //@todo 设置按钮响应函数

        let stateSprite =  'ui/usingIcon';
        if(state == 2 ) { //已购买未使用
            stateSprite = 'ui/changeIcon';
            //设置状态按钮可用
            this.node.getChildByName('statePic').getComponent('cc.Button').enabled = true;
        }else if (state == 3) { //使用中 
            //设置状态按钮不可用
            this.node.getChildByName('statePic').getComponent('cc.Button').enabled = false;
        }
        
    
        cc.loader.loadRes(stateSprite, cc.SpriteFrame, (function (err, spriteFrame) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                this.node.getChildByName('statePic').getComponent(cc.Sprite).spriteFrame = spriteFrame
        }).bind(this)); 
      }

      this.node.active = true;

    },

    /**
     * 商品点击回调 
     * 
     */
    _shopItemClickCallBack () {
        console.log('_shopItemClickCallBack 111111111');
        if(this._state == 1){//未购买        
            let data = {
                'type': this._type,
                'kind': this._kind,
                'price': this._price,
            };
            cc.director.getScene().getChildByName('Canvas').getComponent('farmScene')._showNoticeWindow('buyDress',true, data);
            // this.sendData('POST','ReqBuyDress','openId=' + cc.props.openId + '&type=' + (this._type - 1) + '&kind=' + (this._kind - 1));
        }
    },

    /**
     * 更换皮肤按钮回调 
     */    
    _changeBtnCallBack () {
        this.sendData('POST','ReqSetDress','openId=' + cc.props.openId + '&type=' + (this._type - 1) + '&kind=' + (this._kind - 1));
    },
    
    // update (dt) {},
    /**
     * 发送网络数据给服务器
     * @param {String} type 'POST','GET'
     * @param {String} name ReqGetUserInfo
     * @param {String} data 'openId=1'
     */
    sendData (type, name, data) {
        cc.director.getScene().getChildByName('Canvas').getComponent('farmScene').sendData(type, name, data);
    },
});
