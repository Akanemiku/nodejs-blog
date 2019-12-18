//转换年月日方法
function getDate(format, str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSec = oDate.getSeconds();
    var oTime;
    if (format == 'yyyy-mm-dd') {
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay);//最后拼接时间
    } else if (format == 'yyyy/mm/dd') {
        oTime = oYear + '/' + getzf(oMonth) + '/' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSec);//最后拼接时间
    } else if (format == 'mm-dd') {
        oTime = getzf(oMonth) + '-' + getzf(oDay);//最后拼接时间
    }
    return oTime;
};