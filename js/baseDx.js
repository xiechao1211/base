var base_url = "http://app-haipai.subei88.com/App_Ashx/";
var base_url_photo = "http://app-haipai.subei88.com/";
var translate;
var base_pop_id;
window.playAudioState = true;
function get_memberId() {
    //return 1;
    return window.localStorage.getItem("memberId");
}

//手机返回键退出程序
function exitApp() {
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        api.toast({
            msg: '再按一次返回键退出' + api.appName,
            duration: 2000,
            location: 'bottom'
        });

        api.addEventListener({
            name: 'keyback'
        }, function (ret, err) {
            api.toLauncher();
        });

        setTimeout(function () {
            exitApp();
        }, 3000)
    });
}

/** * 判断是否是空 * @param value */
function is_define(value) {
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
}
var dx = {
    pullDownUpdate : function(callback){
        api.setRefreshHeaderInfo({ visible: true, loadingImg: 'widget://image/refresh.png', bgColor: '#0d73df', textColor: '#fff', textDown: '下拉刷新...', textUp: '松开刷新...', showTime: false}, function(ret, err) { Boolean(callback ) ? callback() : history.go(0); api.refreshHeaderLoadDone(); });
    },
    pullUpOnload : function(callback){
        api.addEventListener({ name: 'scrolltobottom',}, function (ret, err) { callback(); });
    },
    isLogin : function(boolean){
        boolean === false ? '' : boolean = true;
        if(!Boolean(localStorage.memberId)){ boolean && api.openWin({ name: 'login', url: '../../login/login_head.html'}); return false; } else { return true; }
    },
    show : function(id,opacity,bgc){
        var obj = document.getElementById(id);
        var color = bgc || '#000';
        var shade=document.createElement("div");
        shade.style.cssText = "width: 100%; height: 100%; background: "+color+"; opacity:"+opacity+"; filter: alpha(opacity="+(opacity*10)+"); position: fixed; left: 0; top: 0; z-index: 998;";
        shade.setAttribute("onclick","dx.hide('"+id+"')");
        shade.setAttribute("id","shade_bg");
        document.body.appendChild(shade);
        obj.style.cssText = "display: block; position: fixed; left: 50%; top: 50%; z-index: 999; -webkit-transform:translate(-50%,-50%); transform:translate(-50%,-50%);";
    },
    hide : function(id){
        //document.getElementById("shade_bg").remove();
        document.body.removeChild(document.getElementById("shade_bg"));
        document.getElementById(id).style.display = 'none';
    },
    offLine : function(callback){ api.addEventListener({ name: 'offline'}, function(ret, err){ callback(); }); },
    onLine : function( callback ){ api.addEventListener({ name: 'online'}, function(ret, err){ callback(); }); },
    countDown : function( data ){ var time = data.time - 1; var fre = data.fre || 1; var count_down = setInterval(function () { $(data.obj).html("等待" + time + "秒"); time--; if (time < 0) { clearInterval(count_down); data.fun(); } }, fre * 1000); },
    parents : function(obj,cls){ var tem = obj.parentNode; while (tem.tagName != 'BODY' ){ var temCls = tem.className.split(" "); if (temCls.indexOf(cls) != -1 ){ return tem; break; } tem = tem.parentNode; } },
    nextObj : function(obj){ var tem = obj.nextSibling; while (tem.nodeName === '#text' ){ tem = tem.nextSibling; if (tem.nodeName != '#text' ){ return tem; break; } } },
    prevObj : function(obj){ var tem = obj.previousSibling; while (tem.nodeName === '#text' ){ tem = tem.previousSibling; if (tem.nodeName != '#text' ){ return tem; break; } } },
    addCls : function(obj,cls){ var clsArr = obj.className.split(" "); if (clsArr.indexOf(cls) === -1 ){ obj.className += ' '+cls; } },
    localData : function(index,val){ var arr = new Array(); for (q in localStorage ){ var obj = localStorage[q]; if (obj.split(",")[index] === val ){ arr.push(q); arr.push(obj); return arr; break; } } },
    openWin : function(data,state){ api.openWin({ name: data.name, url: data.url, reload: data.reload !== undefined ? data.reload : false, slidBackEnabled : data.slidBackEnabled === undefined ? true : data.slidBackEnabled, pageParam: data.pageParam !== undefined ? data.pageParam : {}}); state && setTimeout(api.closeWin,1000); },
    ajax : function(data){
        data = data || {};
        data.type = (data.type || "GET").toUpperCase();
        data.dataType = data.dataType || "json";
        data.async = data.async === undefined ? true : data.async;
        var params = formatParams(data.data);
        var xhr;
        function formatParams(data) {
            var arr = [];
            for (var name in data) { arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name])); }
            arr.push(("v=" + Math.random()).replace(".",""));
            return arr.join("&");
        }
        if (window.XMLHttpRequest) { xhr = new XMLHttpRequest(); }
        else { xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
        if (data.type === "GET") {
            xhr.open("GET", base_url+data.url + "?" + params,data.async); xhr.send(null);
        } else if (data.type === "POST") {
            xhr.open("POST", base_url+data.url,data.async); xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); xhr.send(params);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { var status = xhr.status; if (status >= 200 && status < 300) { data.success && data.success(JSON.parse(xhr.responseText), xhr.responseXML); } else { data.error && data.error(status); } }
        };
    },
    toastShow : function(txt,len,addr){ len = len || 2000; addr = addr || 'bottom'; api.toast({ msg: txt, duration: len, location: addr }); },
    loadShow : function(){
        var load = api.require('UILoading');
        load.keyFrame({
            rect: {
                w: 100,
                h: 100
            },
            mask: 'rgba(0,0,0,0)',
            content : [
                { frame : 'widget://image/load/d1.png' },
                { frame : 'widget://image/load/d2.png' },
                { frame : 'widget://image/load/d3.png' },
                { frame : 'widget://image/load/d4.png' },
                { frame : 'widget://image/load/d5.png' },
                { frame : 'widget://image/load/d6.png' },
                { frame : 'widget://image/load/d7.png' },
                { frame : 'widget://image/load/d8.png' },
                { frame : 'widget://image/load/d9.png' },
                { frame : 'widget://image/load/d10.png' },
                { frame : 'widget://image/load/d11.png' },
                { frame : 'widget://image/load/d12.png' }
            ],
            styles: { bg: 'rgba(0,0,0,0.15)', corner: 10, interval: 50, frame: { w: 50, h: 50}}
        });
        // api.showProgress({ modal: true, text: '' });
    },
    loadHide : function(){
        var load = api.require('UILoading');
        load.closeKeyFrame();
        // api.hideProgress();
    },
    lookPhoto : function (data) {
        var photoBrowser = api.require('photoBrowser');
        photoBrowser.open({
            images: data.url,
            bgColor: '#000',
            activeIndex : data.index
        },function (ret) {
            if( ret ){
                api.openFrame({
                    name: 'photo_head',
                    url: 'widget://html/1home/photo_head.html',
                    bgColor : 'rgba(0,0,0,0)',
                    rect: { x: 0, y: api.statusBarAppearance && api.systemType !== 'ios' ? 20 : 0, w: 'auto', h: 50},
                    pageParam: { index: data.index, count: data.url.length, fName: data.fName, script: data.script, save: data.save},
                    bounces: false,
                    vScrollBarEnabled: true,
                    hScrollBarEnabled: true,
                    progress: 'page'
                });
                var time = api.systemType === 'ios' ? 0 : 300;
                setTimeout(function(){
                    photoBrowser.getIndex(function(ret, err) {
                        if (ret) { api.execScript({ frameName: 'photo_head', script: 'updata("' + ret.index+'")'}); }
                    });
                },time);
            }
        });
    },
    closePhoto : function(){ var photoBrowser = api.require('photoBrowser'); photoBrowser.close(); },
    savePhoto : function(index){
        var photoBrowser = api.require('photoBrowser');
        photoBrowser.getImage({
            index: index
        }, function(ret) {
            if (ret) {
                api.saveMediaToAlbum({
                    path: ret.path
                }, function(ret) {
                    if (ret && ret.status) { dx.toastShow('保存成功'); } else { dx.toastShow('保存失败'); }
                });
            }
        });
    },
    playAudio : function(url){
        event.stopPropagation();
        api.download({
            url: url,
            cache: true,
            allowResume: true
        }, function(ret, err) {
            if (ret.state == 1) {
                if(window.playAudioState){
                    api.startPlay({ path: ret.savePath});
                    window.playAudioState = false;
                }else{
                    api.stopPlay();
                    window.playAudioState = true;
                }
            } else {
                dx.toastShow('播放失败！'); 
            }
        });
    },
    setUpdata : function(){ api.sendEvent({ name: 'updataContent'}); },
    getUpdata : function(callback){
        api.addEventListener({
            name: 'updataContent'
        }, function(ret, err) {
            if(ret){ callback(); }
        });
    },
    zipPhoto : function(url,cbk){
        var num = 0.2;
        if( api.systemType === 'ios' ){
            var imgArr = [];
            url.forEach(function (v,i,a) {
                var imageFilter = api.require('imageFilter');
                var imgName = dx.randomString()+'.png';
                imageFilter.compress({
                    img: v,
                    quality: num,
                    scale : 1,
                    save : { album: false, imgPath: api.fsDir, imgName: imgName}
                }, function(ret) {
                    if (ret.status) { imgArr.push(api.fsDir + '/'+imgName); if (i + 1 === a.length) { checkResut(); } }
                });
            });
            function checkResut() {
                if( imgArr.length !== url.length ){
                    setTimeout(checkResut,500);
                }else{
                    /*imgArr.forEach(function (v2) {
                        var fs = api.require('fs');
                        fs.remove({ path: v2}, function () { });
                    });*/
                    cbk !== undefined && cbk(imgArr);
                }
            }
        }else{
            var compactPicture = api.require('compactPicture');
            compactPicture.HittingPic({ picpatharray: url, size: 6}, function(ret) { cbk !== undefined && cbk(ret.states); });
        }
    },
    androidZipPhoto : function(url,num,cbk){
        var compactPicture = api.require('compactPicture');
        compactPicture.HittingPic({
            picpatharray: url,
            size: num*10
        }, function(ret) {
            var upArr = [];
            ret.states.forEach(function (v,i,a) {
                var classInfos = {
                    className: "Photo",
                    fields: [{
                        name: "photo",
                        value: v,
                        type: "file",
                        filename: dx.returnTranslate("未命名")
                    }]
                };
                ajaxToAPICloud(appId, appKey, "post", classInfos, function(ret) { if (ret) { upArr.push(ret.body.photo.url ); if (i + 1 === a.length) { checkResut(); } } });
                function checkResut() { if (upArr.length !== a.length ){ setTimeout(checkResut, 500); } else { cbk !== undefined && cbk(upArr); } }
            });
        });
    },
    iosZipPhoto : function (url,num,cbk) {
        var imgArr = [], upArr = [];
        url.forEach(function (v,i,a) {
            var imageFilter = api.require('imageFilter');
            var imgName = dx.randomString()+'.png';
            imageFilter.compress({
                img: v,
                quality: num,
                scale : 1,
                save : {
                    album : false,
                    imgPath : api.fsDir,
                    imgName : imgName
                }
            }, function(ret) {
                if (ret.status) {
                    imgArr.push(api.fsDir+'/'+imgName);
                    var classInfos = {
                        className: "Photo",
                        fields: [{
                            name: "photo",
                            value: api.fsDir+'/'+imgName,
                            type: "file",
                            filename: dx.returnTranslate("未命名")
                        }]
                    };
                    ajaxToAPICloud(appId, appKey, "post", classInfos, function(ret, err) {
                        if( ret ){
                            upArr.push( ret.body.photo.url );
                            if( i+1 === a.length ){
                                checkResut();
                            }
                        }
                    });
                    function checkResut() {
                        if( upArr.length !== url.length ){
                            setTimeout(checkResut,500);
                        }else{
                            imgArr.forEach(function (v2) {
                                var fs = api.require('fs');
                                fs.remove({ path: v2}, function () { });
                            });
                            cbk !== undefined && cbk(upArr);
                        }
                    }
                }
            });
        });
    },
    zipPhotos : function (url,cbk) {
        var num = 0.2;
        if( api.systemType === 'ios' ){
            dx.iosZipPhoto(url,num,cbk);
        }else{
            dx.androidZipPhoto(url,num,cbk);
        }
    },
    openCode : function(data){
        var FNScanner = api.require('FNScanner');
        FNScanner.openScanner({
            autorotation: true
        }, function(ret) {
            switch (ret.eventType){
                case 'cancel' :
                    dx.toastShow('取消扫码');
                    break;
                case 'fail' :
                    dx.toastShow('扫码失败');
                    break;
                case 'success' :
                    if( ret.content.indexOf('?id=') !== -1 ){
                        api.execScript({ name: data.name, frameName: data.fName, script: data.script + '(' + JSON.stringify(ret)+')'});
                    }else{
                        dx.toastShow('不是一个有效的二维码');
                    }
                    break;
            }
        });
    },
    writeTranslate : function(txt,cbk,status){
        dx.ajax({
            url : 'ajax_common.ashx',
            data : {
                op : 'WriteXml',
                strZh : txt
            },
            async : status !== undefined ? status : true,
            success : function(data){
                if( data.status === 'n' ){ dx.toastShow(data.info); return; }
                cbk !== undefined && cbk(data);
            },
            error : function(){
                dx.toastShow('接口异常，请通知开发人员处理');
            }
        });
    },
    getTranslate : function(txt,cbk,status){
        dx.ajax({
            url : 'ajax_common.ashx',
            data : {
                op : 'GetXml',
                strZh : txt
            },
            async : status !== undefined ? status : true,
            success : function(data){
                if( data.status === 'n' ){
                    dx.toastShow(data.info);
                    return;
                }
                cbk !== undefined && cbk(data);
            },
            error : function(){
                dx.toastShow('接口异常，请通知开发人员处理');
            }
        });
    },
    domTranslate : function(){
        if( localStorage.language !== 'en' ){
            var lang = document.querySelectorAll('[data-lang]');
            for( var g=0; g<lang.length; g++ ){
                if (lang[g].getAttribute('data-LangType') !== null) {
                    lang[g].setAttribute( lang[g].getAttribute('data-LangType'),lang[g].getAttribute('data-lang') );
                }else{
                    lang[g].innerHTML = lang[g].getAttribute('data-lang')
                }
            }
            return;
        }
        dx.loadShow();
        var lang = document.querySelectorAll('[data-lang]');
        var txt = [];
        for( var i=0; i<lang.length; i++ ){
            txt.push(lang[i].getAttribute('data-lang'));
        }
        // dx.writeTranslate( txt.join('|'),function(){
            dx.getTranslate( txt.join('|'),function(data){
                for( var q=0; q<lang.length; q++ ){
                    var tem = lang[q].getAttribute('data-lang');
                    for( var a=0; a<data.info.length; a++ ){
                        if( tem === data.info[a].cn ){
                            if( localStorage.language === 'en' ){
                                if (lang[q].getAttribute('data-LangType') !== null) { lang[q].setAttribute(lang[q].getAttribute('data-LangType'),data.info[a].en ); } else { lang[q].innerHTML = data.info[a].en; }
                            }else{
                                if (lang[q].getAttribute('data-LangType') !== null) { lang[q].setAttribute(lang[q].getAttribute('data-LangType'),data.info[a].cn ); } else { lang[q].innerHTML = data.info[a].cn; }
                            }
                        }
                    }
                }
                dx.loadHide();
            });
        // })
    },
    scriptTranslate : function(txt){
        if( localStorage.language !== 'en' ){ return txt; }
        var text;
        /*$.ajax({
            type: 'GET',
            url: base_url + 'ajax_common.ashx',
            data: { op: 'WriteXml', strZh: txt },
            dataType: 'json',
            timeout: 0,
            async : false,
            success: function(){
                $.ajax({
                    type: 'GET',
                    url: base_url + 'ajax_common.ashx',
                    data: { op: 'GetXml', strZh: txt },
                    dataType: 'json',
                    timeout: 0,
                    async : false,
                    success: function(data){
                        if( localStorage.language === 'en' ){
                            text = data.info[0].en;
                        }else{
                            text = data.info[0].cn;
                        }
                    }
                });
            }
        });*/
        $.ajax({
            type: 'GET',
            url: base_url + 'ajax_common.ashx',
            data: { op: 'GetXml', strZh: txt },
            dataType: 'json',
            timeout: 0,
            async : false,
            success: function(data){
                if( localStorage.language === 'en' ){ text = data.info[0].en; } else { text = data.info[0].cn; }
            }
        });
        return text;
    },
    DomTranslate : function () {
        var lang = document.querySelectorAll('[data-lang]');
        var txt = [];
        for( var i=0; i<lang.length; i++ ){
            txt.push(lang[i].getAttribute('data-lang'));
        }
        var data = {
            txt : txt,
            win : api.winName,
            frm : api.frameName,
            script : 'dx.DomTranslates'
        };
        api.execScript({ name: 'index', script: 'returnTranslate('+JSON.stringify(data)+')'});
    },
    DomTranslates : function (data) {
        var lang = document.querySelectorAll('[data-lang]');
        for( var i=0; i<lang.length; i++ ){
            data.forEach(function (v) {
                if( lang[i].getAttribute('data-lang') === v.cn ){
                    var name = localStorage.language !== 'en' ? 'cn' : 'en';
                    if( lang[i].getAttribute('data-LangType') !== null ){
                        lang[i].setAttribute( lang[i].getAttribute('data-LangType'),v[name] );
                    }else{
                        lang[i].innerHTML = v[name];
                    }
                }else if( typeof v === 'string' && lang[i].getAttribute('data-lang') === v ){
                    if( lang[i].getAttribute('data-LangType') !== null ){
                        lang[i].setAttribute( lang[i].getAttribute('data-LangType'),v );
                    }else{
                        lang[i].innerHTML = v;
                    }
                }
            });
        }
    },
    returnTranslate : function (txt) {
        var data = JSON.parse(api.readFile({
            sync: true,
            path: 'widget://script/json/translate.json'
        })).item;
        var text;
        data.forEach(function (v) {
            if( txt === v.cn ){
                var name = localStorage.language !== 'en' ? 'cn' : 'en';
                text = v[name];
            }
        });
        if( text !== undefined ){
            return text;
        }else{
            dx.ajax({ url: 'ajax_common.ashx', data: { op: 'WriteXml', strZh: txt}, success: function(){}});
            return txt;
        }
    },
    imgLoads : function () {
        var obj = document.querySelectorAll('[data-src]');
        [].forEach.call(obj,function (img) {
            var src = img.getAttribute('data-src');
            api.imageCache({
                url : src,
                policy : 'cache_else_network'
            }, function(ret) {
                var pic = new Image();
                    pic.src = ret.url;
                    pic.onload = setImgSrc(img,ret.url);
            });
        });
        function setImgSrc(obj,src) {
            obj.getAttribute('data-src') !== 'undefined' && obj.setAttribute('src',src);
        }
    },
    randomString : function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
};

