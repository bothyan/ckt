/**
 * 创建于2017/9/20  胡元港
 * 组合素材操作
 */

import dataHandle from 'common/dataHandle.js';
import eleBus from 'dataBus/element.js';
import { getTransformAttr } from 'common/common.js'

const  group = {
	/**
	 * [setElementInfoByGroupRotate 设置组合内部素材位置，当组合旋转的时候]
	 * @param {[Number]} nRotate [组合新旋转角度]
	 */
	setElementInfoByGroupRotate(nRotate) {
		let vuexGetters = dataHandle.vuexGetters(),
				focusPageIndex = vuexGetters.getFocusPageIndex,
				pageJson = dataHandle.getPageJson(),
				elems = pageJson.elems,
				groupId = vuexGetters.getGroupId,
				groupTransform = pageJson.elegroups[groupId].transform,
				selectArr = vuexGetters.getCircleSelectElements,  //组合素材包含索引
				group;
		//拿group坐标信息
		group = {nRotate, ..._getPosition(groupTransform)};
		//组合旋转角度差
		group.disRotate = group.nRotate - group.oRotate;

		selectArr.forEach(item => {
			let elem = elems[item],
					elemInfo = _getElementPosition(elem);

			elemInfo.nRotate = elemInfo.oRotate - group.oRotate + group.nRotate;
			if(elemInfo.nRotate < 0) {
				elemInfo.nRotate += 360;
			} else {
				elemInfo.nRotate %= 360
			}

			//以组合旋转中心为原点计算
			let x = elemInfo.x - group.x,
					y = elemInfo.y - group.y,
					r = Math.sqrt(x * x + y * y, 2),
					angle;

			//素材旋转点和组合旋转点在一条横线上
			if(y === 0) {
				if(x < 0) {
					angle = 180;
				}
				else {
				 	angle = 0;
				}
			}
			else {
				angle = Math.atan( x / y) * 180 / Math.PI;
				//算出现在素材中心相对于组合旋转中心的角度
				if(y > 0) {
					angle = 90 - angle;
				} else {
					angle = 270 - angle;
				}
			}

			let nAngle = angle + group.disRotate;

			//如果素材旋转中心不与组合旋转中心重合
			if(x !== 0 || y !== 0) {
				elemInfo.x = r * Math.cos(nAngle / 180 * Math.PI) + group.x;
				elemInfo.y = r * Math.sin(nAngle / 180 * Math.PI) + group.y;
			}
			elem.transform = _getTransform(elemInfo);
		})

		pageJson.elegroups[groupId].transform = _getTransform(group);
		
	},

	dispatchCommit(key, id) {
		let vuexGetters = dataHandle.vuexGetters(),
				pageJson = dataHandle.getPageJson(),
				pageIndex = vuexGetters.getFocusPageIndex,
				groupId = id || vuexGetters.getGroupId;

		dataHandle.commit('group', {
			pageIndex,
			eleIndex: groupId,
			key,
			value: pageJson.elegroups[groupId][key],
			eventType: 1
		});

		return dataHandle;
	},

	setGroupTransform( opt ) {
		let vuexGetters = dataHandle.vuexGetters(),
				pageJson = dataHandle.getPageJson(),
				pageScale = vuexGetters.getPageScale,
				groupId = vuexGetters.getGroupId;
		
		pageJson.elegroups[groupId].transform = `translate(${opt.left / pageScale},${opt.top / pageScale})rotate(${opt.rotate},${opt.width / 2 / pageScale},${opt.height / 2 / pageScale})`;
	},

	setGroupTransformByDis( dis ) {
		let vuexGetters = dataHandle.vuexGetters(),
				pageJson = dataHandle.getPageJson(),
				pageScale = vuexGetters.getPageScale,
				elegroups = pageJson.elegroups,
				groupArr = vuexGetters.getSelectGroup;

		groupArr.forEach(item => {
			let transform = elegroups[item].transform,
					translate = getTransformAttr(transform, 'translate').map(item => parseFloat(item)),
					rotate = getTransformAttr(transform, 'rotate').map(item => parseFloat(item));

			elegroups[item].transform = `translate(${translate[0] + dis.left / pageScale},${translate[1] + dis.top / pageScale})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`;
		})
	},

	getGroupRectById(groupId) {
		let groupTransform = dataHandle.getPageJson().elegroups[groupId].transform,
				translate = getTransformAttr(groupTransform, 'translate').map(item => parseFloat(item)),
				rotates = getTransformAttr(groupTransform, 'rotate').map(item => parseFloat(item));

		let reto = {},
      rotate = rotates[0],
      width = rotates[1] * 2,
      height = rotates[2] * 2,
      angle = Math.atan( height / width ) * 180 / Math.PI,
      r = Math.sqrt( width * width + height * height, 2) / 2,
      cos1 = Math.abs(Math.cos( (180 - angle - rotate) / 180 * Math.PI)),
      sin1 = Math.abs(Math.sin( (180 - angle - rotate) / 180 * Math.PI)),
      cos2 = Math.abs(Math.cos( (angle - rotate) / 180 * Math.PI)),
      sin2 = Math.abs(Math.sin( (angle - rotate) / 180 * Math.PI)),
      cos = Math.max(cos1, cos2),
      sin = Math.max(sin1, sin2),
      origin = {
        x: parseFloat(translate[0]) + width / 2,
        y: parseFloat(translate[1]) + height / 2
      };

	  let l1 = origin.x + cos * r,
	      l2 = origin.x - cos * r,
	      t1 = origin.y + sin * r,
	      t2 = origin.y - sin * r;

	      

	  reto.left = l1 < l2 ? l1 : l2; 
	  reto.top = t1 < t2 ? t1 : t2;
	  reto.width = Math.abs(l1 - l2);
	  reto.height = Math.abs(t1 - t2);
	  reto.right = reto.left + reto.width;
	  reto.bottom = reto.top + reto.height;

	  return reto;

	},
	/**
	 * [setGroupTransformById 设置指定组合]
	 * @param {[type]} groupId [description]
	 * @param {[type]} dis     [description]
	 */
	setGroupTransformById(groupId, dis) {
		let pageJson = dataHandle.getPageJson(),
				groupTransform = pageJson.elegroups[groupId].transform,
				elems = pageJson.elems,
				translate = getTransformAttr(groupTransform, 'translate').map(item => parseFloat(item)),
				rotates = getTransformAttr(groupTransform, 'rotate').map(item => parseFloat(item));
		// debugger
		elems.forEach(item => {
			if(item.group === groupId) {
				let eTranslate = getTransformAttr(item.transform, 'translate').map(item => parseFloat(item));
				eTranslate = `translate(${eTranslate[0]+dis.left}, ${eTranslate[1]+dis.top})`
				item.transform = item.transform.replace(/translate\(.+?\)/, eTranslate);
			}
		})

		pageJson.elegroups[groupId].transform = `translate(${translate[0] + dis.left},${translate[1] + dis.top})rotate(${rotates[0]},${rotates[1]},${rotates[2]})`;
	},

  setGroupTransformByScale(id, change) {
  	let elegroups = dataHandle.getPageJson().elegroups;

  	let rect = this.getGroupRectById(id),
  			rotates = getTransformAttr(elegroups[id].transform, 'rotate').map(item => parseFloat(item)),
  			leftDis = rect.left - change.oLeft,
  			topDis = rect.top - change.oTop;
  	let result = eleBus.calcElemPosByRect({
		  		left: change.nLeft + leftDis * change.widthScale,
		  		top: change.nTop + topDis * change.heightScale,
		  		width: rotates[1]*2 * change.widthScale,
		  		height: rotates[2]*2 * change.heightScale,
		  		rotate: rotates[0]
		  	});

  	let transform = `translate(${result.left},${result.top})rotate(${rotates[0]},${rotates[1]*change.widthScale},${rotates[2]*change.heightScale})`;

  	elegroups[id].transform = transform;

  },
  /**
   * [getGroupValueById 获取组合的值]
   * @param  {[String]} id        [组合id]
   * @param  {[Number Undefined]} pageIndex [画布索引]
   * @return {[Object]}           [组合值]
   *         {
   *         		transform,
   *         		lock
   *         }
   */
  getGroupValueById(id, pageIndex) {
  	let pageJson = dataHandle.getPageJson(pageIndex);

  	return pageJson.elegroups[id];
  }

}


