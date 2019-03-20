import { fontBaseLine } from './fontBaseLine'
/**
 * 解析transform返回translate跟scale
 * @export
 * @param {String} str transform
 * @param {String} key translate或者scale
 * @returns 
 */
export function getTransformAttr(str, key) {

    str = str || '';

    str = str.replace(/NaN/g, '0');

    var reg = key + "\\([\\d\\,\\E\\e\\-\\.\\s]+";

    var value = str.match(reg);

    if (value == null) {
        if (key == 'scale') {
            return [1, 1];
        }
        if (key == 'rotate') {
            return [0, 0, 0]
        }
        return [0, 0];
    }

    value = value.toString().replace(/\,+|\s+/g, "|");

    value = value.toString().replace(/\|+/g, "|");

    if (value != null) {

        value = value.replace(key + "(", "").split("|");

        var value_length = value.length;

        for (var i = 0; i < value_length; i++) {
            if (isNaN(value[i]) || value[i] == 'NaN') {
                value[i] = 0;
            }
        }

        return value;

    } else {
        if (key == 'scale') {
            return [1, 1];
        }
        if (key == 'rotate') {
            return [0, 0, 0]
        }
        return [0, 0];

    }

}

export function setTransformAttr(str, key, value) {

    var reg = eval("/" + key + "\\([\\d\\,\\e\\-\\.\\s]+\\)/");

    var new_value = key + "(" + value[0];

    var length = value.length;

    for (var i = 1; i < length; i++) {

        new_value = new_value + "," + value[i];

    }

    str = str || "";

    str = str.replace(/NaN/g, '0');

    str = str.replace(reg, "");

    str = str + new_value + ")";

    return str;

}


/**
 * 判断指定的元素是不是在数组之中。
 * @param val 要判断的数据
 * @param array 判断的数组
 * @param index 是否返回索引
 * @returns {*} //开启返回索引之后需要判断 ===false 存在索引是0 状态
 */
export function inArray(val = '', array = [], index = false) {
    if (val == '' || array.length < 1) {

    } else {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == val) {
                if (index)
                    return i;
                else
                    return true;
            }
        }
    }
    return false;
}
/**
 * 判断一个对象或者是否为空
 * @export
 * @param {any} val 
 * @returns 
 */
export function _empty(val) {

    if (val == undefined)
        return true;
    if (typeof(val) == 'object') {
        for (let i in val) {
            if (val.hasOwnProperty(i))
                return false;
        }
    } else if (typeof(val) == 'array') {
        if (val.length > 0) {
            return false;
        }
    }
    return true;
}

/**
 * 获取对象、数组的长度、元素个数
 * @export
 * @param {object、array、string} obj 要计算长度的元素
 * @returns {int} 传入的长度 0 为空
 */
export function _count(obj) {
    var objType = typeof obj;
    if (objType == "string") {
        return obj.length;
    } else if (objType == "object") {
        var objLen = 0;
        for (var i in obj) {
            objLen++;
        }
        return objLen;
    }
    return 0;
}

/**
 * 取得指定节点中的某个节点
 * @export
 * @param {Node} element 指定节点
 * @param {String} selector class名或者id名等
 * @returns 
 */
export function $find(element, selector) {
    return element.querySelectorAll(selector);
}

