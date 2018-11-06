/**
 * 升级提示
 * 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        confirmBtn : cc.Button,
        landItemNode : cc.Node,
        moneyNode: cc.Node,
        moneyLabel: cc.Label,
        landPic: cc.Sprite,
        moneyPic: cc.Sprite,
        landLabel: cc.Label,
        okBtnAudio : {
            default: null,
            type: cc.AudioClip,
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable () {
        console.log('onEnable');
        this.confirmBtn.node.on('click',this._closeBtnCallBack,this);
    },

    onDisable (){
        console.log('onDisable  ');
        this.confirmBtn.node.off('click',this._closeBtnCallBack,this);
    },
    // onLoad () {},

    start () {

    },

    /**
     * 设置等级提升界面
     * @param {Boolean}  isLand 是否赠予土地  
     * @param {Number} money 是否赠予金币
     */
    setLevelUpWindow(isLand , money) {
        if(isLand){
            this.landPic.node.active = true;
            this.moneyPic.node.active = false;
            this.landLabel.node.active = true;
        }else{
            this.landPic.node.active = false;
            this.moneyPic.node.active = true;
            this.landLabel.node.active = false;
        }

        if(money){
            this.moneyLabel.string = money;
        }else{
            this.moneyNode.node.active = false;
        }
    },

    _closeBtnCallBack () {
        console.log('press factory close');
        cc.audioEngine.play(this.okBtnAudio, false, 1);

        this.node.active = false;
        cc.find('Canvas/UINode').active = false;
    }
    // update (dt) {},
});
