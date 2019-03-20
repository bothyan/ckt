function checkInput(type, _this, value) {
  let result;
  switch (type) {
    case 'mail':
      result = mail(_this, value);
      break;
    case 'pw':
      result = pw(_this, value);
      break;
    case 'tel':
      result = tel(_this, value);
      break;
    case 'usr':
      result = usr(_this, value);
      break;
    case 'yzm':
      result = yzm(_this, value);
      break;
    case 'teamName':
      result = teamName(_this, value);
      break;
    default:
      result = canNotBeEmpty(_this, value, type);
      break;
  }
  function usr(_this, value) {
    let mail = /^\w[-\w.+]*@([A-Za-z0-9][-_A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/, // 注册时根据输入的账号类别启用相应的注册页面
        tel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!value) {
      _this.msg = "请输入用户名！";
      _this.isError = true;
    } else if (!mail.test(value) && !tel.test(value)) {
      _this.msg = "请输入符合要求的用户名！";
      _this.isError = true;
    } else if (mail.test(value) || tel.test(value)) {
      _this.msg = "";
      _this.isError = false;
      return "success";
    }
    return "error";
  }

  function mail(_this, value) {
    let reg = /^\w[-\w.+]*@([A-Za-z0-9][-_A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/; // 后端版本
    if (value == "") {
      _this.msg = "请输入邮箱！";
      _this.isError = true;
    } else if (!reg.test(value)) {
      _this.msg = "请输入正确的邮箱地址！";
      _this.isError = true;
    } else {
      _this.msg = "";
      _this.isError = false;
      return "success";
    }
    return "error";
  }

  function tel(_this, value) {
    let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    if (value == "") {
      _this.msg = "请输入手机号！";
      _this.isError = true;
    } else if (!reg.test(value)) {
      _this.msg = "请输入正确的手机号！";
      _this.isError = true;
    } else {
      _this.msg = "";
      _this.isError = false;
      return "success";
    }
    return "error";
  }

  function pw(_this, value) {
    let reg = /^[a-zA-Z0-9!@#\\*_]{6,18}$/; //6-18位
    if (!value) {
      _this.msg = "请输入密码！";
      _this.isError = true;
    } else if (!reg.test(value)) {
      _this.msg = "密码长度为6-18位之间";
      _this.isError = true;
    } else {
      _this.msg = "";
      _this.isError = false;
      return "success";
    }
    return "error";
  }

  function yzm(_this, value) {
    let reg = /[a-zA-Z0-9]{4}/; // 4位数字或字母
    if (!value) {
      _this.msg = "请输入验证码！";
      _this.isError = true;
    } else if (!reg.test(value)) {
      _this.msg = "请输入符合要求的验证码！";
      _this.isError = true;
    } else {
      _this.msg = "";
      _this.isError = false;
      return "success";
    }
    return "error";
  }

  function teamName(_this, value) {
    if (!value) {
      _this.msg = "团队名称不能为空";
      _this.isError = true;
    } else if (value.length > 20) {
      _this.msg = "团队名称不能超过20个字符";
      _this.isError = true;
    } else {
      _this.msg = "";
      _this.isError = false;
      return "success";
    }
    return "error";
  }

  function canNotBeEmpty(_this, value, type) {
    let name = type === 'dir' ? '文件夹名称' : type;
    if (!value) {
      _this.msg = `请输入${name}！`;
      _this.isError = true;
    } else {
      _this.msg = "";
      _this.isError = false;
      return "success";
    }
    return "error";
  }

  return result;
}

module.exports = checkInput;