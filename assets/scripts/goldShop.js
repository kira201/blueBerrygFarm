/**
 * 购买钻石 
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
        // debugger
        this.node.getChildByName('goldItem1').on('click',this._goldItemBtnCallBack1);
        this.node.getChildByName('goldItem2').on('click',this._goldItemBtnCallBack2);
        this.node.getChildByName('goldItem3').on('click',this._goldItemBtnCallBack3);
        this.node.getChildByName('goldItem4').on('click',this._goldItemBtnCallBack4);
        this.node.getChildByName('goldItem5').on('click',this._goldItemBtnCallBack5);
        this.node.getChildByName('goldItem6').on('click',this._goldItemBtnCallBack6);
    },

    onDisable (){
        console.log('onDisable  ');
        this.closeBtn.node.off('click',this._closeBtnCallBack,this);
        this.node.getChildByName('goldItem1').off('click',this._goldItemBtnCallBack1);
        this.node.getChildByName('goldItem2').off('click',this._goldItemBtnCallBack2);
        this.node.getChildByName('goldItem3').off('click',this._goldItemBtnCallBack3);
        this.node.getChildByName('goldItem4').off('click',this._goldItemBtnCallBack4);
        this.node.getChildByName('goldItem5').off('click',this._goldItemBtnCallBack5);
        this.node.getChildByName('goldItem6').off('click',this._goldItemBtnCallBack6);
      
    },
    // onLoad () {},

    start () {

    },

    _closeBtnCallBack() {
        console.log('press factory close');
        this.node.active = false;
        cc.find('Canvas/UINode').active = false;
    },

    _goldItemBtnCallBack1 () {
        console.log('********************');
        let pos = 1;
        console.log('btn click ',pos);

    },

    _goldItemBtnCallBack2 () {
        console.log('********************');
        let pos = 2;
        console.log('btn click ',pos);

    },

    _goldItemBtnCallBack3 () {
        console.log('********************');
        let pos = 3;
        console.log('btn click ',pos);

    },

    _goldItemBtnCallBack4() {
        console.log('********************');
        let pos = 4;
        console.log('btn click ',pos);

    },

    _goldItemBtnCallBack5() {
        console.log('********************');
        let pos = 5;
        console.log('btn click ',pos);

    },

    _goldItemBtnCallBack6() {
        console.log('********************');
        let pos = 6;
        console.log('btn click ',pos);

    },
    // update (dt) {},
});
