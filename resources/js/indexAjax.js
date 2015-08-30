/**
 * Created by Teng on 2015/8/29.
 */

$(function () {
    //isLogin(loginName);
    $("#login").click(function () {
        login();
    })
})

var loginName;
var userName;
var loginState=0;
var id;

function login() {
    loginName = $(".xm_loginb input[type=text]").val();
    isLogin(loginName);
}

//下拉效果
function showsidebar() {
    $('#btnShow').click(function (event) {
        //取消事件冒泡
        event.stopPropagation();
        //设置弹出层的位置
        var offset = $(event.target).offset();
        $('#xm_topcon').css({top: "38px", left: offset.left});
        //按钮的toggle,如果div是可见的,点击按钮切换为隐藏的;如果是隐藏的,切换为可见的。
        $('#xm_topcon').toggle('slow');
    });//点击空白处或者自身隐藏弹出层，下面分别为滑动和淡出效果。
    $(document).click(function (event) {
        $('#xm_topcon').slideUp('slow')
    });
    $('#xm_topcon').click(function (event) {
        $(this).fadeOut(1000)
    });
}

//登陆
function isLogin(loginname) {
    $.ajax({
        type: "post",
        contentType: 'application/json; charset=UTF-8',
        url: "resources/js/user.json",
        dataType: 'json',
        async: false, //默认设置下，所有请求均为异步请求。
        success: function (data) {
            $(data).each(function (i) {
                if (loginName == data[i].loginName) {
                    userName = data[i].UserName;

                    //登陆后loginState值为1.
                    loginState=1;
                    id=i; //保存登陆用户id，方便后续查询；

                    prize();
                    //登陆后头部
                    var htmls = "<div class='ptdl_msg'>"
                    htmls += "<ul>" +
                        "<li class='xm_user'><a href='#'><img src='resources/images/xm_user01.jpg' /><b>" + userName + "</b></a></li>" +
                        "<li class='cut_wq'>" +
                        "<b id='btnShow' title='呼伦贝尔市地方税务局呼伦贝尔市地方税务局'></b>" +
                        "<div class='xm_topcon' id='xm_topcon'>" +
                        "</div>" +
                        "</li>" +
                        "<li><a href='#'>通讯录</a></li>" +
                        "<li><a href='#' class='red_zi'>[退出]</a></li>" +
                        "</ul></div>";
                    $(".last-dd-hm").html(htmls);

                    //加入的组织列表
                    var groupList="";
                    $(data[i].UserGroup).each(function(j){
                        groupList+="<a href='#'>"+data[i].UserGroup[j].GroupName+"</a>"
                    });
                    $("#xm_topcon").html(groupList);
                    //初始将第一条显示在头部
                    var fir_a=$("#xm_topcon a:first-child").html();
                    $("#btnShow").html(fir_a).attr("title",fir_a);
                    // 下拉效果
                    showsidebar();
                }

            });
        },
        error: function () {
            alert("数据加载错误！");
        }

    })
}

/*
*
* 领奖
* a,b,c分别代表个奖项抽奖次数
*
*
* */
function prize(){
    if(loginState==1){
        $.ajax({
            type: "post",
            contentType: 'application/json; charset=UTF-8',
            url: "resources/js/user.json",
            dataType: 'json',
            async: false, //默认设置下，所有请求均为异步请求。
            success: function (data) {
                var prizeIndex=data[id].Prize;  //抽奖条件集合
                var a_prize=prizeIndex[0].a; //一等奖抽奖数量
                var b_prize=prizeIndex[0].b; //二等奖抽奖数量
                var c_prize=prizeIndex[0].c; //三等奖抽奖数量
                var htmls = "<div class=\"soft-head-hm\">" +
                    "<h2>领奖</h2>" +
                    "</div><ul class='soft-ul-hm'>";

                if(a_prize>0){
                    htmls += "<li title=\"点击领取\">"+
                    "<a href=\"javascript:void(0)\" id=\"a_prize\" onclick='goPirze("+a_prize+",this.id)'>" +
                    "<img src=\"resources/images/icon2.jpg\" alt=\"\"/>" +
                    "<p>IPONE6（一等奖<span class=\"pirzenum\">"+a_prize+"</span>份）</p>" +
                    "</a>" +
                    "</li>";
                }
                if(b_prize>0){
                    htmls += "<li title=\"点击领取\">"+
                    "<a href=\"javascript:void(0)\" id=\"b_prize\" onclick='goPirze("+b_prize+",this.id)'>" +
                    "<img src=\"resources/images/icon1.png\" alt=\"\"/>" +
                    "<p>IPONE5（二等奖<span class=\"pirzenum\">"+b_prize+"</span>份）</p>" +
                    "</a>" +
                    "</li>";
                }
                if(c_prize>0){
                    htmls += "<li title=\"点击领取\">"+
                    "<a href=\"javascript:void(0)\" id=\"c_prize\" onclick='goPirze("+c_prize+",this.id)'>" +
                    "<img src=\"resources/images/icon2.jpg\" alt=\"\"/>" +
                    "<p>IPONE4（三等奖<span class=\"pirzenum\">"+c_prize+"</span>份）</p>" +
                    "</a>" +
                    "</li>";
                }
                htmls+="</ul>";
                $("#softhm").html(htmls);
            }
        })
    }else{
        alert("请登录");
    }
}

var _this; //保存目前id;
//确认条件，开始领奖
function goPirze(num,id){  //领奖次数
    _this=$("#"+id);
    var prize_num=num;
    var pirzenum=_this.find(".pirzenum").html();
    if(prize_num>0){
        if(pirzenum>0){
            _this.find(".pirzenum").html(--pirzenum);
            //这里一共的抽奖次数，返回服务器，在从新读取，这里无法完成，目前是无限抽，抽完为止
            prize_num--;
            alert("恭喜，领取成功！");
        }else{
            alert("奖品兑换完了！欢迎下次再来...")
        }
    }else{
        alert("您的抽奖机会已用完！");
    }
}