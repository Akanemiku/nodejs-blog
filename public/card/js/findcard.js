var pageNum = 4;
var searchSchoolText = [];
var searchLocationText = [];

var locations = [
    "励耘楼", "乐育楼", "元白楼", "弘文楼", "木铎楼", "金声楼", "丽泽楼", "励教楼", "南曦园",
    "图书馆", "海华苑", "京华苑", "燕华苑", "粤华苑", "文华苑", "田径场", "国交足球场", "体育馆",
    "学一食堂", "学二食堂", "学三食堂", "游泳池", "京师家园", "会同街",
];
var schools = [
    "教育学院", "文学院", "信息技术学院", "国际商学部", "管理学院", "不动产学院", "法律与行政学院", "设计学院", "艺术与传播学院",
    "工程技术学院", "外国语学院", "应用数学学院", "物流学院", "运动休闲学院", "马克思主义学院", "继续教育学院", "未来地球研究院"
];
var buildingDescribe = {
    "丽泽湖": "丽泽湖坐落在丽泽楼前，每天清晨，当阳光懒洋洋地撒在湖面上时，风景是多么的让人惊叹；在蔚蓝的天空掩映下湖水是那样湛蓝，那样晶莹透澈。但时不时有各种“野怪”出现，其中野猪最为人知晓。"
    ,
    "励耘楼": "“励耘”源自北师大老校长陈垣先生的书屋名叫“励耘书屋”。中文系著名教授、文献学研究专家启功先生为报师恩，设立了励耘讲学助学基金。" +
        "以“励耘”命名，借此表达陈垣老校长和启功先生对北师大学子的治学期望。"
    ,
    "乐育楼": "“乐育”取自“《菁菁者莪》：乐育材也。君子能长育人材，天下喜乐之也。这段话意思是老师的职业向往是成为品德高尚乐于育人的好老师。乐育楼被同学们戏称为“最偏僻的教学楼”，只因它位于北师珠的“角落”，事实上由于隐世而立，更为乐育楼平添了神秘高洁的色彩。"
    ,
    "元白楼": "“元白”为中国著名教育学家启功先生字，将教学楼以启功先生字命名，也是为了纪念启功先生。元白楼原名“设计楼”，也就是设计院同学上课创作的教学楼。独特的艺术气息，也成了学校的“网红打卡点”。"
    ,
    "弘文楼": "“弘文”，一是北师大本部有“ 弘文励教”光荣传统；二是唐朝“弘文馆”藏书馆，也是皇帝招贤纳士的场所。取名弘文，表达了北师珠汇聚、培养人才的美好愿景。" +
        "弘文楼原名综合楼，也被称为“英语楼”，学校内所有学生大学英语课程都在弘文楼进行。"
    ,
    "木铎楼": "“木铎”取自《论语》“天下之无道也久矣，天将以夫子为木铎”，有教化民众之意。同时也因“木铎”是北师大的标志物，以木铎为名展现北师特色风范。"
    ,
    "金声楼": "金声，比喻音韵响亮、和谐，也比喻人的知识渊博、才学精到。孟子曾引用“金声玉振”来称颂孔子的思想为“集大成”。取名金声表明了学校对学子们的殷切希望。金声楼与木铎楼是校内“阳气”最重的地方，因为两栋楼是信息与技术学院、工程学院两大学院的学生主要上课点。"
    ,
    "丽泽楼": "“丽泽”出自《易经》：丽泽兑，君子以朋友讲习。意思是与朋友交流学习、分享心得。这是距离生活区最近的教学楼，也是许多社团日常例会的场所，所以这也成为学生选课时最受欢迎的教学楼。"
    ,
    "励教楼": "“励教”取自以励风教，育人为本。励教楼是原UIC（北京师范大学-香港浸会大学联合国际学院）教学楼。励教楼具有香港特有的艺术设计感，也是学子们电影作业拍摄的重要场所。"
    ,
    "南曦园": "取名南曦园，一是因其位于北师珠校园南边，二是与北师大本部“曦园”相呼应。在南曦园上课的主要是艺术与传播学院的教学楼，也就是说在南曦园你能够偶遇播音、舞蹈、影视专业的漂亮小姐姐帅气小哥哥。另外，南曦园艺传学院同学最常举办展览话剧演出等专业实践活动的场所。"
    ,
    "田径场": "北师珠建有足球场两个，350米、400米标准塑胶运动场各一个。大型集会、军训演练在大型足球场也是室外体育的学生、夜晚是夜跑、双节棍训练和足球训练的场所，也是国际青少年足球比赛的举办场所。小型的足球场进行校内球队足球训练、学院、教职工比赛都在小足球场举行。"
    ,
    "国交足球场": "北师珠建有足球场两个，350米、400米标准塑胶运动场各一个。大型集会、军训演练在大型足球场也是室外体育的学生、夜晚是夜跑、双节棍训练和足球训练的场所，也是国际青少年足球比赛的举办场所。小型的足球场进行校内球队足球训练、学院、教职工比赛都在小足球场举行。"
    ,
    "体育馆": "大足球场旁就是风雨操场，由于外观神似乌龟背，因此又被称为龟壳。龟壳有篮球场、排球场、羽毛球场、乒乓球场等，甚至在二楼还有环形塑胶跑道，所以即便下雨的体育课，也是躲不过课前热身长跑的。"
    ,
    "海华苑": "海华苑被称为“北师珠CBD”，因海华苑周边分布了奶茶、小吃、餐厅等各种商店，就连宿舍区两大电瓶乘车点也布在海华苑。"
    ,
    "京华苑": "京华苑在北师珠校园的最西边，宿舍以五栋白色建筑构成，楼层参差不齐，却有独特美感，形成一道美景，因而也被称为北师珠“布达拉宫”。"
    ,
    "燕华苑": "燕华苑是被自然生态环保的宿舍区，不仅养人还养猫。燕华苑是北师珠“猫奴”最喜欢的地方，在燕华苑的宿舍楼下聚集了许多“流浪猫”，它们不认生，甚至有别样的傲娇。不管什么时候你都能看到学校的小哥哥小姐姐带着猫粮只求“博猫一笑”。"
    ,
    "粤华苑": "粤华苑被誉为“北师珠养老院”，环境优美远离喧嚣，但农行、照相馆、超市、快递点、面包店、两大食堂等生活必备服务一应俱全，甚至还有健身房、篮球场、网球场、攀岩馆等运动场所满足爱好运动的同学们。"
    ,
    "学一食堂": "学一食堂菜色丰富，一楼以自选煲汤为主。因为“形势与政策”霸位，许多学生都喜欢到学一买份酱香饼配上紫薯汁，果腹又减肥，尤其是能节约用餐时间守住位置。"
    ,
    "学二食堂": "学二食堂在粤华深处，学二食堂以各地小吃、粉面为主，因为偏僻，饭点不用排队。"
    ,
    "学三食堂": "学三食堂在海华苑，是北师珠菜式最丰富的食堂，一到饭点就会人满为患，所以在学三食堂吃饭一定要有足够耐心，还要有为美食饿的起的决心。"
    ,
    "游泳池": "北师珠的游泳馆，一直如度假村般的存在。学生凭借五块钱就可以享受露天豪华游泳池，简直太美好了！"
    ,
    "文华苑": "新装修的文华苑无疑是最豪华的宿舍，不仅有图书馆还配套免费健身房，更有运动休闲学院的研究生私教小哥哥小姐姐哦！"
    ,
    "会同街": "忙碌了一天的学习，来到会同烧烤街撸串是再美好不过的事情了，会同街因为店铺较大，聚会比较方便，而且在京华苑走过去几分钟就可以到达，经常会成为社团聚会的首选位置。"
    ,
    "京师家园": "这里居住的大多数是老师，也有考研、养宠物的学生居住在这里，比起学校的宿舍，这里具有24小时的热水，不停电；去乐育楼和励耘楼上课，走路五分钟就可以到达课室。"


};

