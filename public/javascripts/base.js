document.domain = "damai.cn";
$(document).ready(function () {
    $("#SeracheKey").focus(function () {
        var o = $(this);
        if (o.val() == "请输入球馆名称") { o.val(""); }
    }).blur(function () {
        var o = $(this); if (o.val() == "") {
            o.val("请输入球馆名称");
        }
    }).live("keydown", function (e) {
        var key = window.event ? event.keyCode : e.which;
        if (key == 13) {
            $('#btnQuery').click();
        }
    });
});
function CloseTips($obj, n) {
    $obj.remove();
    SetCookie(n, 1);
}
function SetCookie(name, value)
{
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/";
}
function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;

}
function delCookie(name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
function openWin(vid) {
    var obj = document.getElementById("openWin");
    obj.href = vid + ".html";
    obj.click(); 
}
function getNickName() {
    var arr, reg = new RegExp("(^| )" + "damai.cn_nickName" + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        var NickName = decodeURI(arr[2]); document.write("您好，" + NickName + "！<a href=\"http://www.damai.cn/redirect.aspx?type=loginout\" title=\"退出\">[退出]</a> <a href=\"http://per.damai.cn/msg/index.aspx\" target=\"_blank\">站内信</a>");
        $(document).ready(function () {
            $("#eUserName").text(NickName);
            if ($("#userName").size() > 0) {
                $("#userName").val(NickName);
                $("#userName").show();
                $("#loginregister").hide()
            }
        });
    } else {
        document.write('您好，欢迎来大麦网！<a href=\"http://www.damai.cn/redirect.aspx?type=login\" title=\"登录\">[登录]</a><a href=\"https://secure.damai.cn/reg.aspx\" title=\"免费注册\">[免费注册]</a>');
    }
}
var addToFavorite = function () {
    if (document.all) {
        window.external.addFavorite(document.URL, document.title);
    } else if (window.sidebar) {
        window.sidebar.addPanel(document.title, document.URL, "");
    }
 };
var setHomepage = function () {
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage(document.URL);
    } else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            } 
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch); prefs.setCharPref('browser.startup.homepage', document.URL);
    }
};
String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); };
function StringBuilder() { this.__strings__ = new Array; };
StringBuilder.prototype.append = function (str) { this.__strings__.push(str); };
StringBuilder.prototype.toString = function () { return this.__strings__.join(""); };
StringBuilder.prototype.toLimit = function (delimter) { return this.__strings__.join(delimter); };
function week(date) {
    var dt = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : new Date();
    var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekDay[dt.getDay()];
}
function DayOfWeek(i) {
    var weekDay = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    return weekDay[i];
}
function toDate(date) { var aDate = date.split("-"); var result = new Date(aDate[0], (aDate[1] - 1), aDate[2]); return result; }
function ToHour(hour) { return hour.length < 2 ? '0' + hour : hour; }
function addDay(dt, days) {
    var millSeconds = new Date(new Date(dt.replace("-", "/").replace("-", "/")).valueOf() + days * 24 * 60 * 60 * 1000);
    var rDate = new Date(millSeconds);
    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;
    var date = rDate.getDate();
    return (year + "-" + month + "-" + date).replace(/\b(\w)\b/g, '0$1');
}
function ChangeDateFormat(cellval) {
    var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + minutes + ":" + seconds;
}
(function ($) {
    $.fn.center = function (settings) {
        var style = $.extend({
            position: 'absolute', //absolute or fixed 
            top: '50%',            //50%即居中，将应用负边距计算，溢出不予考虑了。 
            left: '50%',
            zIndex: 10000,
            relative: true        //相对于包含它的容器居中还是整个页面 
        }, settings || {});

        return this.each(function () {
            var $this = $(this);

            if (style.top == '50%') style.marginTop = -$this.outerHeight() / 2;
            if (style.left == '50%') style.marginLeft = -$this.outerWidth() / 2;
            if (style.relative && !$this.parent().is('body') && $this.parent().css('position') == 'static')
                $this.parent().css('position', 'relative');
            delete style.relative;
            //ie6 
            if (style.position == 'fixed' && $.browser.version == '6.0') {
                style.marginTop += $(window).scrollTop();
                style.position = 'absolute';
                $(window).scroll(function () {
                    $this.stop().animate({
                        marginTop: $(window).scrollTop() - $this.outerHeight() / 2
                    });
                });
            }

            $this.css(style);
        });
    };
})(jQuery);
function HiddenLayer() {
    $("#operLayer,#loginframe").hide();
}
(function ($) {
    //imgager player plug-in   
    $.fn.extend({
        player: function (arg) {
            arg = jQuery.extend({
                //默认参数设置
                wrap: '#player',
                //滑动图片ID
                togglepic: '',
                //滚动文字ID
                button: '#button',
                //滑动按钮ID
                prev: '#prev',
                //播放上一张ID
                next: '#next',
                //播放下一张ID
                tag: 'li',
                //自定义标签
                eventtype: 'click',
                //触发事件类型
                width: 510,
                //滑动宽度
                timer: 3000,
                //播放时间间隔
                speed: 3000,
                //播放速度
                className: 'hovers',
                //切换类
                autoplay: true,
                //是否播放
                flag: false
                //触发条件
            },
            arg);
            return this.each(function () {
                $.fn.player.init($(this), arg);
            });
        }
    });
    $.fn.player.init = function (_this, arg) {
        //定义局部变量
        var lists = $(arg.wrap).find(arg.tag),
        imgs = lists.length,
        lis = $(arg.button).find('li'),
        txts = $(arg.togglepic).find('li'),
        prev = $(arg.prev),
        next = $(arg.next),
        index = 0,
        fls = true;
        //播放到某一张
        function move(i) {
            if (fls && imgs > 1) {
                fls = false
            } else {
                return;
            }
            removecur(lis, i);
            if (arg.flag) {
                lists.eq(i).animate({
                    'left': 0
                },
                arg.speed,
                function () {
                    $(this).addClass(arg.className);

                });
                lists.filter('.' + arg.className).animate({
                    'left': -arg.width
                },
                arg.speed,
                function () {
                    $(this).animate({
                        'left': arg.width
                    },
                    0).removeClass(arg.className);
                    fls = true;
                });
                txts.hide(0);
                txts.eq(i).fadeIn(arg.speed);
            } else {
                lists.hide(0);
                lists.eq(i).fadeIn(arg.speed,
                function () {
                    fls = true;
                });
            }
        }
        prev.die('click').live('click', function () {
            if (fls) {
                index > 0 ? index-- : index = imgs - 1;
                move(index);
            }
        });
        next.die('click').live('click', function () {
            if (fls) {
                index < imgs - 1 ? index++ : index = 0;
                move(index);
            }
        });

        //绑定事件
        (function inkove() {
            lis[arg.eventtype](function (e) {
                e.stopPropagation();
                var _this = $(this);
                if (index !== _this.index()) {
                    index = _this.index();
                    move(index);
                }
            });
        })();

        //开始播放
        function startplay() {
            return setInterval(function () {
                if (index < imgs - 1) {
                    index++;
                } else {
                    index = 0;
                }
                move(index);
            },
            arg.timer);
        }
        //停止播放
        function stoppaly() {
            //stop player
            _this.hover(
            function () {
                clearInterval(timeout);
            },
            function (e) {
                timeout = startplay();
            }
            );
        }
        //切换类
        function removecur(ary, i) {
            ary.removeClass('on').eq(i).addClass('on');
        }
        //是否播放
        if (arg.autoplay) {
            timeout = startplay();
            stoppaly();
        }
    }

})(jQuery);
(function ($) {
    $.fn.numeral = function () {
        $(this).css("ime-mode", "disabled");
        this.live("keypress", function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);  //兼容火狐 IE    
            if (!$.browser.msie && (e.keyCode == 0x8))  //火狐下不能使用退格键   
            {
                return;
            }
            return code >= 48 && code <= 57;
        });
        this.live("blur", function () {
            if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
                this.value = this.value.substr(0, this.value.length - 1);
            } else if (isNaN(this.value)) {
                this.value = "";
            }
        });
        this.live("paste", function () {
            var s = clipboardData.getData('text');
            if (!/\D/.test(s));
            value = s.replace(/^0*/, '');
            return false;
        });
        this.live("dragenter", function () {
            return false;
        });
        this.live("keyup", function () {
            if (/(^0+)/.test(this.value)) {
                this.value = this.value.replace(/^0*/, '');
            }
        });
    };
})(jQuery);
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

