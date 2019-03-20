
import dataHandle from  '../common/dataHandle.js'

const tableBus = {
	
	addRow() {
		let elem = dataHandle.getEleJson()['data-elem'];

		let arr = new Array(elem.col).fill(elem['default-cell']);
		elem.cells.push(arr);
		elem.row++;
		elem['row-heights'].push(elem['default-height']);

		let w = elem['col-widths'].reduce( (a, b) => a + b ) + elem['line-width']*(elem.col+1),
		h = elem['row-heights'].reduce( (a, b) => a + b ) + elem['line-width']*(elem.row+1);

		elem.height = elem.width / w * h;
		elem.viewBox = `0 0 ${w} ${h}`
	},

	addCol() {
		let elem = dataHandle.getEleJson()['data-elem'];

		elem.cells = elem.cells.map( item => {
			item.push(elem['default-cell']);
			return item;
		})
		elem.col++;
		elem['col-widths'].push(elem['default-width']);

		let w = elem['col-widths'].reduce( (a, b) => a + b ) + elem['line-width']*(elem.col+1),
		h = elem['row-heights'].reduce( (a, b) => a + b ) + elem['line-width']*(elem.row+1);

		elem.width = elem.height / h * w;
		elem.viewBox = `0 0 ${w} ${h}`
	},

/**
 * [delRow description]  删除行
 * @param  {[Number]} index [description] 行索引
 * @return {[type]}       [description] 无返回值
 */
	delRow(index) {
		let elem = dataHandle.getEleJson()['data-elem'];
	},

/**
 * [delRow description]  删除列
 * @param  {[Number]} index [description] 列索引
 * @return {[type]}       [description] 无返回值
 */
	delCol(index) {
		let elem = dataHandle.getEleJson()['data-elem'];

		elem.col --;
		elem['col-widths'].splice(index, 1);

		elem.cells = elem.cells.map(item => {
			item.splice(index, 1);
			return item;
		})

		let w = elem['col-widths'].reduce( (a, b) => a + b ) + elem['line-width']*(elem.col+1),
		h = elem['row-heights'].reduce( (a, b) => a + b ) + elem['line-width']*(elem.row+1);

		elem.width = elem.height / h * w;
		elem.viewBox = `0 0 ${w} ${h}`

	},

/**
 * 表格变形的实现
 * @param {* 变形的信息} info 
 * @param {* 变形的元素} elem 
 * @param {* 变形的比例} scale 
 */
	resizeTable(info, elem) {

		let scale = dataHandle.vuexGetters().getPageScale,
				json = elem['data-elem'],
				cl = json['line-width'] * (json.col + 1),
				hl = json['line-width'] * (json.row + 1),
				oWidth = json.width - cl,
				oHeight = json.height - hl,
				nWdith = info.width / scale - cl,
				nHeight = info.height / scale - hl;

		let wScale = nWdith / oWidth,
				hScale = nHeight / oHeight;

		json['col-widths'] = json['col-widths'].map(item => item * wScale);
		json['row-heights'] = json['row-heights'].map(item => item * hScale);

		let w = json['col-widths'].reduce((a, b) => a + b),
		h = json['row-heights'].reduce((a, b) => a + b);

		json['viewBox'] = `0 0 ${w + cl} ${h + hl}`;
	}
}

export default tableBus;