String.prototype = {
    trim : function(){ return this.replace(/(^\s*)|(\s*$)/g, ""); },
    ltrim : function(){ return this.replace(/(^\s*)/g,""); },
    rtrim : function(){ return this.replace(/(\s*$)/g,""); }
};
String.prototype.getByteLen = function(){ return this.replace(/[^\u0000-\u00ff]/g, "**").length; };
String.prototype.setByteLen = function (num) {
    var txt = this.split("");
    var count = 0;
    for( var i=0; i<txt.length; i++ ){
        count += txt[i].getByteLen();
        if( count > num ){
            return ( txt.splice( 0,i ).join().replace(/\,/g,'') );
        }
    }
    return this;
};
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
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
    undefined : function( val,StrState,OAstate ){
        OAstate ? OAstate = true : OAstate = OAstate;
        if( StrState ){ var err = ['null','NULL','undefined','(null)','false','0']; if (err.indexOf(val) != -1 ) return false; }
        if(OAstate) { try { if (val.length === 0) { return false; } else { for (var i in val) { return true; } return false; } } catch (e) { } }
        try { return Boolean(val.trim()); } catch (e) { return Boolean(val); }
    }
};

var Pay = {
    AliPay : function(data) {
        var rsaPriKey;
        switch( api.systemType )
        {
            case 'ios':
                rsaPriKey = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAK7g746IRItwOEHE06RRd4gNbQbkGIFBPUZsVwv4kTPfWismQgjIR4wDvnNgPZCgV+xom6xv/a3HQJYwq90rfAWuIuQI/lvfpo3ti3/oXqFGzWXxXtsx5APhgWHMburZiwMv1k062bGRFt1XcWbGu4qc8dvDVUma1hi0VMz4C7o5AgMBAAECgYBZr/zMIbDdvmjruhE9BZcDDLeswBCdQaM2WdvuxMVbUCJDXPSi4mxnL4heTa5lXQaatS+ZqTn2BOln3YBXBrUsrq6Xp/d54AO2w1+SSC44Sdz/yBm9h39t4AyrqhOpWsDwThjEcdVVisdzFiP1MoAU9/UDKZ5MFhpfRawIopXNzQJBAOeXvAbYI79vBswnvn7NcBfoft2N2pbxFdbhTfREvdh4dFiKr6cvYFmSJcMZCV4Pf2TBA7n5AMUGqtV1wOeHPzsCQQDBTxT6XTop0R/+dxi5CsWHuUzytAoX+4yH3iWhh1p6vqVc5ZR+SY2+qLTTTaNg8Gn/5aEnjIuVaKf6GR76tT0bAkBNhTPSEq08mfxrf+464adgyVkV7jK6Da7iw33lgtENUZyYOqv7SVd2A/6R5KKHEqbw4c7OhHPmf4nVc9oDZfkbAkAdQFc/T24mt8NsoR73mT6svAh9zWqdmG36fU4adD3nxwOE3CStO3oceLDsLJplZ9vSYjARqP3SPQT2HmkGrPgzAkA1/jYsDFKVSrIZdlsf2uyuYZcviJyOtk+0blruxSqlF5HLIgl4OEiIv7dbn/P6nxVFvIlXIoQ1K/CHlvT51L28';
                break;
            case 'android':
                rsaPriKey = 'MIICWwIBAAKBgQCu4O+OiESLcDhBxNOkUXeIDW0G5BiBQT1GbFcL+JEz31orJkIIyEeMA75zYD2QoFfsaJusb/2tx0CWMKvdK3wFriLkCP5b36aN7Yt/6F6hRs1l8V7bMeQD4YFhzG7q2YsDL9ZNOtmxkRbdV3FmxruKnPHbw1VJmtYYtFTM+Au6OQIDAQABAoGAWa/8zCGw3b5o67oRPQWXAwy3rMAQnUGjNlnb7sTFW1AiQ1z0ouJsZy+IXk2uZV0GmrUvmak59gTpZ92AVwa1LK6ul6f3eeADtsNfkkguOEnc/8gZvYd/beAMq6oTqVrA8E4YxHHVVYrHcxYj9TKAFPf1AymeTBYaX0WsCKKVzc0CQQDnl7wG2CO/bwbMJ75+zXAX6H7djdqW8RXW4U30RL3YeHRYiq+nL2BZkiXDGQleD39kwQO5+QDFBqrVdcDnhz87AkEAwU8U+l06KdEf/ncYuQrFh7lM8rQKF/uMh94loYdaer6lXOWUfkmNvqi0002jYPBp/+WhJ4yLlWin+hke+rU9GwJATYUz0hKtPJn8a3/uOuGnYMlZFe4yug2u4sN95YLRDVGcmDqr+0lXdgP+keSihxKm8OHOzoRz5n+J1XPaA2X5GwJAHUBXP09uJrfDbKEe95k+rLwIfc1qnZht+n1OGnQ958cDhNwkrTt6HHiw7CyaZWfb0mIwEaj90j0E9h5pBqz4MwJANf42LAxSlUqyGXZbH9rsrmGXL4icjrZPtG5a7sUqpReRyyIJeDhIiL+3W5/z+p8VRbyJVyKENSvwh5b0+dS9vA==';
                break;
            default:
        }
        var config = {
            partner : '2088521051920881',
            seller: '2088521051920881',
            rsaPriKey: rsaPriKey,
            rsaPubKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCu4O+OiESLcDhBxNOkUXeIDW0G5BiBQT1GbFcL+JEz31orJkIIyEeMA75zYD2QoFfsaJusb/2tx0CWMKvdK3wFriLkCP5b36aN7Yt/6F6hRs1l8V7bMeQD4YFhzG7q2YsDL9ZNOtmxkRbdV3FmxruKnPHbw1VJmtYYtFTM+Au6OQIDAQAB',
            notifyURL: 'http://admin.bl123.net/App_Pay/Alipay/PayReturn.aspx'
        };

        var obj = api.require('aliPay');
        obj.config({
            partner: config.partner,
            seller: config.seller,
            rsaPriKey: config.rsaPriKey,
            rsaPubKey: config.rsaPubKey,
            notifyURL: config.notifyURL
        }, function (ret,err) {
            if ( ret.status ) {
                obj.pay({
                    subject: data.orderTit,
                    body: data.orderDesc,
                    amount: data.orderPrice,
                    tradeNO: data.orderNo
                }, function (ret, err) {
                    if (ret.code == 9000) { data.callBack && data.callBack({ state : true , info : '支付成功！' }); }
                    else { data.callBack && data.callBack({ state : false , info : '支付失败或取消！' }); }
                });
            }
            else { data.callBack && data.callBack({ state : false , info : '配置失败！' }); }
        });
    },
    wxPay : function(data){
        var wxPay = api.require('wxPay');
        wxPay.config({
            apiKey: 'wxadfdfdf21814d8ac',
            mchId: '1398999902',
            partnerKey: 'subei888subei888subei888subei888',
            notifyUrl: 'http://admin.bl123.net/App_Pay/Weixin/PayReturn.aspx'
        }, function (ret, err) {
            if (ret.status) {
                wxPay.pay({
                    description: data.orderTit,
                    totalFee: Number( data.orderPrice ) * 100,
                    tradeNo: data.orderNo,
                    detail: data.orderDesc,
                    feeType: 'CNY'
                }, function(ret, err) {
                    if (ret.status) {
                        data.callBack && data.callBack({ state : true , info : '支付成功！' });
                    } else {
                        var txt;
                        switch (err.code){ case -2 : txt = '用户取消支付！'; break; case -1 : txt = '未知错误！'; break; case 1 : txt = '支付失败！'; break; }
                        data.callBack && data.callBack({ state : false , info : txt , code : err.code });
                    }
                });
            } else {
                var hint;
                switch (err.code){ case -1 : hint = '未知错误'; break; case 1 : hint = 'apiKey 值非法'; break; case 2 : hint = 'mchId 值非法'; break; case 3 : hint = 'partnerKey 值非法'; break; case 4 : hint = 'notifyUrl 值非法'; break; }
                data.callBack && data.callBack({ state : false , info : '配置错误，请联系系统人员处理！' , hint : hint, code : err.code });
            }
        });
    }
};



