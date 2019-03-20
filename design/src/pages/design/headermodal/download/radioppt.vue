<template>
  <div>
    <div class="body">
      <!--<label for="" class="hover"><i class="file-mark"></i>文件类型：</label>
      <div class="tip-message">
        <span class="caret"></span>
        <div class="introduce">
          <p>1、显示字体：是指我们会将您设计中的文字转换为图片，这样就保证下载的设计和制作时是一样的，但是文字的内容不能在其他软件内二次编辑；</p>
          <p>2、不显示字体：是指下载的设计中不含有字体文件，这样如果您使用本地没有的字体时，在您下载的设计中就会自动替换为本地默认字体，但设计中的文字内容可以在其他软件内二次编辑；</p>
        </div>
      </div>
       <Radio-group v-model="phone">
        <Radio label="显示字体">
        </Radio>
        <Radio label="不显示字体">
          <span class="no-font-family">不显示字体<i></i></span>
        </Radio>
      </Radio-group> -->
    </div>
    <div class="choosePage">
      <label for="">选择页面：</label>
      <Radio-group v-model="chosepage">
        <Radio label="全部页面" @choseLabel="choseAll"></Radio>
        <Radio label="指定页面" @choseLabel="choseIndexLabel" ref="input"></Radio>
        <input type="text" label="指定" :placeholder="placeholder" class="share-writepro" v-model="pageNum" :class="{cantwrite:ischooseAll}" @mousedown="getChoosePage">
      </Radio-group>
    </div>
  </div>
</template>

<script>
import RadioGroup from 'components/radioall/radiogroup.vue'
import Radio from 'components/radioall/radio.vue'
import designEvent from 'dataBus/design'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      phone: '显示字体',
      chosepage: '全部页面',
      pageNum: '',
      placeholder: '空格隔开，例：1 2 6 15-22',
      ischooseAll: true
    }
  },
  components: {
    RadioGroup,
    Radio
  },
  computed:{
    ...mapGetters({
      teamId:'getTeamId'
    }),
    pptqueryconfig(){
      return {
        d: designEvent.getDesignInfo().designId,
        type: 4,
        ppt_svg: true,
        tid:this.teamId ? this.teamId : 0
      }
         
    }
  },
  methods: {
    //选择指定页面
    choseIndexLabel() {
      this.ischooseAll = false
      this.placeholder = '空格隔开，例：1 2 6 15-22'
      this.$set(this.pptqueryconfig, 'range', testPageNum(this.pageNum, this))
    },
    checkNum() {
      if (testPageNum(this.pageNum, this) == "false"||this.pageNum=='0') {
        this.$store.dispatch('setMessageShow',{placeHolder:'非法字符，或者页码超过最大值'})
        return false;
      }
    },
    //选择全部
    choseAll() {
      this.ischooseAll = true
      this.placeholder = '空格隔开，例：1 2 6 15-22'
      // this.$set(this.pptqueryconfig,'b','')
    },
    getChoosePage() {
      //当输入框获取焦点的时候让指定按钮高亮
      this.$refs.input.change({
        target: {
          checked: true
        }
      })
    }
  },
  mounted() {
    this.$emit('choseValppt', this.pptqueryconfig);
  },
  watch: {
    //对象变化监听
    pptqueryconfig: {
      handler: function(val, oldval) {
        this.$emit('choseValPpt', val)
      }
    },
    pageNum(val, oldval) {
      if (val != oldval) {
        this.choseIndexLabel()
      }
    },
    phone(v) {
      this.pptqueryconfig.ppt_svg = v === '显示字体' ? true : false;
    }
  }

}
//对指定页面获得的的数据进行处理
function testPageNum(str, _this) {
  var page_num = _this.$store.getters.getPageSum
  var str = str.replace(/\s+/g, ",");
  var arr = str.split(",");
  for (var i = 0; i < arr.length; i++) {
    if (/^\d+\-\d+$/.test(arr[i])) {
      var arr_more = arr[i].split("-");
      for (var j = 0; j < arr_more.length; j++) {
        if (isNaN(arr_more[j]) || parseFloat(arr_more[j]) > page_num) {
          return "false";
        }
      }
      continue;
    }
    if (isNaN(arr[i]) || parseFloat(arr[i]) > page_num) {
      return "false";
    }
  }
  return str;
}
</script>
<style lang="less" scoped>
.body{
  position: relative;
}
.caret {
  position: absolute;
  top: 30px;
  left: 32px;
  width: 30px;
  height: 30px;
  background: #fff;
  transform: rotate(-45deg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.24);
}
.tip-message{
  display: none;
  position: absolute;
  top: 0;
}
.hover{
  &:hover {
    &+.tip-message {
      display: block;
    }
  }
}
.introduce {
  position: absolute;
  top: 36px;
  width: 500px;
  background: #fff;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.24);
  padding: 10px 18px;
  p {
    font-size: 12px;
    line-height: 1.5;
    color: #626262;
  }
}
.choosePage {
  margin: 22px 0 22px 0;
}
.cantwrite {
  background: rgba(0, 0, 0, 0.05);
    box-shadow: none;
}

.share-writepro {
  width: 192px;
  height: 42px;
  line-height: 40px;
  border: 1px solid #F3F3F3;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .08);
  background: #FBFBFB;
  padding-left: 10px;
  color: #CECECE;
  &::-webkit-input-placeholder {
    color: #cdcdcd;
  }
}
.file-mark {
  background: url(./img/sign.svg) 0 0 no-repeat;
  float: left;
  width: 14px;
  height: 14px;
  margin: 4px 8px 0 0;
}
.no-font-family {
  position: relative;
  i{
    position: absolute;
    right: -41px;
    top: -16px;
    width: 41px;
    height: 16px;
    background: url(./img/beta_sign.svg);
  }
}
</style>



