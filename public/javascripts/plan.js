var venueID;
var totalCount = 0;
var totalAmount = 0;
var index = 0;
var pages = 0;
function StringBuilder() { this.__strings__ = new Array; };
StringBuilder.prototype = {
    append : function (str) { this.__strings__.push(str); },
    toString :function () { return this.__strings__.join("")},
    toLimit : function (delimter) { return this.__strings__.join(delimter); }
};

$(document).ready(function() {
    venueID = $("#VenueID").val();
    var c = window.location.hash;
    var a = $('#dts>li>a[date="' + c.replace("#", "") + '"]');
    pages = Math.ceil(($(".cost .date_con ul li").length) / 7);
    if (a.size() > 0) {
        var b = Math.ceil(($("#dts>li").index(a.parent("li")) + 1) / 7);
        if (b > 1) {
            index = b - 1;
            $(".cost .prev a").addClass("active");
            var d = $(".cost .date_con ul li").width();
            if (index >= pages - 1) {
                index = pages - 1;
                $(".cost .next a").removeClass("active")
            }
            $(".cost .date_con ul").css("left", -(d + 5) * 7 * index)
        }
        a.click()
    } else {
        $('#dts>li>a:not(".grey")').eq(0).click()
    }
    $("#btn_slide>a").click(function() {
        var e = $(this);
        if (e.attr("class") == "slide") {
            $("#planBox,#hasplan").css("height", "auto");
            e.attr({
                "class": "ups"
            }).text("向上收起").show()
        } else {
            $("#planBox,#hasplan").css("height", "298");
            e.attr({
                "class": "slide"
            }).text("全部显示").show()
        }
    });
    $("#vCode").focus(function() {
        var e = $(this);
        if (e.val() == "请输入验证码") {
            e.val("")
        }
    }).blur(function() {
        var e = $(this);
        if (e.val() == "") {
            e.val("请输入验证码")
        }
    });
    $("#checkCode").click(function() {
        $(this).attr("src", "VerifyShow.aspx?t=" + Math.random())
    });
    $("#checkCode").click()
});
jQuery(function() {
    if (index == 0) {
        $(".cost .prev a").removeClass("active")
    }
    if (pages == 1) {
        $(".cost .next a").removeClass("active")
    }
    $(".cost .prev").click(function() {
        if (pages == 1) {
            return
        }
        $(".cost .next a").addClass("active");
        var a = $(".cost .date_con ul li").width();
        index--;
        if (index <= 0) {
            $(".cost .prev a").removeClass("active");
            index = 0
        }
        $(".cost .date_con ul").css("left", -(a + 5) * 7 * index)
    });
    $(".cost .next").click(function() {
        if (pages == 1) {
            return
        }
        $(".cost .prev a").addClass("active");
        var a = $(".cost .date_con ul li").width();
        index++;
        if (index >= pages - 1) {
            index = pages - 1;
            $(".cost .next a").removeClass("active")
        }
        $(".cost .date_con ul").css("left", -(a + 5) * 7 * index)
    })
});


