/**
 * 排行榜 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn : cc.Button,
    },


    // LIFE-CYCLE CALLBACKS:
    onEnable () {
        console.log('onEnable');
        this.closeBtn.node.on('click',this._closeBtnCallBack,this);
        
        if(cc.props.isOpenWx){
            // 发消息给子域
            wx.postMessage({
                message: 'refresh'
            })
        }
        
    },

    onDisable (){
        console.log('onDisable  ');
        this.closeBtn.node.off('click',this._closeBtnCallBack,this);
    },

    // onLoad () {},

    start () {

    },

    _closeBtnCallBack() {
        console.log('press factory close');
        this.node.active = false;
        cc.find('Canvas/UINode').active = false;
    },
    
    // update (dt) {},
});