for (var value of schools) {
    $('#selectSchool').append("<option value='" + value + "'>" + value + "</option>")
}

for (var value of locations) {
    $("#selectLocation").append("<option value='" + value + "'>" + value + "</option>")
}

//删除数组中指定元素
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

function deleteSchool(index) {
    // alert(index)
    $("#school" + index).remove();
    console.log("chools[index]:" + schools[index])
    removeByValue(searchSchoolText, schools[index])
    getMsg(pageNum);
}

function deleteLocation(index) {
    $("#location" + index).remove();
    console.log("chools[index]:" + locations[index])
    removeByValue(searchLocationText, locations[index])
    getMsg(pageNum);
}

$(document).ready(function () {

    $("#detailModal").on("hidden.bs.modal", function () {
        $(this).removeData("bs.modal");
    });
    // $("#detailModal").modal('show');

    $('.setPageDiv').change(function () {

        getMsg(parseInt($(this).val()))
    });


    getMsg(pageNum);


    // $(".delete").click(function () {
    //     $(this).parent().remove()
    // });

    //下拉框选择地点后自动更换图片
    $('#selectLocation').change(function () {
        var locationVal = $("#selectLocation").val();
        if (searchLocationText.indexOf(locationVal) === -1) {
            // addLocationLabel($("#selectLocation").val());
            var index = locations.indexOf(locationVal);
            var newElement = "<span class='locationlabel' id='location" + index + "'><span>" + locationVal + "</span><span onclick='deleteLocation(" + index +")' style='color: white;cursor: pointer;'><img src='/public/card/icon/delete.png' class='deleteImg'></span></span>";
            $(".mylabel").append(newElement);
            searchLocationText.push(locationVal);
            getMsg(pageNum);
        } else {
            alert("你已选择" + locationVal + "!");
        }

    });

    $('#selectSchool').change(function () {
        var schoolVal = $("#selectSchool").val();
        if (searchSchoolText.indexOf(schoolVal) === -1) {
            var index = schools.indexOf(schoolVal);
            var newElement = "<span class='schoollabel' id='school" + index + "'><span>" + schoolVal + "</span><span onclick='deleteSchool(" + index + ")' style='color: white;cursor:pointer;'><img src='/public/card/icon/delete.png' class='deleteImg'><span/></span>";
            $(".mylabel").append(newElement);
            // $(".delete").click(function () {
            //     $(this).parent().remove();
            //     searchSchoolText.remove(schoolVal)
            //     getMsg(pageNum);
            // });
            searchSchoolText.push(schoolVal);
            getMsg(pageNum);
        } else {
            alert("你已选择" + schoolVal + "!");
        }

    });


    $("#deleteAllLabel").click(function () {
        searchLocationText = [];
        searchSchoolText = [];
        $('#search').val('')
        $('.mylabel').empty('.schoollabel');
        getMsg(pageNum);
    });

    // $('#submit').click(function () {
    //     console.log($("#selectLocation").val())
    // });

    $("#JS_exprMap").maphilight({
        strokeColor: "666666",
        // fillColor: "yellow",
//        alwaysOn :"true",
    });

    //地图
    $("area").each(function () {

        var firstcoord = $(this).attr("coords").split(",")[0];
        var index_num = 0;
        var name = $(this).attr("alt");
        $(this).click(function () {
            //点击地图上的建筑物更换下拉框的地址
            $('#selectLocation').selectpicker('val', (name));
            if (searchLocationText.indexOf(name) === -1) {
                addLocationLabel(name);
                searchLocationText.push(name)
                getMsg(pageNum);
            } else {
                alert("你已选择" + name + "!");
            }
        });
        $(this).mouseenter(function (e) {
            // index_num = $(this).index();
            // console.log(name);
            $('.buildingName').html(name);
            $('.buildingDescribe').html(buildingDescribe[name]);


        });
    });


    function addLocationLabel(name) {
        $(".mylabel").append("<span class='locationlabel'><span>" + name + "</span><a href='#' style='color: white;' class='delete'><img src='/public/card/icon/delete.png' class='deleteImg'></a></span>");
        $(".delete").click(function () {
            $(this).parent().remove();
            searchLocationText.remove(name)
            getMsg(pageNum);
        });
    }

    $('#searchText').click(function () {
        getMsg(pageNum);
    })


});

