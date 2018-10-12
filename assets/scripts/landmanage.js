/**
 *  庄稼管理
 */

const landItemState = {
    'waste' : 0,
    'blank' : 1,
    'seedling' : 2,
    'bearFruit' : 3,
    'maturity' : 4
};

cc.Class({
    extends: cc.Component,

    properties: {
        landPicNode : cc.Node, //土地图片
        plantPicNode : cc.Node, //土地图片
        plantTimeNode: cc.Label, //庄稼时间
        _plantState : landItemState.waste, //庄稼状态 0）'waste' 荒地 1)'blank' 空地 2)'seedling' 幼苗 3)'bearFruit' 结果 4)'maturity' 成熟
        _plantPos: cc.Integer,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    // update (dt) {},
    /**
     * 设置庄稼状态
     * @param {String} state 庄稼状态 
     * @param {Number} pos 庄稼位置
     * */
    setLandItemState (state , pos ) {
        if (pos) {
            console.log('setLandItemState pos is ',pos);
            this._plantPos = pos //记录庄稼位置
        }

        this._plantState = state

        this._setLandPic(state);//设置土地
        this._setPlantPic(state);//设置庄稼
        this._setPlantTime(state);//设置庄稼时间

        // if(state == landItemState.waste){//荒地
        //     console.log('state waste is ',state);
        //     this._setLandPic(state);//设置土地
        // }else if(state == landItemState.blank){//空地
        //     //土地可点击 播种 隐藏植物
        //     console.log('state blank is ',state);
        //     // debugger
        //     this._setLandPic(state);//设置土地
        //     // this.landPicNode.on('click', this._buySeedCallBack);
        //     // this.node.on('click', this._buySeedCallBack);
        // }else if (state == landItemState.seedling){//幼苗
        //     //不可点击 显示倒计时 显示植物
        //     this._setLandPic(state);//设置土地
        //     console.log('state seedling is ',state);
        // }else if (state == landItemState.bearFruit){//结果
        //     //不可点击 显示倒计时 显示植物
        //     this._setLandPic(state);//设置土地
        //     console.log('state bearFruit is ',state);
        // }else if (state == landItemState.maturity){//成熟
        //     //植物可点击 收取果实 显示植物
        //     this._setLandPic(state);//设置土地
        //     console.log('state maturity is ',state);
        // }
    },

    /**
     *  点击购买种子回调
     *  */
    _buySeedCallBack (button) {
        console.log('_plantPos is ',this._plantPos);
    },
    
    /**
     *  点击购买土地回调
     *  */
    _buyLandCallBack (button) {
        console.log('_plantPos is ',this._plantPos);    
    },

    /**
     *  点击收货回调
     *  */
    _getFruitCallBack (button) {
        console.log('_plantPos is ',this._plantPos);    
    },

    /**
     *  设置土地图片
     *  @param {number} state landItemState
     */
    _setLandPic (state) {
        let landSprite = 'land_1';

        if (state == landItemState.waste) { //荒地 未购买 
            landSprite = 'land_2';
            this.landPicNode.on('click', this._buyLandCallBack.bind(this));
        }else if(state == landItemState.blank){ //空地 已购买 
            this.landPicNode.on('click', this._buySeedCallBack.bind(this));
        }else{
            this.landPicNode.off('click', this._buySeedCallBack.bind(this));
        }

        cc.loader.loadRes(landSprite, cc.SpriteFrame, (function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            this.landPicNode.getComponent('cc.Sprite').spriteFrame = spriteFrame
        }).bind(this));       
        
    },

    /**
     *  设置庄稼图片
     *  @param {number} state landItemState
     */
    _setPlantPic (state) {
        let plantSprite = null;

        if (state == landItemState.waste) { //荒地 未购买 
            this.plantPicNode.active = false
            this.plantPicNode.off('click', this._getFruitCallBack.bind(this));

        }else if(state == landItemState.blank){ //空地 已购买 
            this.plantPicNode.active = false
            this.plantPicNode.off('click', this._getFruitCallBack.bind(this));

        }else if(state == landItemState.seedling){ //幼苗 已购买 
            plantSprite = 'plant/plant1_1'
            this.plantPicNode.active = true
            this.plantPicNode.off('click', this._getFruitCallBack.bind(this));

        }else if(state == landItemState.bearFruit){ //结果 已购买 
            plantSprite = 'plant/plant1_2'
            this.plantPicNode.active = true
            this.plantPicNode.off('click', this._getFruitCallBack.bind(this));

        }else if(state == landItemState.maturity){ //成熟 已购买 
            plantSprite = 'plant/plant1_3'
            this.plantPicNode.active = true
            this.plantPicNode.on('click', this._getFruitCallBack.bind(this));
        }
         
        if(plantSprite){
            cc.loader.loadRes(plantSprite, cc.SpriteFrame, (function (err, spriteFrame) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
    
                this.plantPicNode.getComponent('cc.Sprite').spriteFrame = spriteFrame
            }).bind(this)); 
        }   
        
    },
    
    /**
     *  设置庄稼成长时间
     *  @param {number} state landItemState
     */
    _setPlantTime (state) {
        if (state == landItemState.waste) { //荒地 未购买 
            this.plantTimeNode.node.active = false

        }else if(state == landItemState.blank){ //空地 已购买 
            this.plantTimeNode.node.active = false            

        }else if(state == landItemState.seedling){ //幼苗 已购买 
            this.plantTimeNode.node.active = true

        }else if(state == landItemState.bearFruit){ //结果 已购买 
            this.plantTimeNode.node.active = true
            
        }else if(state == landItemState.maturity){ //成熟 已购买 
            this.plantTimeNode.node.active = false
        }
         
        
    }
});
