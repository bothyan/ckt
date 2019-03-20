<template>
  <div class="waterfall" :style="wrapHeight">
    <slot v-for="(item,index) in listData"
          :listData="item"
          :index="index"
    ></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        listHeight: [0, 0, 0],
        // 回传显示数据
        listData: [],
        // 瀑布流高度
        wrapHeight: {
          height: '0px',
          width: '0px'
        }
      }
    },
    props: {
      // 数据
      eleData: {
        required: true
      },
      // 容器矩形
      boxRect: {
        required: true,
        type: Object
        /* eg
         {
           width:,
           top:,
           right:,
           bottom:,
           left
         }
         */
      },
      // 列数
      listSum: {
        required: true,
        type: Number,
        default: 1
      }
    },
    methods: {
      // 计算显示
      computeShow: function () {
        this.listHeight = new Array(this.listSum);
        for (let i = 0; i < this.listSum; i++) {
          this.listHeight[i] = 0;
        }
        let list_height = this.listHeight,
            _data = this.eleData, // 传入数据
            _data_width, // 图片的宽度
            _data_height,
            // 图片宽度
            img_width = this.boxRect.width,
            img_height,
            img_top = this.boxRect.top,
            img_bottom = this.boxRect.bottom,
            // 图片容器宽度
            box_width = img_width + this.boxRect.left + this.boxRect.right,
            box_height,
            box_top,
            box_left,
            // 图片容器之间的left,top
            _left = this.boxRect.marginLeft,
            _top = this.boxRect.marginTop,
            // 当前最短列数据
            min,
            min_num,
            list_data = [];
        for (let i = 0; i < _data.length; i++) { // 遍历传入的数据
          _data_width = parseFloat(_data[i].width || _data[i].design_width);
          _data_height = parseFloat(_data[i].height || _data[i].design_height);
          img_height = img_width / _data_width * _data_height;
          box_height = img_height + img_top + img_bottom;
          min = getMin(list_height);
          box_top = min.top + _top;
          min_num = min.num; // num = index
          // 重置list_height
          list_height[min_num] = box_top + box_height;
          box_left = (box_width + _left) * min_num + _left;
          list_data[i] = {
            boxStyle: {
              width: box_width + 'px',
              height: box_height + 'px',
              left: box_left + 'px',
              top: box_top + 'px'
            },
            imgStyle: {
              width: img_width + 'px',
              height: img_height + 'px'
            },
            data: _data[i]
          }
        }
        this.listData = list_data; // 回传显示数据
        // console.log(this.listData)
        this.wrapHeight = {
          height: getMax(list_height),
          width: (_left + this.listSum * (box_width + _left)) + 'px'
        }
      },

    },
    watch: {
      // 列数更新
      listSum: function (val, oldval) {
        // 当前没有数据
//        console.log(val+"<<=="+oldval)
        if (this.eleData.length === 0 || val === oldval) return;
        this.computeShow();
      },
      // 数据更新
      eleData(val){
        this.computeShow();
      },
      boxRect: {
        handler: function () {
          this.computeShow();
        },
        deep: true
      }
    },
    mounted() {
      this.computeShow();
      
    }
  }
  function getMin(arr) {
    let min = arr[0];
    let j = 0;
    for (let i = 0; i < arr.length; i++) {
      if (min > arr[i]) {
        min = arr[i];
        j = i;
      }
    }
    return {
      top: min,
      num: j
    };
  }
  function getMax(arr) {
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
      if (max < arr[i]) {
        max = arr[i];
      }
    }
    return (max + 8) + 'px';
  }
</script>

<style lang="less" scoped>
  .waterfall {
    overflow-y: scroll;
    overflow-x:hidden;
    position: relative;
    margin: 0 auto;
  }
</style>
