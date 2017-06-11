var isIos = false;
var base_url = "http://wx.vvbill.com";
var app_id = "";
var key = "";
var pagesize = 10;
var RowCount = 0;


$(function () {


})

function getMathRand() {
    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}
function get_time() {
    var time = window.localStorage.getItem("time")
    if (time == null) time = GetDate(new Date());
    return time;
}
function get_wxopenid() {
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
}
function get_wxPhoto() {
    var wxphoto = window.localStorage.getItem("wxphoto")
    if (wxphoto == null) wxphoto = "";

    if (wxopenid != "") {
        $.ajax({
            type: "post",
            async: false,
            url: "/WebService.asmx/_MemberWx",
            data: { key: key, openid: wxopenid },
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
                return;

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                console.log("---------wxOauto------>" + textStatus + '--' + errorThrown);

                hideLoader();
                toastShow('微信登录失败', 3000);
                return;
            }
        })
    }

    return wxphoto;
}
function get_wxName() {
    var wxname = window.localStorage.getItem("wxname")
    if (wxname == null) wxname = "";
    return wxname;
}

function get_fid() {
    var fid = window.localStorage.getItem("fid")
    if (fid == null) fid = 0;
    return fid;
}
function get_uid() {
    var uid = window.localStorage.getItem("uid")
    if (uid == null) uid = 0;

    return uid;
}
function get_uname() {
    return window.localStorage.getItem("uname")
}
function get_uphone() {
    return window.localStorage.getItem("phone")
}
function get_upwd() {
    return window.localStorage.getItem("pwd")
}
function get_ShowYuxiaobao() {
    var date = window.localStorage.getItem("ShowYuxiaobao")
    return (date == null ? new Date().format("yyyy/MM/dd") : date)
}

function oauth() {
    window.localStorage.setItem("redirect_url", window.location.href);
    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6ad1750a8def2e90&redirect_uri=" + base_url + "/app_wx/_oauto.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
    window.location.href = url;
}

function SetTabs(obj) {

    $(obj).find("a").eq(0).addClass("active");
    $(obj).find("a").each(function () {

        if ($(this).attr("href").indexOf("#") > -1) {
            $(this).attr("tabHref", $(this).attr("href"));

            var url = $(this).attr("url");
            $(this).attr("href", url == undefined ? "javascript:void(0)" : url);
        }

        $(this).click(function () {

            console.log("---------tab click------>");

            $(obj).find("a.active").removeClass("active"); $(this).addClass("active");
            $(obj).find("a").each(function () {
                var objDIV = $(this).attr("tabHref");
                if ($(this).attr("class") == undefined || $(this).attr("class").indexOf("active") == -1) {
                    $(objDIV).hide();
                } else {
                    $(objDIV).show();
                }
            })

        })
    })
}


//转换html
function GetHtml(text) {

    var strReturn = "";
    var ss = text.replaceAll("\n", "|").split('|');

    for (i = 0; i < ss.length; i++) {
        if (ss[i] != "") strReturn += "<p>" + ss[i] + "</p>";
    }

    return strReturn;
}
//转换html
function GetHtmlBr(text) {

    var strReturn = "";
    var ss = text.replaceAll("\n", "|").split('|');

    for (i = 0; i < ss.length; i++) {
        if (ss[i] != "") strReturn += "<p>" + ss[i] + "</p>";
    }

    return strReturn;
}

function GetDate(date) {
    date = new Date(date.replaceAll("-", "/").replace("T", " "));
    return date.format("yyyy-MM-dd");
}
function GetDateMinute(date) {
    date = new Date(date.replaceAll("-", "/").replace("T", " "));
    return date.format("yyyy-MM-dd hh:mm:ss");
}
function GetDateDiff(date) {

    date = new Date(date.replaceAll("-", "/").replace("T", " "));
    var d_minutes, d_hours, d_days;
    var timeNow = parseInt(new Date().getTime() / 1000);
    var timeDate = parseInt(date.getTime() / 1000);

    var d = timeNow - timeDate;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);

    if (d_days > 0 && d_days < 4) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    }
    else if (d_minutes <= 0) {
        return "刚刚";
    } else {
        return (s.getMonth() + 1) + "月" + s.getDate() + "日";
    }
}

