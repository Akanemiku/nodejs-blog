$('body').show();
$('.version').text(NProgress.version);
NProgress.start();
setTimeout(function () {
    NProgress.done();
    $('.fade').removeClass('out')
}, 1000);
(function () {
    $('img').attr('draggable', 'false');
    $('a').attr('draggable', 'false')
})();

function setCookie(name, value, time) {
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
}

function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000
    }
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2])
    } else {
        return null
    }
}

$.fn.navSmartFloat = function () {
    var position = function (element) {
        var top = element.position().top,
            pos = element.css("position");
        $(window).scroll(function () {
            var scrolls = $(this).scrollTop();
            if (scrolls > top) {
                $('.header-topbar').fadeOut(0);
                $('.header-topbar2').fadeIn(0);
                if (window.XMLHttpRequest) {
                    element.css({
                        position: "fixed",
                        top: 0
                    }).addClass("shadow")
                } else {
                    element.css({
                        top: scrolls
                    })
                }
            } else {
                $('.header-topbar').fadeIn(500);
                $('.header-topbar2').fadeOut(0);
                element.css({
                    position: pos,
                    top: top
                }).removeClass("shadow")
            }
        })
    };
    return $(this).each(function () {
        position($(this))
    })
};
$("#navbar").navSmartFloat();
$("#gotop").hide();
$(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
        $("#gotop").fadeIn()
    } else {
        $("#gotop").fadeOut()
    }
});
$("#gotop").click(function () {
    $('html,body').animate({
        'scrollTop': 0
    }, 500)
});
$("img.thumb").lazyload({
    placeholder: "/public/home/images/occupying.png",
    effect: "fadeIn"
});
$(".single .content img").lazyload({
    placeholder: "/public/home/images/occupying.png",
    effect: "fadeIn"
});
document.body.onselectstart = document.body.ondrag = function () {
    return false
};
$('[data-toggle="tooltip"]').tooltip();
jQuery.ias({
    history: false,
    container: '.content',
    item: '.excerpt',
    pagination: '.pagination',
    next: '.next-page a',
    trigger: '查看更多',
    loader: '<div class="pagination-loading"><img src="public/home/images/loading.gif" /></div>',
    triggerPageThreshold: 5,
    onRenderComplete: function () {
        $('.excerpt .thumb').lazyload({
            placeholder: 'public/home/images/occupying.png',
            threshold: 400
        });
        $('.excerpt img').attr('draggable', 'false');
        $('.excerpt a').attr('draggable', 'false')
    }
});
$(window).scroll(function () {
    var sidebar = $('.sidebar');
    var sidebarHeight = sidebar.height();
    var windowScrollTop = $(window).scrollTop();
    if (windowScrollTop > sidebarHeight - 60 && sidebar.length) {
        $('.fixed').css({
            'position': 'fixed',
            'top': '70px',
            'width': '360px'
        })
    } else {
        $('.fixed').removeAttr("style")
    }
});
$('#find').click(function () {
    window.location.href = "/findcard"
});
$('#lost').click(function () {
    window.location.href = "/publishcard"
});
$(function () {
    $("#comment-submit").click(function () {
        var imgSrc = $('.comment-title').find("img").attr("src");
        var commentContent = $("#comment-textarea");
        var commentButton = $("#comment-submit");
        var promptBox = $('.comment-prompt');
        var promptText = $('.comment-prompt-text');
        var articleid = $('.articleid').val();
        var loginUsesr = $('.loginUser').val();
        promptBox.fadeIn(400);
        if (!imgSrc) {
            var str = '<a data-toggle="modal" data-target="#loginModal2">登录?</a>';
            promptText.html("请登录后再进行评论" + `` + str);
            commentButton.attr('disabled', true);
            commentButton.addClass('disabled');
            return false
        } else {
            if (commentContent.val() === '') {
                promptText.text('请留下您的评论');
                return false
            }
            commentButton.attr('disabled', true);
            commentButton.addClass('disabled');
            promptText.text('正在提交...');
            $.ajax({
                type: "POST",
                url: "/comment",
                data: {
                    commentContent: replace_em(commentContent.val()),
                    news_id: articleid,
                    user_name: loginUsesr
                },
                cache: false,
                success: function (data) {
                    if (data.ok) {
                        promptText.text(data.msg);
                        window.location.reload()
                    } else {
                        promptText.text(data.msg)
                    }
                    commentContent.val(null);
                    $(".commentlist").fadeIn(300);
                    commentButton.attr('disabled', false);
                    commentButton.removeClass('disabled')
                }
            });
            promptBox.fadeOut(4000);
            return false
        }
    })
});

function replace_em(str) {
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="/public/home/images/arclist/$1.gif" border="0" />');
    return str
}

$(function () {
    $('#isLogining').val();
    $("#login_btn").click(function () {
        $.ajax({
            url: '/login',
            type: 'post',
            data: {
                username: $("#username").val(),
                password: $("#password").val()
            },
            success: function (json) {
                if (json.ok) {
                    alert(json.username + "" + json.msg)
                } else {
                    alert(json.msg)
                }
                if (json.username) {
                    $('#loginBox').addClass('hide');
                    $('#widget').removeClass('hide');
                    window.location.reload()
                }
                $('#loginModal').modal('toggle')
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
});

function logout() {
    $.get("/ajax_logout", function (data) {
        if (data.ok) {
            window.location.reload()
        }
    })
}

try {
    if (window.console && window.console.log) {
        console.log("\n欢迎访问小北博客！");
        console.log("\nCopyright ©2019 bnuz-app. All rights reserved.")
    }
} catch (e) {
}