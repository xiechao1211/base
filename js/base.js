// 自定义js方法
var base_url = "http://www.baidu.com";
var port = 8080;

// 基于aui的提示信息框
var chToast = function () {
};
chToast.prototype = {
    create: function (params, callback) {
        var self = this;
        var toastHtml = '';
        switch (params.type) {
            case "success":
                var iconHtml = '<i class="aui-iconfont aui-icon-correct"></i>';
                break;
            case "fail":
                var iconHtml = '<i class="aui-iconfont aui-icon-close"></i>';
                break;
            case "custom":
                var iconHtml = params.html;
                break;
            case "loading":
                var iconHtml = '<div class="aui-toast-loading"></div>';
                break;
        }
        var titleHtml = params.title ? '<div class="aui-mask aui-mask-in"></div><div class="aui-toast-content">' + params.title + '</div>' : '';
        toastHtml = '<div class="aui-toast">' + iconHtml + titleHtml + '</div>';
        if (document.querySelector(".aui-toast")) return;
        document.body.insertAdjacentHTML('beforeend', toastHtml);
        var duration = params.duration ? params.duration : "2000";
        self.show();
        if (params.type == 'loading') {
            if (callback) {
                callback({
                    status: "success"
                });
            }
            ;
        } else {
            setTimeout(function () {
                self.hide();
            }, duration)
        }
    },
    show: function () {
        var self = this;
        document.querySelector(".aui-toast").style.display = "block";
        document.querySelector(".aui-toast").style.marginTop = "-" + Math.round(document.querySelector(".aui-toast").offsetHeight / 2) + "px";
        if (document.querySelector(".aui-toast")) return;
    },
    hide: function () {
        var self = this;
        if (document.querySelector(".aui-toast")) {
            document.querySelector(".aui-toast").parentNode.removeChild(document.querySelector(".aui-toast"));
        }
    },
    remove: function () {
        if (document.querySelector(".aui-dialog")) document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
        if (document.querySelector(".aui-mask")) {
            document.querySelector(".aui-mask").classList.remove("aui-mask-out");
        }
        return true;
    },
    success: function (params, callback) {
        var self = this;
        params.type = "success";
        return self.create(params, callback);
    },
    fail: function (params, callback) {
        var self = this;
        params.type = "fail";
        return self.create(params, callback);
    },
    custom: function (params, callback) {
        var self = this;
        params.type = "custom";
        return self.create(params, callback);
    },
    loading: function (params, callback) {
        var self = this;
        params.type = "loading";
        return self.create(params, callback);
    }
};
// 基于aui的提示确认框
var chAlert = function () {
};
chAlert.prototype = {
    params: {
        title: '',
        msg: '',
        buttons: ['取消', '确定'],
        input: false
    },
    create: function (params, callback) {
        var self = this;
        var dialogHtml = '';
        var buttonsHtml = '';
        var headerHtml = params.title ? '<div class="aui-dialog-header">' + params.title + '</div>' : '<div class="aui-dialog-header">' + self.params.title + '</div>';
        if (params.input) {
            params.text = params.text ? params.text : '';
            var msgHtml = '<div class="aui-dialog-body"><input type="text" placeholder="' + params.text + '"></div>';
        } else {
            var msgHtml = params.msg ? '<div class="aui-dialog-body">' + params.msg + '</div>' : '<div class="aui-dialog-body">' + self.params.msg + '</div>';
        }
        var buttons = params.buttons ? params.buttons : self.params.buttons;
        if (buttons && buttons.length > 0) {
            for (var i = 0; i < buttons.length; i++) {
                buttonsHtml += '<div class="aui-dialog-btn" tapmode button-index="' + i + '">' + buttons[i] + '</div>';
            }
        }
        var footerHtml = '<div class="aui-dialog-footer">' + buttonsHtml + '</div>';
        dialogHtml = '<div class="aui-dialog">' + headerHtml + msgHtml + footerHtml + '</div>';
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
        // listen buttons click
        var dialogButtons = document.querySelectorAll(".aui-dialog-btn");
        if (dialogButtons && dialogButtons.length > 0) {
            for (var ii = 0; ii < dialogButtons.length; ii++) {
                dialogButtons[ii].onclick = function () {
                    if (callback) {
                        if (params.input) {
                            callback({
                                buttonIndex: parseInt(this.getAttribute("button-index")) + 1,
                                text: document.querySelector("input").value
                            });
                        } else {
                            callback({
                                buttonIndex: parseInt(this.getAttribute("button-index")) + 1
                            });
                        }
                    }
                    ;
                    self.close();
                    return;
                }
            }
        }
        self.open();
    },
    open: function () {
        if (!document.querySelector(".aui-dialog")) return;
        var self = this;
        document.querySelector(".aui-dialog").style.marginTop = "-" + Math.round(document.querySelector(".aui-dialog").offsetHeight / 2) + "px";
        if (!document.querySelector(".aui-mask")) {
            var maskHtml = '<div class="aui-mask"></div>';
            document.body.insertAdjacentHTML('beforeend', maskHtml);
        }
        // document.querySelector(".aui-dialog").style.display = "block";
        setTimeout(function () {
            document.querySelector(".aui-dialog").classList.add("aui-dialog-in");
            document.querySelector(".aui-mask").classList.add("aui-mask-in");
            document.querySelector(".aui-dialog").classList.add("aui-dialog-in");
        }, 10)
        document.querySelector(".aui-mask").addEventListener("touchmove", function (e) {
            e.preventDefault();
        })
        document.querySelector(".aui-dialog").addEventListener("touchmove", function (e) {
            e.preventDefault();
        })
        return;
    },
    close: function () {
        var self = this;
        document.querySelector(".aui-mask").classList.remove("aui-mask-in");
        document.querySelector(".aui-dialog").classList.remove("aui-dialog-in");
        document.querySelector(".aui-dialog").classList.add("aui-dialog-out");
        if (document.querySelector(".aui-dialog:not(.aui-dialog-out)")) {
            setTimeout(function () {
                if (document.querySelector(".aui-dialog")) document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
                self.open();
                return true;
            }, 200)
        } else {
            document.querySelector(".aui-mask").classList.add("aui-mask-out");
            document.querySelector(".aui-dialog").addEventListener("webkitTransitionEnd", function () {
                self.remove();
            })
            document.querySelector(".aui-dialog").addEventListener("transitionend", function () {
                self.remove();
            })
        }
    },
    remove: function () {
        if (document.querySelector(".aui-dialog")) document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
        if (document.querySelector(".aui-mask")) {
            document.querySelector(".aui-mask").classList.remove("aui-mask-out");
        }
        return true;
    },
    alert: function (params, callback) {
        var self = this;
        return self.create(params, callback);
    },
    prompt: function (params, callback) {
        var self = this;
        params.input = true;
        return self.create(params, callback);
    }
};