function GetDate_AddDay(date, day) {
    var time = date.getTime() + day * 1000 * 60 * 60 * 24;
    var d = new Date();
    d.setTime(time);
    return d;
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

function WordData(model, item) {

    model.find("[data]").each(function () {
        $(this).html(item[$(this).attr("data")]);
    });

    return model;
}

var TempCache = {
    cache: function (value) {
        localStorage.setItem("EasyWayTempCache", value);
    },
    getCache: function () {
        return localStorage.getItem("EasyWayTempCache");
    },
    setItem: function (key, value) {
        localStorage.setItem(key, value);
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    removeItem: function (key) {
        return localStorage.removeItem(key);
    }
};

//图片懒加载 obj为要显示图片的div, wh为图片的显示比例，url为图片的地址
function set_photo(obj, wh, url) {

    if (obj.hasClass("pic")) {

        obj.attr("data-wh", wh);
        obj.css("background-image", "url(/app_wx/images/gray.jpg)");
        obj.attr("data-original", url);

        //obj.lazyload({ effect: "fadeIn", skip_invisible: false });
    }
}
//图片懒加载
function get_photo() {

    $("div[data-original]").each(function () {

        var obj = $(this);
        if (obj.height() == 0) {

            obj.css("height", obj.width() * obj.attr("data-wh") * 1);

            var img = new Image();
            img.src = obj.attr("data-original");
            img.onload = function () {
                if (this.width > this.height) { obj.css("background-size", "auto 100%"); } else { obj.css("background-size", "100% auto"); }
                obj.css("background-image", "url(" + img.src + ")");
            }
        }

    })
}

//给一个div 加载图片(多个)，带缓存
function set_photos(obj, url_f, urls, path) {

    if (urls == "") {
        obj.hide();
    }
    else {

        obj.show();

        if (url_f == "") url_f = "/app_wx/images/gray.jpg";

        var urls = urls.split(',');
        if (urls.length == 1) {
            obj.html("<li><div class='pic'><img src='/app_wx/images/gray.jpg' data-original=" + urls[0] + "></div></li>")
        }
        else if (urls.length > 1) {

            var htmlPhoto = "";
            for (var i = 0; i < urls.length; i++) {
                if (urls[i] != "" && urls[i] != "undefined" && urls[i] != undefined) {
                    //用图片的方式
                    htmlPhoto += "<li><div class='pic'><img src='/app_wx/images/gray.jpg' data-original=" + path + urls[i] + "></div></li>";
                    //用背景的方式
                    //htmlPhoto += "<li><div class='pic' data='" + urls[i] + "' style='background-size:100% auto;background-image:url(" + url_f + ")' src_l=" + urls[i] + " ></li>";
                }
            }
            htmlPhoto = "<ul>" + htmlPhoto + "</ul><div class=\"clear\"></div>";
            obj.html(htmlPhoto);
        }
    }
}
//给一个div 加载视频
function set_video(obj, url, photo) {

}
//给一个span 加载音频
function set_voice(obj, url, time) {

}
//给一个span 加地点标记
function set_address(obj, address) {
    if (address != "") {
        obj.html(address)
        obj.addClass("s_address");
        obj.show();

    } else {
        obj.hide();
    }
}
//给一个span 加性别和年龄
function set_sex_age(obj, sex, age) {

    obj.html(age == 0 ? "∞" : age);
    obj.addClass("s_sex_age");
    obj.addClass(sex ? "gender-m" : "gender-w");
    obj.show();

}
//给一个span 加购物车
function set_cart(obj, sex, age) {

    obj.html(age == 0 ? "∞" : age);
    obj.addClass("s_sex_age");
    obj.addClass(sex ? "gender-m" : "gender-w");
    obj.show();

}

function toastShow(showInfo, length) {

    $("div.pupInfo").remove(); $("div.pupBg").remove();
    $("body").append("<div class='pupBg' style='display:block'></div><div class='pupInfo'>" + showInfo + "</div>");
    setTimeout(hideLoader, length);
}
function confirmShow(infoConfirm, infoCancel, callback) {

    $("div.pupBg").remove(); $("div.pupConfirm").remove();
    var info = '<div class="pupBg"></div><div class="pupConfirm"><p>提交审核后内容不可修改，请再次确认是否提交？</p><a href="javascript:void(0);" class="lnkConfirm option"></a><a href="javascript:void(0);" class="lnkCancel option"></a></div>';
    $("body").append(info);

    $(".pupConfirm").find(".lnkConfirm").html(infoConfirm);
    $(".pupConfirm").find(".lnkCancel").html(infoCancel);
    $(".pupConfirm").show();
    $(".pupBg").show();

    $(".pupConfirm .lnkConfirm").unbind("click");
    $(".pupConfirm .lnkConfirm").click(function () {
        $(".pupConfirm").hide(); $(".pupBg").hide();
        callback();
    })

    $(".pupConfirm .lnkCancel").unbind("click");
    $(".pupConfirm .lnkCancel").click(function () {
        $(".pupConfirm").hide(); $(".pupBg").hide();
    })
}

//function ConfirmNo() {
//    $("div.pupConfirm").remove(); $("div.pupBg").remove();
//}
//function confirmShow(showInfo, Yes) {

//    var strInfo = '<div class="pupBg"></div><div class="pupConfirm" style="display:none"><div class="main"><p>' + showInfo + '</p><div class="btn"><a href="javascript:' + Yes + ';ConfirmNo()" class="lnkYes">确认</a><a href="javascript:ConfirmNo()" class="lnkNo">取消</a></div></div></div>';
//    $("div.pupConfirm").remove(); $("div.pupBg").remove();
//    $("body").append(strInfo); $("div.pupConfirm").show(); $("div.pupBg").show();
//}

//支付中
function showLoaderPay() {
    $("div.pupInfo").remove(); $("div.pupBg").remove();
    $("body").append("<div class='pupBg' style='display:block'></div><div class='pupInfo'>支付中...</div>");
    $("div.pupInfo").addClass("pupLoading");
}
//保存中
function showLoaderSave() {
    $("div.pupInfo").remove(); $("div.pupBg").remove();
    $("body").append("<div class='pupBg' style='display:block'><div class='pupInfo'>保存中...</div>");
    $("div.pupInfo").addClass("pupLoading");
}
//自定义
function showLoaderInfo(info) {
    $("div.pupInfo").remove(); $("div.pupBg").remove();
    $("body").append("<div class='pupBg' style='display:block'></div><div class='pupInfo'>" + info + "...</div>");
    $("div.pupInfo").addClass("pupLoading");
}
//加载中
function showLoader() {


}
//隐藏
function hideLoader() {
    $("div.pupInfo").remove(); $("div.pupBg").remove();
}


//加载有分页的数据 
function loadData(objList) {
    alert(RowCount)
    alert(rowbalance)
    alert(pageid)

    RowCount = 0; rowbalance = 0; pageid = 0;
    var str_down = '<div class="btnDown"><a href="#" flag="1"></a></div>';
    var str_up = '<div class="btnUp"><a href="javascript:void(0)" pageid="0">获取更多</a></div>';

    objList.find(".btnDown").remove();
    objList.find(".btnUp").remove();

    objList.before(str_down);
    objList.after(str_up);

    $(".btnDown a").click(function () { loadDataInit(); })
    $(".btnUp a").click(function () { if ($(".btnUp a").html() != "全部加载完成！") getOrderList(false); })

    loadDataInit();
}
function loadDataInit() {

    $("#divData").html("");
    $(".btnDown a").show();
    $(".btnDown a").html("加载中...");
    $(".btnDown a").attr("flag", "0")
    $(".btnUp a").attr("pageid", 0)
    $(".btnUp a").html("")

    getOrderList(true);
    setTimeout(function () { $(".btnDown a").hide(); $(".btnDown a").html(""); $(".btnDown a").attr("flag", "1") }, 1000);
}
function loadDataBefore(objList, init) {

    showLoader();

    if (init) {
        pageid = 0; objList.html("")
    } else if (rowbalance <= 0) {
        toastShow("亲，没有数据了！", 1500); hideLoader(); return;
    }
}
function loadDataAfter(data) {

    hideLoader();

    rowcount = data.find("RowCount").text();
    pageid = pageid + 1;
    rowbalance = rowcount - pageid * pagesize;

    if (rowbalance > 0) {
        $(".btnUp").show(); $(".btnUp a").html("还有" + rowbalance + "个记录");
    }
    else {
        $(".btnUp").show(); $(".btnUp a").html("全部加载完成！");
    }
}



//购物车相关
function Product() {
    var itemcode; //商品编码
    var count; //数量
    var type; //类型
    var paramid; //参数
}

function addProductPoint(productid, productname, productphoto, productpoint) {
    localStorage.ProductId = productid;
    localStorage.ProductName = productname;
    localStorage.ProductPhoto = productphoto;
    localStorage.ProductPoint = productpoint;

    //var products = new Object();

    //products.productid = productid;
    //products.productname = productname;
    //products.productphoto = productphoto;
    //products.productpoint = productpoint;
    //localStorage.shoppingCartProductPoint = JSON.stringify(products);

    return true;
}

//得到购物车的数量
function getCartQty() {
    var qty = 0;
    var ps = getShoppingCartProductList();
    for (i = 0; i < ps.length; i++) {
        qty += ps[i].count * 1;

    }
    return qty;
}
/*添加商品*/
function addShoppingCartProduct(itemCode, count, type, paramid) {
    if (itemCode == "" || itemCode == null) {
        toastShow("商品不能为空！", 3000);
        return false;
    }
    var productList = getShoppingCartProductList();
    var found = false;
    var i = 0;
    while (i < productList.length) {
        var productInfo = productList[i];
        if (productInfo.itemcode == itemCode) {
            productInfo.count = productInfo.count + count * 1;
            productInfo.type = type;
            productInfo.paramid = paramid;
            found = true;
            break;
        }
        i++;
    }
    if (!found) {
        product = new Object();
        product.itemcode = itemCode;
        product.count = count * 1;
        product.type = type;
        product.paramid = paramid;
        productList.push(product);
    }
    localStorage.shoppingCartProductList = JSON.stringify(productList);
    return true;
}
/*取得商品*/
function getShoppingCartProduct(itemCode) {
    var productList = getShoppingCartProductList();
    var i = 0;
    while (i < productList.length) {
        var productInfo = productList[i];
        if (productInfo.itemcode == itemCode) {
            return productInfo;
        }
        i++;
    }
    return null;
}
/*取得商品列表*/
function getShoppingCartProductList() {
    if (localStorage.shoppingCartProductList == undefined || localStorage.shoppingCartProductList == "undefined" || localStorage.shoppingCartProductList == "") {
        var newProductList = new Array();
        localStorage.shoppingCartProductList = JSON.stringify(newProductList);
    }
    var productList = JSON.parse(localStorage.shoppingCartProductList);
    return productList;
}
/*清空购物车*/
function clearShoppingCart() {
    var productList = new Array();
    localStorage.shoppingCartProductList = JSON.stringify(productList);
}
/*删除商品*/
function removeShoppingCartProduct(itemCode) {
    var productList = getShoppingCartProductList();
    var i = 0;
    while (i < productList.length) {
        var productInfo = productList[i];
        if (productInfo.itemcode == itemCode) {
            productList.splice(i, 1);
            break;
        }
        i++;
    }
    localStorage.shoppingCartProductList = JSON.stringify(productList);
}
/*修改商品数量*/
function updateShoppingCartProduct(itemCode, count) {
    var productList = getShoppingCartProductList();
    var i = 0;
    while (i < productList.length) {
        var productInfo = productList[i];
        if (productInfo.itemcode == itemCode) {
            productInfo.count = count;
            break;
        }
        i++;
    }
    localStorage.shoppingCartProductList = JSON.stringify(productList);
}

//ajax调用数据 返回json
function ajaxPost_Json(url, data, callback) {
    $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        data: data,
        success: function (data) {
            callback(true, data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (is_define(callback)) {
                callback(false, url + "?op=" + data.op + "加载失败");
            }
        }
    });
}
//ajax调用数据 返回xml
function ajaxPost_Xml(url, data, callback) {

    $.ajax({
        type: "post",
        url: url,
        dataType: "xml",
        data: data,
        success: function (data) {
            callback(true, data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (is_define(callback)) {
                callback(false, "加载失败");
            }
        }
    });
}

//判断是否是空 
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
//写日志到服务器上
function sb_Writelog(info) {

    var param = { op: "WriteLog", memberid: get_uid(), info: escape(info) }
    ajaxPost_Json("../App_Ashx/ajax_common.ashx", param, function (b, data) {
        if (b) {

        }
    })
}
//滚动到页面底部
function sb_scrollToBottom(time) {
    $('body').animate({ scrollTop: $(document).height() }, time);
}
//添加分享记录
function sb_addSharelog(shareType, shareObject, shareObjectId, shareObjectIntro) {
    var param = { op: "AddShareLog", memberid: get_uid(), shareType: shareType, shareObject: shareObject, shareObjectId: shareObjectId, shareObjectIntro: shareObjectIntro }
    ajaxPost_Json("../App_Ashx/ajax_common.ashx", param, function (b, data) {
        if (b) {
            sb_Writelog(JSON.stringify(data));
        }
    })
}
//添加浏览记录
function sb_addViewlog(viewObject, viewObjectId, viewObjectIntro) {
    var param = { op: "AddViewLog", memberid: get_uid(), viewObject: viewObject, viewObjectId: viewObjectId, viewObjectIntro: viewObjectIntro }
    ajaxPost_Json("../App_Ashx/ajax_common.ashx", param, function (b, data) {
        if (b) {
            sb_Writelog(JSON.stringify(data));
        }
    })
}

//微信config（必须先执行它）
function wx_config(callback) {
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
                toastShow(data.ErrorInfor, 2000);
            }
        }
    })
}
//微信支付-order
function wx_pay(orderid, callback) {

    showLoaderPay();
    $.ajax({
        type: "post",
        url: "/App_Ashx/wxPay.ashx",
        data: { url: window.location.href, orderid: orderid, openid: get_wxopenid() },
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
}
//微信支付-order
function wx_pay1(orderid, callback) {
    showLoaderPay();
    $.ajax({
        type: "post",
        url: "/App_Ashx/wxPay1.ashx",
        data: { url: window.location.href, orderid: orderid, openid: get_wxopenid() },
        success: function (data) {
            if (data.indexOf("error") > -1) {
                hideLoader();
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
                    callback(orderid);// 支付成功后的回调函数 
                },
                fail: function (res) {
                    hideLoader();
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
}
//自定义微信支付
function WXpay_Func(paymentType,orderid, callback) {
    $.ajax({
        type: "post",
        url: "/Payment/WeixinPublicPost",
        data: {paymentType:paymentType, keyValue: orderid },//
        success: function (data) {
            if (data.Result) {
                var item = data.Data;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId" : item.appid,     //公众号名称，由商户传入     
                        "timeStamp":item.timeStamp,         //时间戳，自1970年以来的秒数     
                        "nonceStr" : item.nonce_str, //随机串     
                        "package": item.package,     
                        "signType" : "MD5",         //微信签名方式：     
                        "paySign" : item.paySign //微信签名 
                    },
                    function(res){
                       if(res.err_msg == "get_brand_wcpay_request:ok" ) {// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                           toastShow('Payment success!', 2000);
                           callback();
                       }else{
                           toastShow('Has been canceled!', 2000);
                       }     
                   }
                ); 
                if (typeof WeixinJSBridge == "undefined"){
                   if( document.addEventListener ){
                       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                   }else if (document.attachEvent){
                       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                   }
                }else{
                   onBridgeReady();
                }
            } else {
                hideLoader();
                toastShow(data.ErrorInfor, 2000);
            }
        }
    })
}
//微信扫描
function wx_scanQRCode(callback) {
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            callback(result);
        }
    });
}

//预览微信图片
function Jk_Wx_imgShow(obj) {
    var that = obj;
    var imgArr = [];
    var imgindex = 0;
    that.parent('.patentImg').find('.forImg').each(function(index, item) {
        var itemSrc = systemEntity.Config.WebSite + $(this).find('img').attr('src');
        imgArr.push(itemSrc);
        if($(this).find('img').attr('src')==that.find('.Imgsrc').attr('src')){
            imgindex = index;
        };
    });
    wx.previewImage({
        current: imgArr[imgindex],
        urls: imgArr
    });
}
//上传微信图片（单张）
function wx_uploadPhoto(objImg, callback) {
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
}
//上传微信图片（多张）
function wxUploadPhoto1(objDiv) {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            //alert(JSON.stringify(res));
            //得到选择后的图片ID
            var localIds = res.localIds;
            var imgs = ""; var i = 0;

            function upload() {

                wx.uploadImage({
                    localId: localIds[i],
                    success: function (res) {

                        objDiv.append("<img src='" + localIds[i] + "' serverId='" + res.serverId + "' >")
                        i++; if (i < localIds.length) { upload(); }

                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            };
            upload();
        }
    });
}
//图片的链接放在数组里
var PhotosImg = [];
//上传微信图片（多张）
var PhotosState = false;
function wx_uploadPhotos(objDiv, PhotosState) {
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
    if (PhotosState) { addIconFun(); }
}

//自定义Fun
function addIconFun() {
    if ($(".weui_uploader_filesOne li").length == 0) {
        $(".lnkPhotoAddOne").show();
    } else {
        $(".lnkPhotoAddOne").hide();
    }
    if ($(".weui_uploader_filesTwo li").length == 0) {
        $(".lnkPhotoAddTwo").show();
    } else {
        $(".lnkPhotoAddTwo").hide();
    }
}
//预览图片
function wx_photo_preview(obj) {

    var imgs = []; var index = 0;
    $(obj).parents(".sb_photolist").find("li").each(function (i, item) {
        imgs.push($(this).attr("data"));
        if ($(this).attr("data") == $(obj).attr("data")) {
            index = i;
        }
    })

    if (imgs.length > 0) {
        wx_previewPhoto(index, imgs);
    }
}
//删除图片
function wx_photo_delete(obj, serverId) {
    obj.parents(".pic").remove();
    if ($(".weui_uploader_filesOne li").length == 0) {
        $(".lnkPhotoAddOne").show();
    }
    if ($(".weui_uploader_filesTwo li").length == 0) {
        $(".lnkPhotoAddTwo").show();
    }
    obj.parent(".sb_photolist").siblings(".lnkPhotoAdd").show();

    //删除服务器图片网址
    for (var i = 0; i < PhotosImg.length; i++) {
        if (PhotosImg[i].id == serverId) {
            $.post("/Public/File_Delete", { FileUrl: PhotosImg[i].fileUrl }, function (result) { });
            PhotosImg.splice(i, 1);
            break;
        }
    }
}
//分享到朋友圈
function wxShareTimeline(title, link, imgUrl, callback) {
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            if (is_define(callback)) callback(true);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (is_define(callback)) callback(false);
        }
    });
}
//分享到微信好友
function wxShareAppMessage(title, desc, link, imgUrl, type, dataUrl, callback) {
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        type: type, // 分享类型,music、video或link，不填默认为link
        dataUrl: dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
            if (is_define(callback)) callback(true);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (is_define(callback)) callback(false);
        }
    });
}
//分享到QQ空间
function wxShareQzone(title, desc, link, imgUrl, callback) {
    wx.onMenuShareQZone({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            if (is_define(callback)) callback(true);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (is_define(callback)) callback(true);
        }
    });
}
//分享到QQ
function wxShareQQ(title, desc, link, imgUrl, callback) {
    wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            if (is_define(callback)) callback(true);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            if (is_define(callback)) callback(false);
        }
    });
}
//得到地置位置
function wxGetLocation(callback) {
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
}
//打开地图
function wxOpenLocation(latitude, longitude, name, address, infoUrl) {
    wx.openLocation({
        latitude: 0, // 纬度，浮点数，范围为90 ~ -90
        longitude: 0, // 经度，浮点数，范围为180 ~ -180。
        name: '', // 位置名
        address: '', // 地址详情说明
        scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    });
}


