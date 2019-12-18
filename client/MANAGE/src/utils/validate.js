/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 判断邮箱格式 */
export function  validateEmail(rule, value, callback) {
    console.log("检验邮箱" + value)
    if(value == '' || value == undefined || value == null){
        callback();
    }
    let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!emailRegex.test(value)) {
        callback(new Error('邮箱格式不正确！'))
    } else {
        callback();
    }
}

/* 是否身份证号码*/
export function validateId(rule, value, callback) {
    console.log("检验身份证" + value)
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(value=='' || value==undefined || value==null){
        callback();
    }else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的身份证号码'));
        } else {
            callback();
        }
    }
}

/* 判断手机号格式 */
export function validatePhone(rule, value, callback){
    if(value == '' || value == undefined || value == null){
        callback(new Error('请输入手机号码~'));
    }
    let phoneRegex = /^1[345678]\d{9}$/;
    if (!phoneRegex.test(value)) {
        callback(new Error('手机号码格式不正确！'))
    } else {
        callback();
    }
}


/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback){
    console.log("检验手机号" + value)
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的电话号码或者固话号码'));
        } else {
            callback();
        }
    }
}


export const  validateRatios = (rule, value, callback) => {
    if(value == ''){
        callback(new Error('请输入百分比~'));
    }{
        let ratioRegex = /^(50)|([1-4]？\d)$/;
        if (!ratioRegex.test(value)) {
            callback(new Error('值范围为1-50！'))
        } else {
            callback();
        }
    }
};


/** 验证最大数值为5000 */
export function numberLimits1(rule, value, callback){
    if(!Number(value)){
        callback(new Error('请输入正确数字'))
    }
    if(value < 0 || value > 5000){
        callback(new Error('用户数量最大为5000'));
    }
    else{
        callback()
    }
}

/** 验证最大数值为10 */
export function numberLimits2(rule, value, callback){
    if(!Number(value)){
        callback(new Error('请输入正确数字'))
    }
    if(value < 0 || value > 10){
        callback(new Error('有效期限最大为10'));
    }
    else{
        callback()
    }
}