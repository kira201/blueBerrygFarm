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
        landTouchNode : cc.Node, //土地点击
        _plantState : landItemState.waste, //庄稼状态 0）'waste' 荒地 1)'blank' 空地 2)'seedling' 幼苗 3)'bearFruit' 结果 4)'maturity' 成熟
        _plantPos: cc.Integer,
        
        plantBar: {
            default: null,
            type: cc.ProgressBar,//玩家经验条
        },
        
        _berryTime: 0, //蓝莓成熟时间
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    // update (dt) {},
    /**
     * 设置庄稼状态
     * @param {Object} landInfo 庄稼信息
     * {
                "pos": 2,
                "state": 0,
                "time": ""
            }
     * */
    setLandItemState (landInfo,buySeedCallBack,buyLandCallBack,getFruitCallBack,berryTime) {
        if (landInfo) {
            // console.log('setLandItemState pos is ',landInfo.pos);
            this._plantPos = landInfo.pos //记录庄稼位置
        }

        this._plantState = landInfo.state;
        this._berryTime = berryTime;

        this._setLandPic(landInfo.state);//设置土地
        this._setPlantPic(landInfo.state);//设置庄稼
        this._setPlantTime(landInfo.state , landInfo.time);//设置庄稼时间

        this.buySeedCallBack = buySeedCallBack;
        this.buyLandCallBack = buyLandCallBack;
        this.getFruitCallBack = getFruitCallBack;
    },

    /**
     *  点击购买种子回调
     *  */
    _buySeedCallBack (button) {
        console.log('_plantPos is ',this._plantPos);
        this.buySeedCallBack(this._plantPos);
    },
    
    /**
     *  点击购买土地回调
     *  */
    _buyLandCallBack (button) {
        console.log('_plantPos is ',this._plantPos); 
        this.buyLandCallBack(this._plantPos); 
    },

    /**
     *  点击收货回调
     *  */
    _getFruitCallBack (button) {
        console.log('_plantPos is ',this._plantPos); 
        this.getFruitCallBack(this._plantPos);    
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
     *  设置土地图片
     *  @param {number} state landItemState
     */
    _setLandPic (state) {
        let landSprite = 'land_1';

        if (state == landItemState.waste) { //荒地 未购买 
            landSprite = 'land_2';
            // this.landPicNode.on('click', this._buyLandCallBack.bind(this));
            this._setBtnClick(this.landTouchNode,true,this._buyLandCallBack);
        }else if(state == landItemState.blank){ //空地 已购买 
            // this.landPicNode.on('click', this._buySeedCallBack.bind(this));
            this._setBtnClick(this.landTouchNode,true,this._buySeedCallBack);
        }else{
            // this.landPicNode.off('click', this._buySeedCallBack.bind(this));
            this._setBtnClick(this.landTouchNode,false,this._buySeedCallBack);
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
            plantSprite = 'lockIcon';
            this.plantPicNode.active = true;
            this.plantPicNode.getComponent('cc.Button').enabled = false;
            // this.plantPicNode.off('click', this._getFruitCallBack.bind(this));
            this._setBtnClick(this.plantPicNode,false,this._getFruitCallBack);

        }else if(state == landItemState.blank){ //空地 已购买 
            this.plantPicNode.active = false;
            // this.plantPicNode.off('click', this._getFruitCallBack.bind(this));
            this._setBtnClick(this.plantPicNode,false,this._getFruitCallBack);

        }else if(state == landItemState.seedling){ //幼苗 已购买 
            plantSprite = 'plant/plant1_1';
            this.plantPicNode.active = true;
            // this.plantPicNode.off('click', this._getFruitCallBack.bind(this));
            this._setBtnClick(this.plantPicNode,false,this._getFruitCallBack);

        }else if(state == landItemState.bearFruit){ //结果 已购买 
            plantSprite = 'plant/plant1_2';
            this.plantPicNode.active = true;
            // this.plantPicNode.off('click', this._getFruitCallBack.bind(this));
            this._setBtnClick(this.plantPicNode,false,this._getFruitCallBack);

        }else if(state == landItemState.maturity){ //成熟 已购买 
            plantSprite = 'plant/plant1_3';
            this.plantPicNode.active = true;
            this.plantPicNode.getComponent('cc.Button').enabled = true;
            // this.plantPicNode.on('click', this._getFruitCallBack.bind(this));
            this._setBtnClick(this.plantPicNode,true,this._getFruitCallBack);
        }
         
        console.log('this.plantPicNode.interactable  is ',this.plantPicNode.getComponent('cc.Button').interactable )

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
     *  @param {number} time 庄稼成熟时间戳
     */
    _setPlantTime (state ,time) {
        this.clearLandTimeout();
        if (state == landItemState.waste) { //荒地 未购买 
            this.plantTimeNode.node.active = false
            this.plantBar.node.active = false

        }else if(state == landItemState.blank){ //空地 已购买 
            this.plantTimeNode.node.active = false            
            this.plantBar.node.active = false

        }else if(state == landItemState.seedling){ //幼苗 
            this.plantTimeNode.node.active = true
            this.plantBar.node.active = true
            this._startCount(this.plantTimeNode , time);

        }else if(state == landItemState.bearFruit){ //结果  
            this.plantTimeNode.node.active = true
            this.plantBar.node.active = true
            this._startCount(this.plantTimeNode , time);
            
        }else if(state == landItemState.maturity){ //成熟  
            this.plantTimeNode.node.active = false
            this.plantBar.node.active = false
        }
        
    },

    /**
     * 开启倒计时
     */
    _startCount (labelNode, time) {
        // debugger
        let beginTime = new Date();
        let endTime = new Date(beginTime.getTime() + time * 1000 + 1000);

       this.startCount = function(){
            let nowTime = new Date();
            // let endTime = new Date(time * 1000);

            if (nowTime <= endTime ) {
                let timeInfo = this._getTimeStr(nowTime,endTime);
                labelNode.string = timeInfo.timeStr;
                let expProgress = timeInfo.percent;
                this.plantBar.progress = 1 - expProgress;
                
                setTimeout(this.startCount,1000);    
            }else{
                // if(this._plantState == 3){
                //     this.plantBar.progress = 1;
                //     labelNode.string = '00:00:00';
    
                //     this._setLandPic(landItemState.maturity);//设置土地
                //     this._setPlantPic(landItemState.maturity);//设置庄稼
                //     this._setPlantTime(landItemState.maturity , 0);//设置庄稼时间
                // }
                cc.director.getScene().getChildByName('Canvas').getComponent('farmScene').refreshInfo();
            }
        }.bind(this);

        setTimeout(this.startCount,1000); 
    },

    /**
     *  获取倒计时时间
     *  @param {number} timestamp 庄稼成熟时间戳
     *  @return {String} timeStr 当前倒计时
     */
    _getTimeStr (nowTime,endTime) {
        let t = endTime.getTime() - nowTime.getTime();
        let hour=Math.floor(t/1000/60/60);
        let min=Math.floor(t/1000/60%60);
        let sec=Math.floor(t/1000%60);

        if (hour < 10) {
             hour = "0" + hour;
        }
        if (min < 10) {
             min = "0" + min;
        }
        if (sec < 10) {
             sec = "0" + sec;
        }
        let countDownTime = hour + ":" + min + ":" + sec;
        let percent = (hour * 3600 + min * 60 + sec) / this._berryTime;

        return {
                'timeStr': countDownTime,
                'percent': percent};
    },

    //
    clearLandTimeout(){
        clearTimeout(this.startCount);
    }
    

});
