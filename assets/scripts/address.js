/**
 * 填写收货信息 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn : cc.Button,//关闭按钮
        saveBtn : cc.Button,//保存按钮
        nameEditBox : cc.EditBox,//收货人姓名输入框
        phoneEditBox : cc.EditBox,//收货人手机号输入框
        addressEditBox : cc.EditBox,//收货人地址输入框
        nameErrLabel : cc.Label, //姓名错误提示
        phoneErrLabel : cc.Label,//手机错误提示
        addressErrLabel : cc.Label,//地址错误提示
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable () {
        console.log('onEnable');
        this.closeBtn.node.on('click',this._closeBtnCallBack,this);
        this.saveBtn.node.on('click',this._saveBtnCallBack,this);
        this._showBegin();
    },

    onDisable (){
        console.log('onDisable  ');
        this.closeBtn.node.off('click',this._closeBtnCallBack,this);
        this.saveBtn.node.on('click',this._saveBtnCallBack,this);
    },
    // onLoad () {
        
    // },

    start () {
        
    },

    _showBegin (){
        this.nameEditBox.string = "";
        this.phoneEditBox.string = "";
        this.addressEditBox.string = "";
        this.nameErrLabel.node.active = false;
        this.phoneErrLabel.node.active = false;
        this.addressErrLabel.node.active = false;
    },

    _closeBtnCallBack () {
        console.log('press factory close');
        this.node.active = false;
        cc.find('Canvas/UINode/factoryNode').active = true;
    },

    _saveBtnCallBack () {
        //检查信息是否有效
        if(this._checkValidInfo()){ //有效
            this.sendData('POST','ReqFillInfo','openId=' + cc.props.openId + '&name=' + this.nameEditBox.string + 
            '&phone=' + this.phoneEditBox.string + '&address=' + this.addressEditBox.string);//获取工厂信息
        }
        
    },


    _checkValidInfo () {
        let isValid = true;
        if(this.nameEditBox.string == ""){
            isValid = false;
            this.nameErrLabel.node.active = true;
        }else{
            this.nameErrLabel.node.active = false;
        }

        if(this.phoneEditBox.string == "" ){
            isValid = false;
            this.phoneErrLabel.node.active = true;
        }else if(this.phoneEditBox.string.length > 11){ 
            isValid = false;
            this.phoneErrLabel.node.active = true;
        }else{
            this.phoneErrLabel.node.active = false;
        }

        if(this.addressEditBox.string == ""){
            isValid = false;
            this.addressErrLabel.node.active = true;
        }else{
            this.addressErrLabel.node.active = false;
        }
        
        return isValid;
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
        if (name == 'ReqFillInfo'){//获取商店商品信息
            //@todo 弹窗提交成功
            this._closeBtnCallBack();
        } else{

        }
    }
    
});
