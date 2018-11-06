/**
 * 商店按钮
 */
cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Sprite,
        choosePic: cc.Sprite,
        _btnType : -1,//按钮类型 1~5
    },

    // onLoad () {},

    start () {

    },

    /**
     * 设置按钮
     * @param {Type} type 1~5按钮类型
     * @param {Function} callBack 按钮回调
     */
    setBtn (type,callBack) {
        this._btnType = type;
        this.btnCallBack = callBack;

        this._setBtnClick(this.node.getComponent('cc.Button').node,true,this._btnCallBack);
    },

    /**
     * @param {Boolean} isChoose true为选定 false为未选定 
     */
    setBtnState(isChoose){
        let bgSprite = 'ui/chooseBtn2';
        let textSprite = 'ui/btnText' + this._btnType + '_2';
        if (isChoose) {
            bgSprite = 'ui/chooseBtn';
            textSprite = 'ui/btnText' + this._btnType + '_1';
        }
        cc.loader.loadRes(bgSprite, cc.SpriteFrame, (function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            this.bg.getComponent('cc.Sprite').spriteFrame = spriteFrame
        }).bind(this));  

        cc.loader.loadRes(textSprite, cc.SpriteFrame, (function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            this.choosePic.getComponent('cc.Sprite').spriteFrame = spriteFrame
        }).bind(this)); 
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

    

    /*
    * 按钮点击回调
    */
    _btnCallBack () {
        console.log('shopBtn click !!!!!');
        this.btnCallBack(this._btnType);
    },

    // /**
    //  * 设置按钮回调
    //  * 
    //  */
    // setCallBack (callBack) {

    // }

    // update (dt) {},
});