/**
 * [getGroupInfo 获取组合位置信息]
 * @param  {[String]} transform [transform]
 * @return {[Object]}           [description]
 *         {
 *         		oRotate,  老的旋转角度
 *         		x,     组合中心坐标x
 *         		y	     组合中心坐标y
 *  
 *         }
 */
function _getPosition(transform) {
	let rotate = getTransformAttr(transform, 'rotate').map(item => parseFloat(item)),
			translate = getTransformAttr(transform, 'translate').map(item => parseFloat(item));

	return {
		oRotate: rotate[0],
		x: translate[0] + rotate[1],
		y: translate[1] + rotate[2],
		width: rotate[1] * 2,
		height: rotate[2] * 2
	}
}

function _getElementPosition(elem) {
	let rotate = getTransformAttr(elem.transform, 'rotate').map(item => parseFloat(item)),
			translate = getTransformAttr(elem.transform, 'translate').map(item => parseFloat(item));

	return {
		oRotate: rotate[0],
		x: translate[0] + elem['data-elem'].width / 2,
		y: translate[1] + elem['data-elem'].height / 2,
		width: elem['data-elem'].width,
		height: elem['data-elem'].height
	}
}


function _getTransform(info) {
	return `translate(${info.x - info.width / 2},${info.y - info.height / 2})rotate(${info.nRotate},${info.width / 2},${info.height / 2})`;
}



export default group;