function QueryVenueFieldPlanDetail(b, d, c) {
    window.location.hash = d;
    $("#hasplan,#btn_slide,#noplan").hide();
    $("#load").show();
    $("#choose-day-time").val(d);
    $("#dts>li>a").removeClass("on");
    if (c == 0) {
        $("#load").hide();
        $("#noplan").show();
        return
    }
    var a = $("#dts>li>a[date='" + d + "']");
    a.addClass("on");
    $.ajax({
        cache: false,
        type: "get",
        dataType: "json",
        url: "venue/" + b + "?datetime=" + d,
        success: function(r) {
            $("#load").hide();
            if (r.status == "200" && r.total > 0) {
                $("#noplan").hide();
                $("#hasplan").show();
                var l = $("#dataList");
                var p = new StringBuilder();
                var j = new StringBuilder();
                var h = new StringBuilder();
                var vMap = {};
                p.append('<dt class="table_title">场地/时间</dt>');
                for (var q = 0; q < r.vList.length; q++) {
                    p.append("<dd>" + r.vList[q].FieldName + "</dd>");
                    vMap[r.vList[q].FieldId] = r.vList[q].FieldName
                }
                if (r.vList.length > 7) {
                    $("#btn_slide").show()
                }
                $("#venueList").html(p.toString());
                for (var g = 0; g < r.tList.length; g++) {
                    var m = new StringBuilder();
                    m.append("<dl>");
                    m.append("<dt>" + r.tList[g].StartTime + ":00</dt>");
                    for (var o = 0; o < r.vList.length; o++) {
                        m.append('<dd vid="' + r.vList[o].FieldId + '" s="' + r.tList[g].StartTime + '" e="' + r.tList[g].EndTime + '"><a href="javascript:void(0)" class="saled" >已售</a></dd>')
                    }
                    m.append("</dl>");
                    h.append(m.toString())
                }
                l.html(h.toString());
                var n = $("#shoppingCart");
                for (var k = 0; k < r.data.length; k++) {
                    var f = r.data[k];
                    var e = false;
                    /*if (r.isCheck == 1) {
                        if (f.StartTime < r.hour) {
                            e = true
                        } else {
                            if (f.StartTime == r.hour) {
                                if (r.minute > 15) {
                                    e = true
                                }
                            }
                        }
                    }*/
                    if (f.ReserveStatus == 1) {} else {
                        if (f.ReserveStatus == 0) {
                            if (n.find("span[date='" + d + "'][vid='" + f.FieldId + "'][s='" + f.StartTime + "'][e='" + f.EndTime + "']").length > 0) {
                                l.find("dd[vid='" + f.FieldId + "'][s='" + f.StartTime + "'][e='" + f.EndTime + "']").removeClass("saled").html('<a href="javascript:void(0)" date="' + d + '" class="choosed" planID="' + f.PlanDetailId + '" filed="' + vMap[f.FieldId] + '" vid="' + f.FieldId + '" price="' + f.Price + '" s="' + f.StartTime + '" e="' + f.EndTime + '" sign="' + f.sign + '" onclick="ConfrimSelect($(this));" title="' + f.StartTime + ":00-" + f.EndTime + ":00 " + vMap[f.FieldId] + " " + f.Price.toFixed(0) + '元">' + f.Price.toFixed(0) + "</a>")
                            } else {
                                l.find("dd[vid='" + f.FieldId + "'][s='" + f.StartTime + "'][e='" + f.EndTime + "']").removeClass("saled").html('<a href="javascript:void(0)" date="' + d + '" planID="' + f.PlanDetailId + '" filed="' + vMap[f.FieldId] + '" vid="' + f.FieldId + '" price="' + f.Price + '" s="' + f.StartTime + '" e="' + f.EndTime + '" sign="' + f.sign + '" onclick="ConfrimSelect($(this));" title="' + f.StartTime + ":00-" + f.EndTime + ":00 " + vMap[f.FieldId] + " " + f.Price.toFixed(0) + '元">' + f.Price.toFixed(0) + "</a>")
                            }
                        }
                    }
                }
            } else {
                $("#noplan").show();
                $("#hasplan").hide()
            }
        },
        error: function(e, g, f) {
            alert("系统发生错误：\r\n" + f)
        }
    })
}
function ConfrimSelect(i) {
    var d = $("#totalCount");
    var f = $("#cartTotalAmount");
    var h = $("#shoppingCart");
    var e = $("#shoppingCart>li>a");
    var c = i.attr("date");
    var m = i.attr("s");
    var l = i.attr("e");
    var k = i.attr("filed");
    var j = i.attr("vid");
    var g = i.attr("price");
    var b = i.attr("sign");
    var a = i.attr("planID");
    if (i.hasClass("choosed")) {
        DeleteCart($("#shoppingCart span[vid='" + j + "'][s='" + m + "'][e='" + l + "'][date='" + c + "']"))
    } else {
        if (totalCount >= 6) {
            alert("您的购物车已满")
        } else {
            if (a == undefined || a == "NaN") {} else {
                $("#nocart").hide();
                h.prepend('<li><div class="order_c"><ol><li>时间：' + c + " " + m + ":00--" + l + ":00 </li><li>场地：" + k + "</li><li>价格：<span>" + g + '元</span></li></ol><span class="shut" planID="' + a + '" onclick="DeleteCart($(this));" date="' + c + '" price="' + g + '" vid="' + j + '" s="' + m + '" e="' + l + '" sign="' + b + '">关闭</span></div></li>');
                totalCount++;
                d.text(totalCount);
                totalAmount += parseFloat(g);
                f.text(totalAmount.toFixed(2));
                i.addClass("choosed")
            }
        }
    }
}
function DeleteCart(i) {
    var c = $("#totalCount");
    var f = $("#cartTotalAmount");
    var h = $("#shoppingCart");
    var e = $("#shoppingCart>li>a");
    var d = $("#choose-day-time").val();
    var b = i.attr("date");
    var l = i.attr("s");
    var k = i.attr("e");
    var j = i.attr("vid");
    var g = i.attr("price");
    var a = i.attr("planID");
    i.parents("li").remove();
    totalCount--;
    if (totalCount <= 0) {
        $("#nocart").show()
    }
    c.text(totalCount);
    totalAmount -= parseFloat(g);
    f.text(totalAmount.toFixed(2));
    if (d == b) {
        $("#dataList").find("a[vid='" + j + "'][planID='" + a + "']").removeClass("choosed")
    }
}
function submitOrder() {
    if (totalCount > 0 && totalAmount > 0) {
        //var a = new StringBuilder();
        var ods = new Array();
        $("#shoppingCart>li>div>span").each(function() {
            var e = $(this);
            var od = {
                dt : e.attr("date"),
                vid : e.attr("vid"),
                pid : e.attr("planID"),
                p : e.attr("price"),
                s : e.attr("s"),
                e :  e.attr("e"),
                sign : e.attr("sign")
            };
            ods.push(od);
            //a.append(e.attr("date") + "|" + e.attr("vid") + "|" + e.attr("planID") + "|" + e.attr("price") + "|" + e.attr("s") + "|" + e.attr("e") + "|" + e.attr("sign"))
        });
        //var d = a.toLimit("^");
        if (ods.length > 0) {
            var b = $("#vCode");
            var c = $.trim(b.val());
            c = 'x';
            if (c.length == 0 || c == "请输入验证码") {
                b.focus();
                alert("请填写验证码")
            } else {
                $.ajax({
                    type: "post",
                    dataType: "json",
                    data: {
                        totalPrice: totalAmount,
                        venueID: venueID,
                        urlParm: ods,
                        code: c
                    },
                    url: "venue/1",
                    success: function(e) {
                        if (e.status == "200") {
                            if (e.url.length > 0) {
                                setTimeout(function() {
                                    window.location.href = "pay?" + e.url
                                },
                                500)
                            } else {
                                alert("系统错误，请稍后再试！")
                            }
                        } else {
                            if (e.status == "104") {
                                $("#checkCode").click();
                                alert(e.msg);
                                $("#vCode").val("")
                            } else {
                                alert(e.msg)
                            }
                        }
                    },
                    error: function(e, g, f) {
                        alert("系统发生错误：\r\n" + f)
                    }
                })
            }
        }
    } else {
        alert("请先点击左侧选择场次！")
    }
};
