/**
 * 装饰管理 
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onEnable () {
        console.log('onEnable');
        // if(!cc.props.isOpenWx){
            this.node.on('click',this._showUI,this);
        // }
        
    },

    onDisable (){
        console.log('onDisable  ');
        // if(!cc.props.isOpenWx){
            this.node.off('click',this._showUI,this);
        // }
    },

    start () {

    },

    // update (dt) {},
     /**
     *  更换装饰
     *  @param {Number} type 装饰类型 物品类型 1~5  商店 工厂 树 宠物 留言板 
     *  @param {Number} level 装饰等级 1~10
     */
    setOrnament (type , level){
        let ornamentPic = null;
        this.dressType = type;
        if (type == 1){
            ornamentPic = 'building/shop' + level;
        }else if (type == 2) {
            ornamentPic = 'building/factory' + level;
        }else if (type == 3) {
            ornamentPic = 'building/tree' + level;
        }else if (type == 4) {
            ornamentPic = 'building/dogHouse' + level;
        }else if (type == 5) {
            ornamentPic = 'building/board' + level;
        }

        cc.loader.loadRes(ornamentPic, cc.SpriteFrame, (function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            
            this.node.getComponent('cc.Sprite').spriteFrame = spriteFrame
        }).bind(this));  
            
    },

    _showUI() {
        cc.find('Canvas/UINode').active = true;

        if(this.dressType == 1){//商店
            cc.find('Canvas/UINode/shopNode').active = true;
        }else if(this.dressType == 2){//工厂
            cc.find('Canvas/UINode/factoryNode').active = true;
        }else if(this.dressType == 5){//排行榜
            cc.find('Canvas/UINode/rankNode').active = true;
        }
    }

});
