//文件下载
var fs = require("fs");
var path = require("path");
var request = require("request");

//创建文件夹目录
// var dirPath = path.join(__dirname, "file");
// if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath);
//     console.log("文件夹创建成功");
// } else {
//     console.log("文件夹已存在");
// }


export const downLoadFile = (url, dirPath, fileName, count = 0) => {
    let fileNameNotSuffix = fileName.substring(0, fileName.lastIndexOf("."));// 文件名
    let fileSuffix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);//截后缀名

    let tmpName = count ? fileNameNotSuffix + " ("+count+")." + fileSuffix : fileName

    let savePath = dirPath + "/" + tmpName;

    if(!fs.existsSync(dirPath)){
        // console.log('mkdirSync::', dirPath)
        mkdirsSync(dirPath);
    }
    //判断保存路径是否已存在
    if (!fs.existsSync(savePath)) {
        let stream = fs.createWriteStream(savePath);
        var options = {
            url: encodeURI(url)
            // ,
            // headers: {
            //     'User-Agent': 'request',
            //     'Accept':' text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            //     'Accept-Language':'zh-CN,zh;q=0.9',
            //     'Upgrade-Insecure-Requests':1,
            //     'Connection':'keep-alive',
            //     'Accept-Encoding':'gzip, deflate'
            // }
        };

        return new Promise(function (resolve, reject) {
            request(options, callback).pipe(stream).on("close", function (err) {
                if (err) {
                    console.log("文件下载错误");
                } else {
                    console.log("文件下载完毕", tmpName);
                    // callback(tmpName);
                    resolve(tmpName)
                }
            });
        })


        // request(url).pipe(stream).on("close", function (err) {
        //     if (err) {
        //         console.log("文件下载错误");
        //     } else {
        //         console.log("文件下载完毕", tmpName);
        //         callback(tmpName);
        //     }
        // });


    } else {
        count ++
        return downLoadFile(url, dirPath, fileName, count);
    }

}

const callback = (error, response, body) => {
    // console.log("error=======",error)
    // console.log("response=======",response)
    // console.log("body=======",body)
}

/**
 * Created by RockeyCai on 16/2/22.
 * 创建文件夹帮助类
 */

//递归创建目录 异步方法
export const mkdirs = (dirname, callback) => {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            //console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}

//递归创建目录 同步方法
export const mkdirsSync = (dirname) => {
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

