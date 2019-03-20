<template>
  <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
       x="0px" y="0px" :width="width" :height="height" viewBox='0 0 500 500'>
  </svg>
</template>
<script>
  import * as d3 from 'd3'
  import createTip from './createTip'
  import dataHandle from '../../../common/dataHandle'
  import {mapGetters} from 'vuex'
  import ele from '../../../dataBus/element'


  export default {
    name: 'barChart',
    props: ['json', 'eleIndex'],
    data() {
      return {
        dataList: null,
        //颜色list
        colorList: null,
        //svg的宽高
        width: null,
        height: null,
        //容器的宽度高度
        boxWidth: 0,
        boxHeight: 0,

        //d3对象
        d3: null,
        //svg实例
        svg: null,
        //x轴比例尺
        xScale: null,
        //y轴比例尺
        yScale: null,
        //x轴对象
        xAxis: null,
        //y轴对象
        yAxis: null,
        //group对象
        group: null,
        margin: {
          left: 60,
          top: 40,
          right: 30,
          bottom: 60
        },


        //title选项
        //title是否显示
        titleShow: true,
        //标题name
        titleName: '默认标题',
        //标题位置
        titlePosition: 'top',
        //标题颜色
        titleColor: '#000',

        //坐标轴选项
        //坐标轴名称是否显示
        axisTitleShow: true,
        //x轴name
        xAxisName: '轴文本',
        //y轴name
        yAxisName: '轴文本',
        //坐标轴的最大最小值
        yMin: 0,
        yMax: 0,

        //显示||隐藏=>flag
        //图例是否显示
        legendShow: true,
        //网格是否显示
        gridShow: true,
        //坐标轴是否显示
        axisShow: true,

        //颜色选择
        colorSingle: false,
        colors: true,

        //图例单独使用的属性
        //图例开始渲染的x轴位置
        startX: null,
        //图例rect的宽度
        legendWidth: 20,
        //图例rect的高度
        legendHeight: 20,
        //显示区域宽度
        viewBoxWidth: null,
        timer: null
      }
    },
    created() {
      this.init();
    },
    beforeMount() {
    },
    computed:{
      ...mapGetters({
        'focusPageIndex': 'getFocusPageIndex'
      })
    },
    mounted() {
      //init
      this.svg = d3.select(this.$el)
        .attr('class', 'ckt_svg_barChart');

      this.group = this.svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
      this.initXScale();
      this.initYScale();
      this.drawAxis();
      this.animate();
      this.drawLegend();
      this.drawTitle();
      this.drawAxisTitle();
      this.gridFlag();
      this.setFontSize();
      setTimeout(() => {
        this.saveChart();
      }, 2500);
    },
    methods: {
      init() {
        //宽高viewBox初始化
        this.width = this.json['width'];
        this.height = this.json['height'];
        this.boxWidth = 500 - this.margin.top - this.margin.bottom;
        this.boxHeight = 500 - this.margin.left - this.margin.right;
        this.dataList = JSON.parse(JSON.stringify(this.json['chart-data']));
        this.list = JSON.parse(JSON.stringify(this.json['chart-data']));
        //颜色数组初始化
        this.colorList = this.json['chart-colors'];
        //title属性初始化
        this.titleShow = this.json['chart-titleShow'];
        this.titleName = this.json['chart-title'];
        this.titleColor = this.json['chart-titleColor'];
        this.titlePosition = this.json['chart-titlePosition'];
        //坐标轴初始化
        this.axisShow = this.json['chart-axisShow'];
        this.axisTitleShow = this.json['chart-axisTitleShow'];
        this.xAxisName = this.json['chart-xAxisTitle'];
        this.yAxisName = this.json['chart-yAxisTitle'];

        //grid网格初始化
        this.gridShow = this.json['chart-gridShow'];
        this.legendShow = this.json['chart-legendShow'];
        for (let i = 0; i < this.dataList.length; i++) {
          if (!this.dataList[i].value) {
            this.dataList[i].value = 0;
          }
        }
      },
      //鼠标移入事件入口
      enter(d, self) {
        d3.select(self).attr("opacity", 0.8);
        // 添加 div
        createTip.target = this;
        createTip.longer = new Date().getTime();
        createTip.exist = false;
        //获取坐标
        createTip.winEvent = {
          x: event.clientX,
          y: event.clientY - 20
        };
        createTip.boxHeight = 50;
        createTip.boxWidth = 80;

        //hide
        createTip.ClearDiv();
        //show
        createTip.hoverTimerFn(this.createTooltipTableData(d), self);
      },
      //鼠标移出事件入口
      leave(self) {
        d3.select(self).attr("opacity", 1);
        createTip.target = null;
        createTip.ClearDiv();
      },
      initXScale() {
        //x轴比例尺
        this.xScale = d3.scaleBand()
          .rangeRound([0, this.boxWidth])
          .paddingOuter(0.2)
          .paddingInner(0.3)
          .domain(this.dataList.map(function (d) {
            return d.name
          }));
      },
      initYScale() {
        //y轴比例尺
        this.yScale = d3.scaleLinear()
          .rangeRound([this.boxHeight - this.margin.bottom, this.margin.top])
          .domain([0, d3.max(this.dataList.map(function (d) {
            return d.value + 30
          }))]);
      },
      drawChart() {
        let that = this;
        //渲染柱子
        this.group.selectAll('.bar')
          .data(this.dataList)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => this.xScale(d.name))
          .attr('y', (d) => this.yScale(d.value))
          .attr('width', this.xScale.bandwidth())
          .attr('height', (d) => {
            return this.boxHeight - this.yScale(d.value) - this.margin.bottom - 1
          })
          .attr('fill', (d, i) => this.colorList[i])
          .on('mouseenter', function (d) {
            let self = this;
            that.enter(d, self)
          })
          .on('mouseleave', function () {
            let self = this;
            that.leave(self);
          })
      },
      drawLegend() {
        let that = this;
        if (!this.legendShow) return;
        //显示区域的宽度
        this.viewBoxWidth = this.boxWidth - this.margin.right;
        let startX = 0, lineIndex = 0, depthList = [];
        //如果图例总宽度>比例尺宽度则换行
        let textList = this.svg.append('g')
          .attr('class', 'legendBox')
          .attr('transform', 'translate(' + (this.margin.left + 10) + ',' + (this.boxHeight + 5) + ')')
          .selectAll('.legend')
          .data(this.list)
          .enter()
          .append('g')
          .each(function (d, i) {
            let textWidth = that.calculateWidth(d.name);
            d.twidth = textWidth + 35;
            let dom = d3.select(this);
            dom.attr('transform', function () {

              if (startX > that.viewBoxWidth) startX = 0, lineIndex++;
              if (!depthList[lineIndex]) depthList[lineIndex] = [];
              depthList[lineIndex].push(d);

              let nowX = d.left = startX;
              startX += d.twidth;
              d.lineIndex = lineIndex;
              return "translate(" + nowX + "," + lineIndex * 40 + ")";
            })
              .attr('y', function () {
                return lineIndex * 20;
              });
            dom.append('rect')
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', 20)
              .attr('height', 20)
              .attr('fill', () => that.colorList[i]);
            dom.append('text')
              .attr('dx', '25')
              .attr('dy', 15)
              .attr('class', 'legendText')
              .text(d.name);
          });

        depthList.forEach(function (d) {
          let lineWidth = 0;
          for (let i in d) lineWidth += d[i].twidth;
          let deviationX = (that.viewBoxWidth - lineWidth) / 2;
          for (let j in d) d[j].left += deviationX;
        });

        textList.attr('transform', function (d) {
          return "translate(" + [d.left, d.lineIndex * 25] + ")"
        })
      },
      calculateWidth(str) {
        this.svg.append('text')
          .attr('x', 0)
          .attr('y', 0)
          .attr('class', 'onlyTestText')
          .text(str);
        let width = d3.select('.onlyTestText').node().getBBox().width;
        this.svg.select('.onlyTestText').remove();
        return width;
      },
      drawTitle() {
        if (!this.titleShow) return;
        //title
        this.svg.append('text')
          .attr('x', 0)
          .attr('y', () => {
            if (this.titlePosition === 'top') {
              return 30
            } else {
              return this.boxHeight + this.margin.top + 30
            }
          })
          .text(this.titleName)
          .attr('class', 'titleName')
          .attr('fill', this.titleColor);
        let width = this.svg.select('.titleName').node().getBBox().width;
        let startX = (500 - width) / 2 - this.titleName.length * 4.5;
        this.svg.select('.titleName').attr('x', startX).attr('w', width);
      },
      drawAxis() {
        this.xAxis = this.group.append('g')
          .attr('class', 'xAxis_barChart')
          .attr('transform', 'translate(0,' + (this.boxHeight - this.margin.bottom) + ')')
          .call(d3.axisBottom(this.xScale));

        this.yAxis = this.group.append('g')
          .attr('class', 'yAxis_barChart')
          .call(d3.axisLeft(this.yScale).ticks(5));
        this.yAxis.selectAll('line').attr('class', 'gridLine');

        if (this.axisShow) {
          //删除原x轴
          this.xAxis.selectAll('line')
            .remove();
          this.xAxis.select('path')
            .remove();
          this.xAxis.selectAll('text')
            .remove();

          //删除原y轴
          this.yAxis.select('path')
            .remove();

          //添加x轴主线
          this.xAxis.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', this.boxWidth)
            .attr('y2', 0)
            .style('stroke', '#9b9b9b')
            .attr('stroke-width', '1');
          //添加y轴主线
          this.yAxis.append('line')
            .attr('opacity', 1)
            .attr('x1', 0)
            .attr('y1', this.margin.top)
            .attr('x2', 0)
            .attr('y2', this.boxHeight - this.margin.bottom)
            .attr('class', 'test')
            .style('stroke', '#9b9b9b')
            .attr('stroke-width', '1');
          this.yAxis.selectAll('text')
            .attr('class','axisText');
          //添加网格
          this.yAxis.selectAll('.gridLine')
            .attr('opacity', 1)
            .attr('transform', 'translate(0,0)')
            .attr('class', 'gridLine')
            .attr('x2', this.boxWidth)
            .attr('stroke','#dcdcdc')
            .attr('stroke-dasharray', '4,3');
        } else {
          //删除x轴内容
          this.xAxis.selectAll('path').remove();
          this.xAxis.selectAll('line').attr('opacity', 0);
          this.xAxis.selectAll('text').remove();
          //删除y轴内容
          this.yAxis.selectAll('path').remove();
          this.yAxis.selectAll('text').remove();
          this.yAxis.selectAll('.gridLine')
            .attr('opacity', 1)
            .attr('transform', 'translate(0,0)')
            .attr('class', 'gridLine')
            .attr('x2', this.boxWidth)
            .attr('stroke','#dcdcdc')
            .attr('stroke-dasharray', '4,3');
        }
      },
      drawAxisTitle() {
        if (!this.axisTitleShow) return;
        if (!this.xAxisName) this.xAxisName = '默认标题';
        if (!this.yAxisName) this.yAxisName = '默认标题';
        //y轴文字
        this.svg.append('text')
          .attr('x', 5)
          .attr('y', this.margin.top + 20)
          .text(this.yAxisName)
          .attr('class','axisTitle');

        //x轴文字
        let textList = this.xAxisName.split('');
        this.svg.selectAll('.text')
          .data(textList)
          .enter()
          .append('text')
          .attr('x', this.boxWidth + this.margin.right * 2)
          .attr('y', (d, i) => {
            return this.boxHeight - 40 + i * 20
          })
          .text((d) => d)
          .attr('class','axisTitle');
      },
      createTooltipTableData(info) {
        let ary = [];
        ary.push("<div id='tip-hill-div'>");
        ary.push("<h1>名称: " + info.name + "</h1>");
        ary.push("<h2>值: " + info.value);
        ary.push("</div>");
        return ary.join("");
      },
      gridFlag() {
        if (this.gridShow) return;
        this.yAxis.selectAll('.gridLine')
          .attr('opacity', 0)
      },
      setFontSize() {
        this.svg.selectAll('text').attr('font-size', 18)
          .attr('text-rendering', 'geometricPrecision')
          .attr('font-family', 'Microsoft YaHei');
        this.svg.selectAll('.legendText').attr('font-size', 16).attr('fill','#626262');
        this.svg.selectAll('.titleName').attr('font-size', 22);
        this.svg.selectAll('.axisText').attr('font-size','14');
        this.svg.selectAll('.axisTitle').attr('font-size','14').attr('fill','#626262');
      },
      redraw() {
        this.svg.html('');
        this.group = this.svg.append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        this.initXScale();
        this.initYScale();
        this.drawAxis();
        this.animate();
        this.drawLegend();
        this.drawTitle();
        this.drawAxisTitle();
        this.gridFlag();
        this.setFontSize();
        setTimeout(() => {
          this.saveChart();
        }, 2500);
      },
      drawPortion() {
        this.svg.html('');
        this.group = this.svg.append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        this.initXScale();
        this.initYScale();
        this.drawAxis();
        this.drawChart();
        this.drawLegend();
        this.drawTitle();
        this.drawAxisTitle();
        this.gridFlag();
        this.setFontSize();
      },
      animate() {
        let that = this;
        //渲染柱子
        this.group.selectAll('.bar')
          .data(this.dataList)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => this.xScale(d.name))
          .attr('y', this.boxHeight - this.margin.bottom - 1)
          .attr('width', this.xScale.bandwidth())
          .attr('height', 1)
          .attr('fill', (d, i) => this.colorList[i])
          .on('mouseenter', function (d) {
            let self = this;
            that.enter(d, self)
          })
          .on('mouseleave', function () {
            let self = this;
            that.leave(self);
          })
          .transition()
          .duration(1000)
          .delay((d, i) => i * 500 / 3)
          .attr('height', (d) => {
            return this.boxHeight - this.yScale(d.value) - this.margin.bottom - 1
          })
          .attr('y', (d) => this.yScale(d.value));
      },
      saveChart() {
        let that = this;
        dataHandle.update();
        let parameter;
        if (this.json.id) {
          parameter = {
            'width': this.width,
            'height': this.height,
            'content': this.$el.outerHTML,
            'material_id': this.json.id
          };
        } else {
          parameter = {
            'width': this.width,
            'height': this.height,
            'content': this.$el.outerHTML
          };
        }

        if (this.timer !== null) {
          clearTimeout(this.timer);
          let pageIndex = that.focusPageIndex;
          this.timer = setTimeout(() => {
            addAjax(pageIndex);
          }, 1000);
        } else {
          let pageIndex = that.focusPageIndex;
          this.timer = setTimeout(() => {
            addAjax(pageIndex);
          }, 1000);
        }

        function addAjax(pageIndex) {
          that.$http.post('/material/saveChart', parameter).then(res => {
            let state = res.body.code;
            switch (state) {
              case 1:
                if (that.json.id && res.body['materialId'] !== that.json.id) break;
                ele.setMaterialId(res.body['materialId'], pageIndex, that.eleIndex);
                dataHandle.commit('element',{
                  'pageIndex':pageIndex,
                  'eleIndex':that.eleIndex,
                  'key':'id',
                  'value':res.body['materialId'],
                  eventType:1
                }).push(true);
                console.log('操作成功');
                break;
              case -1:
                console.log('参数有误')
                break;
              case -2:
                console.log('获取素材信息出错');
                break;
              case -3:
                console.log('创建素材出错');
                break;
              case -4:
                console.log('覆盖素材出错');
                break;
            }
          }).catch(error => {
            console.log(error)
          })
        }
      }
    },
    watch: {
      json: {
        handler(old, val) {
          this.init();
          if (old && val) {
            if (JSON.stringify(old.width) !== JSON.stringify(val.width) || JSON.stringify(old) === JSON.stringify(val)) {
              return
            } else {
              this.drawPortion();
              setTimeout(() => {
                this.saveChart();
              }, 2500);
            }
          }
        },
        deep: true
      },
      colorList: {
        handler(old, val) {
          if (old && val) {
            if (JSON.stringify(old) === JSON.stringify(val)) {
              return
            } else {
              this.redraw();
            }
          }
        },
        deep: true
      },
      dataList: {
        handler(old, val) {
          if (old && val) {
            if (JSON.stringify(old) === JSON.stringify(val)) {
              return
            } else {
              this.redraw()
            }
          }
        },
        deep: true
      }
    }
  }
</script>
<style>
  #tip-hill-div {
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    font-family: Microsoft Yahei;
  }

  #tip-hill-div > h1 {
    font-size: 14px;
    text-align: center;
  }

  #tip-hill-div > h2 {
    font-size: 12px;
    text-align: center;
  }
</style>