<template>
  <div class="table-editor pos-ab" v-show="editorShow"
       :style="editorStyle"
       :class="{lock: lock}"
       @mousedown.self.prevent.left.stop="moveMouseDown($event)"
       @dblclick.stop="setInput($event)"
       @click.stop="editorClick($event)">
    <!--东边中心点-->
    <div class="e-resize-point pos-ab resize-point"
         v-show="!textShow && !lock"
         :class="{'point-bg': point===0}"
         @mousedown.stop.prevent="resizeMouseDown(0,$event)"></div>
    <!--东西锚点-->
    <div class="w-point pos-ab" ref="start0"></div>
    <div class="e-point pos-ab" ref="end0"></div>
    <!--南边中心点-->
    <div class="s-resize-point pos-ab resize-point"
         v-show="!textShow && !lock"
         :class="{'point-bg': point===1}"
         @mousedown.stop.prevent="resizeMouseDown(1,$event)"></div>
    <!-- 南北锚点 -->
    <div class="n-point pos-ab" ref="start1"></div>
    <div class="s-point pos-ab" ref="end1"></div>
    <!--东南操作点-->
    <div class="se-resize-point pos-ab resize-point"
         v-show="!textShow && !lock"
         :class="{'point-bg': point===2}"
         @mousedown.stop.prevent="resizeMouseDown(2,$event)"></div>
    <!-- 东南、西北锚点-->
    <div class="nw-point pos-ab" ref="start2"></div>
    <div class="se-point pos-ab" ref="end2"></div>
    <!-- 中心锚点 -->
    <div class="mid-point" ref="mid"></div>

    <div class="lock-point pos-ab" v-show="lock" @mousedown.stop @click="setLock" title="点我解锁"></div>


    <!--上边操作区-->
    <div v-show="!textShow && !lock" class="top-controller clearfix" @mousedown.stop="">
      <div class="controller-item" v-for="(w, index) in colWidths" :style="{width: w + lw + 'px'}">
        <div class="op-btn" @click.stop="setOptionStyle(colX[index] + w/2 + 7.5, -6);setDel(index, -1)"></div>
      </div>
      <div class="resize" v-for="x in colX" :style="{left: x + 'px'}"></div>
      <div class="add-col" @click="addCol"></div>
    </div>
    <!--左边操作区-->
    <div v-show="!textShow && !lock" class="left-controller" @mousedown.stop="">
      <div class="controller-item" v-for="(h, index) in rowHeights" :style="{height: h + lw + 'px'}">
        <div class="op-btn" @click.stop="setOptionStyle(-6, rowY[index] + h/2 + 7.5);setDel(-1, index)"></div>
      </div>
      <div class="resize" v-for="y in rowY" :style="{top: y + 'px'}"></div>
      <div class="add-row" @click="addRow"></div>
    </div>
    <!--操作列表-->
    <div class="option-list" :style="optionStyle" v-show="optionShow" @mousedown.stop="">
      <ul>
        <li v-for="(o, index) in options" @click="emitOption(index)"><span>{{o}}</span></li>
      </ul>
    </div> 
    <div class="textarea-container" v-for="(h,index) in rowHeights" @mousedown.stop="">
      <textarea :class="{active: textShow && textX == i && textY == index}"
                @click.stop=""
                v-for="(w,i) in colWidths"
                :style="{top: rowY[index]+lw+'px', left:colX[i]+lw+'px', height: h+'px', width: w+'px'}"></textarea>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import editorBus from '../../dataBus/editor.js';
  import toolsBarBus from 'dataBus/toolsBar';
  import eleEvent from '../../dataBus/element.js';
  import tableBus from '../../dataBus/table.js';

  export default {
    name: "table-editor",
    data() {
      return {
        rowHeights: [],
        colWidths: [],
        cells: null,
        rowY: [], //纵向表格位置
        colX: [], //横向表格位置
        lw: 0,    //线宽
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        tableScale: 1,
        angle: null,
        showRect: false,  //左上角位置信息控制
        rectStr: '',      //左上角位置串
        point: -1,        //操作点
        resizeType: 0,     
        rotate: 0,
        lock: false,
        options: [
          '删除'
        ],
        optionStyle: '',
        optionShow: false,
        textX: -1,
        textY: -1,
        textShow: false,
        moveFlag: false,
        delColIndex: -1,   //删除列索引，为-1时不删除
        delRowIndex: -1    //删除行索引，为-1时不删除
      }
    },
    computed: {
      ...mapGetters({
        editorShow: 'getTableEditorShow',   //vuex editor.js
        editorInfo: 'getTableEditorInfo'    //vuex editor.js
      }),
      editorStyle() {
        return {
          width: this.width + 'px',
          height: this.height + 'px',
          left: this.left + 'px',
          top: this.top + 'px'
        }
      }
    },
    watch: {
      editorInfo: {
        handler(v) {
          Object.assign(this, v);
          this.calcRowYAndColX();
        },
        deep: true
      },
      editorShow(v) {
        if (v) {
          window.addEventListener('keydown', this.moveKeyDown);
          window.addEventListener('keyup', this.moveKeyUp);
        }
        else {
          this.optionShow = false;
          this.textShow = false;
          window.removeEventListener('keydown', this.moveKeyDown);
          window.removeEventListener('keyup', this.moveKeyUp);
        }
      }
    },
    methods: {
      ...mapActions([
        'setResizeFlag',
        'setResizeToolShow'
      ]),
      //计算每一个的横向位置和纵向位置
      calcRowYAndColX() {
        this.rowY = [0];
        this.colX = [0];

        let i = 1,
            l = this.rowHeights.length;

        while (i <= l) {
          this.rowY[i] = this.rowY[i - 1] + this.rowHeights[i - 1] + this.lw;
          i++;
        }

        i = 1;
        l = this.colWidths.length;

        while (i <= l) {
          this.colX[i] = this.colX[i - 1] + this.colWidths[i - 1] + this.lw;
          i++;
        }
      },
      calcWidthsAndHeights() {
        let editorInfo = this.editorInfo,
            cl = editorInfo.lw * (editorInfo.colWidths.length + 1),
            hl = editorInfo.lw * (editorInfo.rowHeights.length + 1),
            oWidth = editorInfo.width - cl,
            oHeight = editorInfo.height - hl,
            nWidth = this.width - cl,
            nHeight = this.height - hl,
            wScale = nWidth / oWidth,
            hScale = nHeight / oHeight;
        this.colWidths = editorInfo.colWidths.map(item => item * wScale);
        this.rowHeights = editorInfo.rowHeights.map(item => item * hScale);
        this.calcRowYAndColX();
      },
      resizeMouseDown(point, event) {
        //防止resizeTool重置
        this.setResizeFlag(true);
        this.setResizeToolShow(false);

        let me = this;
        me.point = point;

        //获取定点位置
        let fixedPoint;
        switch (point) {
          case 0:
            fixedPoint = me.$refs.start0.getBoundingClientRect();
            me.resizeType = 1;
            break;
          case 1:
            fixedPoint = me.$refs.start1.getBoundingClientRect();
            me.resizeType = 2;
            break;
          case 2:
            fixedPoint = me.$refs.start2.getBoundingClientRect();
            me.resizeType = 3;
            break;
        }
        //计算对点位置
        let across = me.getAcross(point),
            dis = {
              left: across.oX - me.width / 2 - me.left,
              top: across.oY - me.height / 2 - me.top
            }
        window.addEventListener('mousemove', resizeMouseMove);
        window.addEventListener('mouseup', resizeMouseUp);

        function resizeMouseMove(event) {
          me.showRect = true;
          let e = event || window.event;
          //当前鼠标点
          let eX = e.clientX - across.oX,
              eY = e.clientY - across.oY;
          let result;
          if (isNaN(across.a)) {
            if (eY < across.y1 === across.direction) {
              result = Math.abs(eY - across.y1);
            } else {
              result = 3;
            }
          } else if (across.a == 0) {
            if (eX < across.x1 === across.direction) {
              result = Math.abs(eX - across.x1);
            } else {
              result = 3;
            }
          } else {
            if (across.a2 * eX + across.b2 > eY === across.direction) {
              let disOfMouseAndStartpoint = Math.sqrt(Math.pow(eX - across.x1, 2) + Math.pow(eY - across.y1, 2), 2),
                  disOfMouseAndLine = Math.abs(across.a * eX + across.b - eY) / Math.sqrt(Math.pow(across.a, 2) + 1, 2);
              result = Math.sqrt(Math.pow(disOfMouseAndStartpoint, 2) - Math.pow(disOfMouseAndLine, 2), 2);
            }
            else {
              result = 3;
            }
          }

          if (point === 0) {
            me.width = result;
          } else if (point === 1) {
            me.height = result;
          } else {
            me.calcAngle();
            me.width = result * Math.cos(me.angle / 180 * Math.PI);
            me.height = result * Math.sin(me.angle / 180 * Math.PI);
          }

          me.$nextTick(() => {
            me.calcAngle();
            if (point === 0) {
              me.left = fixedPoint.left + me.width / 2 * (Math.cos(me.rotate / 180 * Math.PI) - 1) - dis.left;
              me.top = fixedPoint.top - me.height / 2 + me.width / 2 * Math.sin(me.rotate / 180 * Math.PI) - dis.top;
            } else if (point === 1) {
              me.left = fixedPoint.left - me.width / 2 - me.height / 2 * Math.sin(me.rotate / 180 * Math.PI) - dis.left;
              me.top = fixedPoint.top - me.height / 2 + me.height / 2 * Math.cos(me.rotate / 180 * Math.PI) - dis.top;
            } else if (point === 2) {
              let r = Math.sqrt(Math.pow(me.width, 2) + Math.pow(me.height, 2), 2) / 2;
              me.left = fixedPoint.left - me.width / 2 + Math.cos((me.angle + me.rotate) / 180 * Math.PI) * r - dis.left;
              me.top = fixedPoint.top - me.height / 2 + Math.sin((me.angle + me.rotate) / 180 * Math.PI) * r - dis.top;
            }
            me.rectStr = `${me.width | 0},${me.height | 0}`;
            me.dispatchJsonChange();
          })
        }

        function resizeMouseUp() {
          me.point = -1;
          me.showRect = false;
          window.removeEventListener('mousemove', resizeMouseMove);
          window.removeEventListener('mouseup', resizeMouseUp);
          me = null;
          across = null;
          fixedPoint = null;
        }
      },
      moveMouseDown(event) {
        if(this.lock){
          return;
        }
        let me = this,
            startPoint = {
              x: event.clientX,
              y: event.clientY
            };
        this.moveFlag = false;
        this.resizeType = 0;
        window.addEventListener('mousemove', moveMousemove);
        window.addEventListener('mouseup', moveMouseup);

        function moveMousemove(event) {
          let e = event || window.event;
          me.moveFlag = true;
          me.left = me.left + e.clientX - startPoint.x;
          me.top = me.top + e.clientY - startPoint.y;
          me.rectStr = `${me.left | 0},${me.top | 0}`
          me.showRect = true;
          startPoint = {
            x: e.clientX,
            y: e.clientY
          };
          me.dispatchJsonChange('move');
        }

        function moveMouseup() {
          me.showRect = false;
          window.removeEventListener('mousemove', moveMousemove);
          window.removeEventListener('mouseup', moveMouseup);
          me.dispatchJsonChange();
          me = null;
        }
      },
      moveKeyDown(event) {
        let e = event || window.event,
            code = e.keyCode;
        if(code < 37 || code > 40)
          return;
        switch (e.keyCode) {
          case 37:
            this.left -= 3;
            break;
          case 38:
            this.top -= 3;
            break;
          case 39:
            this.left += 3;
            break;
          case 40:
            this.top += 3;
            break;
        }
        this.dispatchJsonChange();
        this.rectStr = `${this.left | 0},${this.top | 0}`;
        if (!this.showRect) {
          this.showRect = true;
        }
      },
      moveKeyUp() {
        this.showRect = false;
      },
      //计算线框对角线角度
      calcAngle() {
        this.angle = Math.atan(this.height / this.width) * 180 / Math.PI;
      },
      getAcross(pNum) {
        let startRect,
            endRect,
            oRect = this.$refs.mid.getBoundingClientRect();
        startRect = this.$refs['start' + pNum].getBoundingClientRect();
        endRect = this.$refs['end' + pNum].getBoundingClientRect();


        let across = {
          x1: startRect.left - oRect.left,
          y1: startRect.top - oRect.top,
          x2: endRect.left - oRect.left,
          y2: endRect.top - oRect.top,
          oX: oRect.left,
          oY: oRect.top
        };
        if (across.x1 == across.x2) {
          across.a = NaN;
          across.a2 = 0;
          across.direction = across.y2 < across.y1;
        } else if (across.y1 == across.y2) {
          across.a = 0;
          across.a2 = NaN;
          across.direction = across.x2 < across.x1;
        } else {
          across.a = (across.y2 - across.y1) / (across.x2 - across.x1);
          across.b = -across.a * across.x1 + across.y1;
          across.a2 = -1 / across.a;
          across.b2 = across.y1 - across.a2 * across.x1;
          across.direction = across.y2 < across.a2 * across.x2 + across.b2;
        }
          return across;
      },
      dispatchJsonChange(type) {
        this.calcWidthsAndHeights();
        let info = {
          width: this.width,
          height: this.height,
          left: this.left,
          top: this.top,
          rotate: this.rotate,
          opacity: 1,
          resizeType: this.resizeType,
          type: 'table'
        }
        if (type === 'move') {
          info.opacity = 0.5;
        }
        eleEvent.computeElemInfo(info);
        toolsBarBus.setToolsBarState();
      },
      setOptionStyle(left, top) {
        this.optionStyle = {
          left: left + 'px',
          top: top + 'px'
        }
        this.optionShow = true;
      },
      setInput(event) {
        if(this.textShow){
          return;
        }
        this.textShow = true;
        this.setTextPos(event.offsetX, event.offsetY);
      },
      setTextPos(x, y){
        let i,l;
        i = 0;
        l = this.colX.length;
        while(i < l) {
          if(this.colX[i] <= x && x< this.colX[i] + this.colWidths[i]){
            this.textX = i;
            break;
          }
          i++;
        }
        i = 0;
        l = this.rowY.length;
        while(i < l) {
          if(this.rowY[i] <= y && y < this.rowY[i] + this.rowHeights[i]){
            this.textY = i;
            break;
          }
          i++;
        }
      },
      editorClick(event){
        this.optionShow = false;
        if(this.textShow){
          this.setTextPos(event.offsetX, event.offsetY);
        } else if(!this.moveFlag){
          this.dispatchEditorClick(event.offsetX, event.offsetY);
        }
      },
      dispatchEditorClick(x, y) {
        let target = editorBus.getEditorClickTarget({
            left: this.left + x,
            top: this.top + y
          });
        if(target !== -1){
          eleEvent.setFocusElemIndex({
            index: target
          });
        }
      },
      addRow() {
        tableBus.addRow();
        editorBus.setEditorState();
      },
      addCol(){
        tableBus.addCol();
        editorBus.setEditorState();
      },
      setDel(col, row){
        this.delColIndex = col;
        this.delRowIndex = row;
      },
      delRowOrCol() {
        if(this.delColIndex > -1){
          tableBus.delCol(this.delColIndex)
        } else {
          tableBus.delRow(this.delRowIndex);
        }
        editorBus.setEditorState();
      },
      emitOption(index){
        if(index === 0){
          this.delRowOrCol();
        }
      },
      setLock() {
        eleEvent.setLock(false);
        editorBus.setEditorState();
        toolsBarBus.setToolsBarState();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import 'tableEditor.less';
</style>