function bookVenue(venueId,bookDate) {
    setTimeout(function () { window.location.href = 'VenuePlan_' + venueId + '.html#' + bookDate; }, 0);
    
}

function gotoSubStation(cityId) {
    var id = isNaN(cityId) ? 0 : cityId;
    //var exp = new Date();
    //exp.setDate(exp.getDate() + 30);
    //document.cookie = 'ball.damai.cn=damai_user_city=' + id + ";expires=" + exp.toGMTString();
    document.cookie = 'ball.damai.cn=damai_user_city=' + id ;
    //搜索页切换城市,则刷新本页,其他页面切换城市跳回到首页
    if ('/Sportlist.html' == window.location.pathname) {
        setTimeout(function () {
            window.location.href = window.location.pathname + '?cityId=' + id;
        }, 0);
    } else{
        setTimeout(function(){
            window.location.href = '/';},0);
        }
}

jQuery(function () {
    $('.ppt-drop').hover(
      function () {
          $('.ppt-drop-menue').show();
          $('.ppt-drop .ppt-drop-sid').addClass("on");

      }, function () {
          $('.ppt-drop-menue').hide();
          $('.ppt-drop .ppt-drop-sid').removeClass("on");
      })
})


jQuery(function () {
    var ball_nav = $('div.nav-w ul.nav-common a[title="球馆预订"]');
    ball_nav.addClass('on');
    ball_nav.attr('href', 'http://ball.damai.cn/');
})