var base = {
    // 自定义信息提示框
    showLoaderInfo:function (info) {
        $("div.pupInfo").remove(); $("div.pupBg").remove();
        $("body").append("<div class='pupBg aui-toast' style='display:block'><i class='aui-iconfont aui-icon-correct'></i><div class='pupInfo aui-toast-content'>" + info + "...</div></div>");

    },
    // 加载中
    showLoader : function () {
        $("div.pupInfo").remove(); $("div.pupBg").remove();$("div.aui-toast-loading").remove();
        $("body").append("<div class='aui-toast pupBg' style='display:block'><div class='aui-toast-loading'></div><div class='aui-toast-content'>加载中...</div>");
    },
    // 移除信息提示框
    hideLoader : function () {
        $("div.pupInfo").remove(); $("div.pupBg").remove();$("div.aui-toast-loading").remove();
    },
    //ajax方法封装
    ajax : function (option) {
        // 默认参数
        var defaults = {
            type: "get",
            url: '',
            dataType: "json",
            data: "",
            async: true,
            cache: true,
            success: function (result) {
            }
        };
        for (var set in option) {
            defaults[set] = option[set];
        };
        defaults.url = base_urls + defaults.url;
        console.log("URL"+defaults.url);
        console.log(JSON.stringify(defaults.data))
        $.ajax(defaults);
        defaults.error = function (XMLHttpRequest, textStatus, errorThrown) {
            base.showLoaderInfo("接口错误:"+JSON.stringify(XMLHttpRequest))
        };
    },

    //获取随机数
    getMathRand : function () {
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        return Num;
    },

    // 获得日期
    get_time : function () {
        var time = window.localStorage.getItem("time")
        if (time == null) time = GetDate(new Date());
        return time;
    },



    // 微信认证
    wxOauth : function () {
        window.localStorage.setItem("redirect_url", window.location.href);
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6ad1750a8def2e90&redirect_uri=" + base_url + "/app_wx/_oauto.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        window.location.href = url;
    }
}