function getMsg(num) {
    console.log("searchSchoolText:" + searchSchoolText)
    console.log("searchLocationText:" + searchLocationText)
    console.log("seachText:" + $('#search').val())
    $.ajax({
        url: '/getcardlist',
        type: 'GET',
        data: {
            search: $('#search').val(),
            searchSchool: searchSchoolText,
            searchLocation: searchLocationText
        },
        dataType: 'json',
        success: function (data) {
            // console.log(data.list);
            // console.log(typeof(data.list))
            //1.计算分页数量
            var showNum = num;
            var dataL = data.list.length;
            var pageNum = Math.ceil(dataL / showNum);
            $('.Pagination').pagination(pageNum, {
                num_edge_entries: 1, //边缘页数
                num_display_entries: 4, //主体页数
                items_per_page: 1, //每页显示1项
                prev_text: "上一页",
                next_text: "下一页",
                callback: function (index) {
                    // var newElement = "";
                    $('.list-group').empty();

                    // console.log(showNum * index + '~' + parseInt(showNum * index) + parseInt(showNum));
                    // console.log("index:" + index)
                    for (var i = showNum * index; i < showNum * index + showNum; i++) {
                        // console.log(i);
                        if (i < dataL) {
                            // newElement += "<span style='cursor:pointer' data-toggle='modal'  class='detailCard' id=card" + data.list[i].id + ">" +
                            var newElement = "<a href='/detailcard?id=" + data.list[i].id + "' data-toggle='modal' data-target='#detailModal'>" +
                                "<div class='list-group-item' name='xh" + data.list[i].stu_no + "'>" +
                                data.list[i].stu_no + "<span style='float:right'>" + getDate('mm-dd', data.list[i].publish_time * 1000) + "发布</span><br>" +
                                data.list[i].stu_name + "<br>" +
                                data.list[i].stu_school + "<img src='/public/card/icon/inspect.png' class='inspect' /><span style='float: right;font-size: larger'>" + data.list[i].lost_location + "</span><br>" +
                                "</div></a>";

                            // $('.detailCard').click(function () {
                            //     alert($(this).attr("id"))
                            //     console.log($(this).attr('id'))
                            //     $("#picker").val()
                            // });
                            $('.list-group').append(newElement)


                        }
                    }


                }
            })

        }
    })
}


/* 搜索框  */
function onKeyPress(event) {
    if (event.keyCode == 13) { // enter 键
        getMsg(pageNum);
    }
}

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function timestampToTime(timestamp) {
    var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

    strDate = Y + M + D + h + m + s;
    return strDate;

}

//补0操作
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}