export function formatSvg(str) {
    // 格式化svg节点，防止样式覆盖
    if (str.match(/SVGID_/g) != null) {
        str = str.replace(/SVGID_/g, 'SVGID_' + new Date().getTime());
    } else {
        // 设计真是坑
        let repeat_id = str.match(/url\(\#.+\)/);
        if (repeat_id != null) {
            repeat_id = repeat_id[0].replace('url(#', '').replace(')', '');
            let new_repeat_id = repeat_id + new Date().getTime();
            let re = RegExp('#' + repeat_id, 'g');
            str = str.replace(re, '#' + new_repeat_id);
            re = RegExp('id="' + repeat_id + '"', 'g');
            str = str.replace(re, 'id="' + new_repeat_id + '"');
        }
    }

    return str;
}

/**
 * elememt json 处理
 * @export
 * @param {Json} json 
 */
export function elementJsonHandle(json) {
    let ele_json;
    // console.log(JSON.parse(JSON.stringify(json)));
    if (json.reverse == undefined) {
        json.reverse = 'translate(0,0)rotate(0,0,0)';
    }
    if (json.group == undefined) {
        json.group = '';
    }
    if (json['group-transform'] == undefined) {
        json['group-transform'] = '';
    }
    if (_empty(json['data-elem'].shadow)) {
        json['data-elem'].shadow = {
            "blur": 12,
            "offset": 18,
            "opacity": 0.2,
            "show": false
        };
    }
    if (json['data-elem'].lock == undefined) {
        json['data-elem'].lock = false;
    }
    //if(json.eleid == undefined) 
    json.eleid = 'ele' + new Date().getTime() + "_" + Math.floor(Math.random() * 10000) + '_' + window.material_id_index++;
    switch (json['data-type']) {
        case 'img':
            ele_json = _imageJsonHandle(json);
            break;
        case 'background':
            ele_json = _backgroundJsonHandle(json);
            break;
        case 'svgImage':
            ele_json = _svgJsonHandle(json);
            break;
        case 'svgFrame':
            ele_json = _svgFrameHandle(json);
            break;
        case 'text':
            ele_json = _textHandle(json);
            break;
        case 'svgChart':
            ele_json = json;
            break;
    }
    return ele_json;
}

/**
 * image json处理（内部方法）
 * @param {json} ele_json 
 * @returns 
 */
function _imageJsonHandle(ele_json) {
    // 设置image需要的各种初始值
    if (_empty(ele_json['data-elem'].filter)) {
        ele_json['data-elem'].filter = {
            "brightness": 0,
            "contrast": 0,
            "crossProcess": 0,
            "gaussianBlur": 0,
            "saturation": 0,
            "tint": 0
        };
    }
    if (_empty(ele_json['data-elem'].shadow)) {
        ele_json['data-elem'].shadow = {
            "blur": 12,
            "offset": 18,
            "opacity": 0.2,
            "show": false
        };
    }
    if (ele_json['data-elem'].lock == undefined) {
        ele_json['data-elem'].lock = false;
    }
    if (ele_json['data-elem'].viewBox == undefined) {
        ele_json['data-elem'].viewBox = '';
    }
    if (ele_json['data-elem'].isCut == undefined) {
        ele_json['data-elem'].isCut = false;
    }
    ele_json['data-elem']['dataImgUrl'] = false;
    return ele_json;
}

/**
 * svg json处理
 * @param {any} ele_json 
 */
function _svgJsonHandle(ele_json) {
    // 设置svg需要的各种初始值
    if (ele_json['data-elem'].viewBox == undefined) {
        ele_json['data-elem'].viewBox = '0 0 0 0';
    }
    if (ele_json['data-elem']['data-xhref-imgs'] == undefined) {
        ele_json['data-elem']['data-xhref-imgs'] = {};
    }
    if (ele_json['data-elem']['data-colors'] == undefined) {
        ele_json['data-elem']['data-colors'] = false;
    }
    if (ele_json['data-elem']['vary'] == undefined) {
        ele_json['data-elem']['vary'] = {};
    }
    ele_json.loading = false;
    return ele_json;
}

/**
 * background json处理
 * @param {any} ele_json 
 */
function _backgroundJsonHandle(ele_json) {
    if (_empty(ele_json['data-elem'].filter)) {
        ele_json['data-elem'].filter = {
            "brightness": 0,
            "contrast": 0,
            "crossProcess": 0,
            "gaussianBlur": 0,
            "saturation": 0,
            "tint": 0
        };
    }
    if (ele_json['data-elem'].lock == undefined) {
        ele_json['data-elem'].lock = false;
    }

    return ele_json;
}

function _svgFrameHandle(ele_json) {
    if (ele_json['data-elem'].viewBox == undefined) {
        ele_json['data-elem'].viewBox = '0 0 0 0';
    }
    if (ele_json['data-elem']['data-xhref-imgs'] == undefined) {
        ele_json['data-elem']['data-xhref-imgs'] = {};
    }
    if (ele_json['data-elem']['vary'] == undefined) {
        ele_json['data-elem']['vary'] = false;
    }
    if (ele_json['data-elem']['data-colors'] == undefined) {
        ele_json['data-elem']['data-colors'] = false;
    }
    // for(var i in ele_json['data-elem']['data-xhref-imgs']) {
    // 	ele_json['data-elem']['data-xhref-imgs'][i]['imgUrl'] = false;
    // 	ele_json['data-elem']['data-xhref-imgs'][i]['EditorImg'] = false;
    // }
    if (_empty(ele_json['data-elem'].filter)) {
        ele_json['data-elem'].filter = {
            "brightness": 0,
            "contrast": 0,
            "crossProcess": 0,
            "gaussianBlur": 0,
            "saturation": 0,
            "tint": 0
        };
    }
    ele_json.loading = false;
    return ele_json;
}

function _textHandle(ele_json) {
    if (ele_json['data-elem'].paragraphs) {
        delete ele_json['data-elem'].paragraphs;
    }
    if (ele_json['data-elem']['data-italic'] == undefined) {
        ele_json['data-elem']['data-italic'] = false;
    }
    if (ele_json['data-elem']['data-decoration'] == undefined) {
        ele_json['data-elem']['data-decoration'] = false;
    }
    if (ele_json['data-elem']['data-bold'] == undefined) {
        ele_json['data-elem']['data-bold'] = 0;
    }
    if (ele_json['data-elem']['data-align'] == undefined) {
        ele_json['data-elem']['data-align'] = 'left';
    }
    return ele_json;
}

/**
 * create by suti
 * @param func
 * @param wait
 * @param options
 * @return {Function}
 * @private
 */
export function _throttle(func, wait, options) {
    let context, args, result
    let timeout = null
    let previous = 0
    if (!options) options = {}
    let later = function() {
        previous = options.leading === false ? 0 : Date.now()
        timeout = null
        result = func.apply(context, args)
        if (!timeout) context = args = null
    }
    return function() {
        let now = Date.now()
        if (!previous && options.leading === false) previous = now
        let remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            result = func.apply(context, args)
            if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
        return result
    }
}


/**
 * 取得字体基线到文字顶的位置
 * @export
 * @param {Number} fontSize 
 * @param {String} fontFamily 
 * @returns 
 */
export function getBaseLineFromTop(fontSize, fontFamily) {
    let fontBaseLineJson = fontBaseLine();
    if (fontFamily === '微软雅黑') {
        fontFamily = 'Microsoft YaHei';
    }
    return parseFloat(fontSize) * parseFloat(fontBaseLineJson[fontFamily] || fontBaseLineJson['SimHei']);
}

export function getLineHeightOld(json) {
    let paragraphs = json['data-elem'].paragraphs;
    let par_length = jsonLength(paragraphs);
    let line_num = par_length;
    let line;
    for (let i = 0; i < par_length; i++) {
        line = paragraphs[i].autolines;
        line_num = jsonLength(line) - 1 + line_num;
    }
    let oldVspace = parseInt(json['data-elem'].vspace || 0);
    return oldVspace + 100;
    let newVspace = parseInt((parseFloat(json['data-elem'].height) / line_num / parseFloat(json['data-elem']['font-size']) - 1) * 1000);
    if (Math.abs(newVspace - oldVspace) > 300) {
        return newVspace / Math.abs(newVspace) * 250 + oldVspace;
    }
    return oldVspace;
}

function jsonLength(json) {
    let json_height = 0;
    for (let i in json) {
        if (json[i].contents == []) continue;
        json_height++;
    }
    return json_height;
}

/**
 * Find components upward
 * Copied from iView
 * @param context
 * @param componentName
 * @param componentNames
 * @returns {*|Vue}
 */
function findComponentUpward(context, componentName, componentNames) {
    if (typeof componentName === 'string') {
        componentNames = [componentName];
    } else {
        componentNames = componentName;
    }

    let parent = context.$parent;
    let name = parent.$options.name;
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
    }
    return parent;
}
export { findComponentUpward };

/**
 * Find component downward
 * Copied from iView
 * @param context
 * @param componentName
 * @returns {*}
 */
function findComponentDownward(context, componentName) {
    const childrens = context.$children;
    let children = null;

    if (childrens.length) {
        childrens.forEach(child => {
            const name = child.$options.name;
            if (name === componentName) {
                children = child;
            }
        });

        for (let i = 0; i < childrens.length; i++) {
            const child = childrens[i];
            const name = child.$options.name;
            if (name === componentName) {
                children = child;
                break;
            } else {
                children = findComponentDownward(child, componentName);
                if (children) break;
            }
        }
    }
    return children;
}
export { findComponentDownward };

/**
 * Find components downward
 * Copied from iView
 * @param context
 * @param componentName
 * @param components
 * @returns {Array}
 */
function findComponentsDownward(context, componentName, components = []) {
    const childrens = context.$children;

    if (childrens.length) {
        childrens.forEach(child => {
            const name = child.$options.name;
            const childs = child.$children;

            if (name === componentName) components.push(child);
            if (childs.length) {
                const findChilds = findComponentsDownward(child, componentName, components);
                if (findChilds) components.concat(findChilds);
            }
        });
    }
    return components;
}
export { findComponentsDownward };

/**
 * 将创客贴cookie从字符串转成对象
 * @param cookie
 * @return {{}}
 */
function cookie2object(cookie) {
    let obj = {}
    cookie.split('; ').forEach(val => {
        let arr = val.split('=')
        obj[arr[0]] = arr[1]
    })
    return obj
}

export { cookie2object }