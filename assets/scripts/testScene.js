/**
 * 测试场景
*/

cc.Class({
    extends: cc.Component,

    properties: {
        prefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // let userInfoNode = cc.find('UserInfoNode');//测试常驻节点  是否释放

        // this.sendXHRAB();
        // this.testAction();
        this.testAnimation();
    },


    sendXHRAB: function () {
        console.log('test send');
        var xhr = cc.loader.getXMLHttpRequest();
        // this.streamXHREventsToLabel(xhr, this.xhrAB, this.xhrABResp, "POST");

        xhr.open("POST", "http://test.mayphant.com/api/ReqGetUserInfo");
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");        
        xhr.send('openId=1');
        // xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status >= 200 && xhr.status < 400){
                    console.log('xhr.responseText is ',xhr.responseText);
                    debugger
                    console.log('请求成功');
                }else{
                    console.log('请求失败');
                }
            }
        }

    },

    testAction: function () {
        var prefab = cc.instantiate(this.prefab);
        prefab.parent = this.node;

        let sequence1 = cc.sequence(
            cc.moveBy(0.7, cc.p(0, 300)),     
            cc.fadeOut(0.3),  
            cc.removeSelf(true),
        );

        prefab.runAction(sequence1);

    },

    testAnimation: function() {
        this._startCount();

    },

    _startCount (labelNode, time) {
        let startCount = function(){
            let dog = this.node.getChildByName('New Sprite');
            let dogAnim = dog.getComponent('cc.Animation');
            dogAnim.play('dog1');
            setTimeout(startCount,1000*10);
        }.bind(this);

        setTimeout(startCount,1000); 
    },
    
    // update (dt) {},
});