//验证手机号  
function is_mobile(mobile) {
    if (mobile == "") {
        return false;
    } else {
        if (!/^0{0,1}(13|14|15|17|18)[0-9]{9}$/.test(mobile)) {
            return false;
        }
        return true;
    }
}
function is_chinesehave(str) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

//检查身份证是否正确
checkBirthday = function (card) {
    var len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data = card.match(re_fifteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date('19' + year + '/' + month + '/' + day);
        return verifyBirthday('19' + year, month, day, birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = card.match(re_eighteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year + '/' + month + '/' + day);
        return verifyBirthday(year, month, day, birthday);
    }
    return false;
};
//身份证
var vcity = {
    11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
    21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
    33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
    42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
    51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
    63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
};

checkCard = function () {
    //var card = document.getElementById('#txtUserCard').value;
    var card = $('#txtUserCard').val();
    //是否为空  
    if (card === '') {
        document.getElementById('#txtUserCard').focus();
        return false;
    }
    //校验长度，类型  
    if (isCardNo(card) === false) {
        document.getElementById('#txtUserCard').focus();
        return false;
    }
    //检查省份  
    if (checkProvince(card) === false) {
        document.getElementById('#txtUserCard').focus();
        return false;
    }
    //校验生日  
    if (checkBirthday(card) === false) {
        document.getElementById('#txtUserCard').focus();
        return false;
    }
    //检验位的检测  
    if (checkParity(card) === false) {
        document.getElementById('#txtUserCard').focus();
        return false;
    }
    return true;
};

//检查号码是否符合规范，包括长度，类型  
isCardNo = function (card) {
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
        return false;
    }

    return true;
};
//取身份证前两位,校验省份  
checkProvince = function (card) {
    var province = card.substr(0, 2);
    if (vcity[province] == undefined) {
        return false;
    }
    return true;
};
//检查生日是否正确  
checkBirthday = function (card) {
    var len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字  
    if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data = card.match(re_fifteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date('19' + year + '/' + month + '/' + day);
        return verifyBirthday('19' + year, month, day, birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X  
    if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = card.match(re_eighteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year + '/' + month + '/' + day);
        return verifyBirthday(year, month, day, birthday);
    }
    return false;
};
//校验日期  
verifyBirthday = function (year, month, day, birthday) {
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理  
    if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
        //判断年份的范围（3岁到100岁之间)  
        var time = now_year - year;
        if (time >= 3 && time <= 100) {
            return true;
        }
        return false;
    }
    return false;
};
//校验位的检测  
checkParity = function (card) {
    //15位转18位  
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if (len == '18') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i, valnum;
        for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[cardTemp % 11];
        if (valnum == card.substr(17, 1)) {
            return true;
        }
        return false;
    }
    return false;
};
//15位转18位身份证号  
changeFivteenToEighteen = function (card) {
    if (card.length == '15') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i;
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
        for (i = 0; i < 17; i++) {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        card += arrCh[cardTemp % 11];
        return card;
    }
    return card;
};

//验证邮箱
function is_email(email) {
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return reg.test(email);
}