/**
 * 蓝莓工厂
 *  
 */
cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn : cc.Button,
        startBtn : cc.Button,
        timeLabel: cc.Label,
        ImBtn : cc.Button,
        adressBtn : cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable () {
        console.log('onEnable');
        this.closeBtn.node.on('click',this._closeBtnCallBack,this);
        this.startBtn.node.on('click',this._startBtnCallBack,this);
        this.ImBtn.node.on('click',this._imBtnCallBack,this);
        this.adressBtn.node.on('click',this._addressBtnCallBack,this);
        
        this.sendData('POST','ReqGetFactoryInfo','openId=' + cc.props.openId);//获取工厂信息
    },

    onDisable (){
        console.log('onDisable  ');
        this.closeBtn.node.off('click',this._closeBtnCallBack,this);
        this.startBtn.node.off('click',this._startBtnCallBack,this);
        this.ImBtn.node.off('click',this._imBtnCallBack,this);
        this.adressBtn.node.off('click',this._addressBtnCallBack,this);
    },

    // onLoad () {},

    start () {
        
    },

    _closeBtnCallBack() {
        console.log('press factory close');
        this.node.active = false;
        cc.find('Canvas/UINode').active = false;
    },

    _startBtnCallBack() {
        console.log('startBtn click!!!!!');        
        this.sendData('POST','ReqMakeBerry','openId=' + cc.props.openId);//开始生产罐头
    },

    _imBtnCallBack() {
        console.log('imBtn click!!!!!');
        this.sendData('POST','ReqMakeBerryNow','openId=' + cc.props.openId);//立即完成   
    },

    _addressBtnCallBack() {
        console.log('addressBtn click!!!!!');
        this.node.active = false;
        cc.find('Canvas/UINode/adressNode').active = true;
    },
    /**
     * 显示制作中界面 
     * @param {Number} price 立即完成价格
     * @param {Number} time 制作完成 时间戳
     */
    showWorking(price, time) {
        this.startBtn.node.active = false;//隐藏制作按钮
        
        //设置立即完成价格
        this.ImBtn.node.getChildByName('priceLabel').getComponent(cc.Label).string = price;

        //设置剩余时间    
        this._startCount(time);


        this.ImBtn.node.active = true;//显示立即完成按钮
        this.timeLabel.node.active = true;//显示剩余时间
    },

    /**
     * 显示开展制作界面      
     */
    showStart() {
        this.startBtn.node.active = true;//显示制作按钮

        this.ImBtn.node.active = false;//显示立即完成按钮
        this.timeLabel.node.active = false;//显示剩余时间
    },

    /**
     * 开启倒计时
     */
    _startCount (time) {
       console.log('_startCount  clearTimeOut');
    //    clearTimeout(this.startCountFunc)  
        this.startCountFunc = function(){
            let nowTime = new Date();
            let endTime = new Date(time * 1000);
            
            if (nowTime <= endTime ) {
                this.timeLabel.string = "制作中... " + this._getTimeStr(nowTime,endTime) + " 后完成"; 
                setTimeout(this.startCountFunc,1000);    
            }else{
                this.timeLabel.string = '00:00:00'; 
                this.showStart();
            }
        }.bind(this);

        setTimeout(this.startCountFunc,1000); 
    },

    /**
     *  获取倒计时时间
     *  @param {number} timestamp 庄稼成熟时间戳
     *  @return {String} timeStr 当前倒计时
     */
    _getTimeStr (nowTime,endTime) {
        let t = endTime.getTime() - nowTime.getTime();
        let hour=Math.floor(t/1000/60/60%24);
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
        return countDownTime;
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
    

   /**
     * 解析服务器返回的数据
     *  
     */
    setParseData (xhr,name){
        if (name == 'ReqGetFactoryInfo'){//获取商店商品信息
            let data = JSON.parse(xhr.responseText);
            
            let isWorking = data.data.isWorking;
            if(isWorking){//制作中
                this.node.getChildByName('numLabel').active = false;
                this.showWorking(data.data.priceNow, data.data.time);
            }else{//空闲
                this.showStart();
                this.node.getChildByName('numLabel').active = true;
                this.node.getChildByName('numLabel').getComponent(cc.Label).string = cc.props.userInfo.blueBerry + '/' + data.berryNum; 

            }

        } else if (name == 'ReqMakeBerry') {//生产蓝莓罐头
            this.sendData('POST','ReqGetFactoryInfo','openId=' + cc.props.openId);//获取工厂信息

        } else if (name == 'ReqMakeBerryNow') {//立即完成
            this.sendData('POST','ReqGetFactoryInfo','openId=' + cc.props.openId);//获取工厂信息
            clearTimeout(this.startCountFunc)  
        } else{

        }
    }
});
