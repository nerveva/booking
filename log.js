var log4js = require('log4js');  
log4js.configure({  
    appenders: [{
        type: 'console',  
    category: "console"  
    }, //控制台输出  
    {
    type: "dateFile",  
    filename: 'logs/server.log',  
    pattern: "_yyyy-MM-dd",  
    alwaysIncludePattern: false,  
    category: 'serverLog'  
    }//日期文件格式  
    ],  
    replaceConsole: true,   //替换console.log  
    levels:{  
        serverLog: 'INFO'  
    }  
});  

var sLog = log4js.getLogger('serverLog');  

exports.logger = sLog;  

exports.use = function(app) {  
    //页面请求日志,用auto的话,默认级别是WARN  
    //    //app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));  
            app.use(log4js.connectLogger(sLog, {level:'debug', format:':method :url'}));  
}