var is = {
    mobile : function(val,state){
        state === false ? state = state : state = true;
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; // 手机
        var regs = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/; // 座机
        if( reg.test(val) ){
            return true;
        }else{
            if( state ){ return regs.test(val); } else { return false; }
        }
    },
    email : function(val){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(val);
    },
    idCar : function(val){
        val = String(val); // 转换为字符串格式
        var idCar_city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}; // 地址码
        var checkCode = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]; // 校验码 - 计算参数
        var lastCode = [1,0,'x',9,8,7,6,5,4,3,2]; // 校验码
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; // 有效性验证规则
        var len = val.length;
        function checkCodeCount(code){
            var sum = 0;
            for( var i=0; i<checkCode.length; i++ ){ sum += Number(val.split("")[i]) * checkCode[i]; }
            return lastCode[sum%11];
        }
        if( len == 15 ){
            val = val.substr(0,6)+"19"+val.substr(6,9);
            val += Number(checkCodeCount(val));
        }
        if( !reg.test(val) ) return {state:false,info:'格式错误'};
        if( !(val.substr(0,2) in idCar_city) ) return {state:false,info:'地址码不存在'};
        var date = new Date();
        var time = [date.getFullYear(),date.getMonth()+1,date.getDate()];
        var codeTime = [Number(val.substr(6,4)),Number(val.substr(10,2)),Number(val.substr(12,2))];
        for( var a=0; a<time.length; a++ ){ if (codeTime[a] > time[a] ) return {state:false,info:'出生日期错误'}; }
        if( checkCodeCount(val.substr(0,17)) !== Number( val.substr(-1,1) ) ) return {state:false,info:'校验码错误'};
        return {state : true, info : { city : idCar_city[val.substr(0,2)] , sex : val.substr(-2,1)%2 != 0 ? '男' : '女', birthday : val.substr(6,8) }};
    },
    defined : function (val) {
        if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof (value) == 'undefined') {
            return false;
        }
        else {
            value = value + "";
            value = value.replace(/\s/g, "");
            if (value == "") {
                return false;
            }
            return true;
        }
    },
    undefined : function( val,StrState,OAstate ){
        OAstate ? OAstate = true : OAstate = OAstate;
        if( StrState ){ var err = ['null','NULL','undefined','(null)','false','0']; if (err.indexOf(val) != -1 ) return false; }
        if(OAstate) { try { if (val.length === 0) { return false; } else { for (var i in val) { return true; } return false; } } catch (e) { } }
        try { return Boolean(val.trim()); } catch (e) { return Boolean(val); }
    },
    checked: function (va) { va = (va + "").toLocaleLowerCase(); if (va == "checked" || va == "true") return true; else return false; },
    enter: function () { return (event.keyCode == 13); },
};
// 字符串扩展方法
String.prototype = {
    trim : function(){ return this.replace(/(^\s*)|(\s*$)/g, ""); },
    ltrim : function(){ return this.replace(/(^\s*)/g,""); },
    rtrim : function(){ return this.replace(/(\s*$)/g,""); }
};
// 微信相关方法
//图片的链接放在数组里
var PhotosImg = [];
//上传微信图片（多张）
var PhotosState = false;
var weixin = {
    // 微信注册
    config : function () {
        $.ajax({
            type: "get",
            url: "/Public/Weixin_JsApiSign",
            data: { LocationUrl: location.href.split("#")[0] },
            success: function (data) {
                if (data.Result) {
                    var item = data.Data;
                    var jsapi_appId = item.appid;
                    var jsapi_timestamp = item.timestamp;
                    var jsapi_nonceStr = item.noncestr;
                    var jsapi_signature = item.signature;
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: jsapi_appId, // 必填，公众号的唯一标识
                        timestamp: jsapi_timestamp, // 必填，生成签名的时间戳
                        nonceStr: jsapi_nonceStr, // 必填，生成签名的随机串
                        signature: jsapi_signature,// 必填，签名，见附录1
                        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems',
                            'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice',
                            'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation',
                            'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
                        //['checkJsApi', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
                    });
                    wx.ready(function () {
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        callback();

                    });
                }
                else {
                    base.showLoaderInfo(data.ErrorInfor);
                }
            }
        })
    },
    // 获得微信openid
    getOpenId :  function () {
        var wxopenid = window.localStorage.getItem("wxopenid")
        if (wxopenid == null) wxopenid = "";

        if (wxopenid != "") {

            $.ajax({
                type: "post",
                async: false,
                url: "/WebService.asmx/_MemberWx",
                data: { key: key, id: get_uid(), openid: wxopenid },
                success: function (data) {

                    var b = $(data).find("boolean").text();
                    if (b == "false") {
                        wxopenid = "";
                        window.localStorage.setItem("key", "");
                        window.localStorage.setItem("uid", "0");
                        window.localStorage.setItem("phone", "");
                        window.localStorage.setItem("pwd", "");
                        window.localStorage.setItem("wxopenid", "");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("---------wxOauto------>" + textStatus + '--' + errorThrown);
                }
            })
        }
        return wxopenid;
},
    //微信支付-order
    pay  :  function (orderid, callback) {
        showLoaderPay();
        $.ajax({
            type: "post",
            url: "/App_Ashx/wxPay.ashx",
            data: { url: window.location.href, orderid: orderid, openid: weixin.getOopenId() },
            success: function (data) {
                if (data.indexOf("error") > -1) {
                    toastShow(data.replaceAll("error:", ""), 1000);
                    return;
                }
                var d = data.split('|');
                var jsapi_appId = d[0];
                var jsapi_timestamp = d[1];
                var jsapi_nonceStr = d[2];
                var jsapi_signature = d[3];
                var paypackage = d[4];
                var paySign = d[5];

                wx.chooseWXPay({
                    timestamp: jsapi_timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: jsapi_nonceStr, // 支付签名随机串，不长于 32 位
                    package: paypackage, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: paySign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        toastShow("谢谢你的购买！", 1000);
                        callback(orderid)
                    },
                    fail: function (res) {
                        toastShow("支付失败！请检查微信配置", 1000);
                        alert(JSON.stringify(res));
                    },
                    cancel: function (res) {

                        //支付取消
                        hideLoader();
                        toastShow("确定要取消吗！", 2000);
                    }
                });

            }
        })
    },
    // 微信扫描二维码
    scanQRCode : function (callback){
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                callback(result);
            }
        });
    },
    // 微信预览图片
    imgShow : function (obj) {
        var that = obj;
        var imgArr = [];
        var imgindex = 0;
        that.parent('.patentImg').find('.forImg').each(function(index, item) {
            var itemSrc = $(this).find('img').attr('src');
            imgArr.push(itemSrc);
            if($(this).find('img').attr('src')==that.find('.Imgsrc').attr('src')){
                imgindex = index;
            };
        });
        wx.previewImage({
            current: imgArr[imgindex],
            urls: imgArr
        });
    },
    // 微信上传单张图片
    uploadPhoto : function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                //得到选择后的图片ID
                var localId = res.localIds[0];
                sb_Writelog(JSON.stringify(res));
                wx.uploadImage({
                    localId: localId.toString(),
                    success: function (res) {
                        objImg.attr("src", localId);
                        objImg.attr("data", res.serverId);
                        objImg.attr("serverId", res.serverId);
                        if (is_define(callback)) callback(objImg);
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
        });
    },
    //图片的链接放在数组里
    uploadPhotos : function (objDiv, PhotosState) {
        var num = 9;
        wx.chooseImage({
            count: (PhotosState ? 1 : 9), // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds;
                var imgs = ""; var i = 0;
                function upload() {
                    wx.uploadImage({
                        localId: localIds[i],
                        success: function (res) {
                            var i_delete = '<i class="delete" style="display:inline-block;width:18px;height:18px;float:right;text-align:right;margin:3px;border-radius:50%;background:#fff;" onclick="wx_photo_delete($(this),\'' + res.serverId + '\')"><img style="width:100%;height:100%;" src="/Content/Mobile/images/shanChu.png" /></i>';
                            var strHtml = '<li class="weui_uploader_file pic" onclick="wx_photo_preview($(this))" serverId="' + res.serverId + '" data="' + localIds[i] + '" style="background-image:url(' + localIds[i] + ')">' + i_delete + '</li>';
                            objDiv.append(strHtml);

                            //把图片下载到服务器
                            wx.downloadImage({
                                serverId: res.serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (down) { }
                            });

                            //将每一条的图片的网址放进数组PhotosImg里
                            $.ajax({
                                url: "/Public/WeiXin_DownMead",
                                type: "POST",
                                data: { localID: res.serverId },// 返回图片下载后的服务器ID
                                success: function (state) {
                                    if (state.Result) {
                                        PhotosImg[PhotosImg.length] = { id: res.serverId, fileUrl: state.Data };
                                    }
                                    else {
                                        PhotosImg[PhotosImg.length] = { id: res.serverId, fileUrl: state.Data };
                                    }
                                },
                                error: function (a, b, c) {
                                    toastShow(JSON.stringaify(a), 2000);
                                }
                            });
                            i++; if (i < localIds.length) { upload(); }
                            if (PhotosState) { addIconFun(); }
                        },
                        fail: function (res) {
                            toastShow(JSON.stringify(res), 2000);
                        }
                    });
                }
                upload();
            }
        });
    },

    // 微信地理未知
    getLocation : function (callback) {
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                if (is_define(callback)) callback(latitude, longitude);
            }
        });
    },
    openMap : function (latitude, longitude, name, address, infoUrl) {
        wx.openLocation({
            latitude: 0, // 纬度，浮点数，范围为90 ~ -90
            longitude: 0, // 经度，浮点数，范围为180 ~ -180。
            name: '', // 位置名
            address: '', // 地址详情说明
            scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }



}
String.prototype.getByteLen = function(){ return this.replace(/[^\u0000-\u00ff]/g, "**").length; };