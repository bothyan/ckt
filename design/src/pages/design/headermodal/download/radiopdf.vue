<template>
  <div>
    <div>
      <label for="">文件质量：</label>
      <Radio-group v-model="phone">
        <Radio label="标清分享" @choseLabel="$set(pdfqueryconfig,'type',3)">
        </Radio>
        <Radio label="高清印刷" @choseLabel="$set(pdfqueryconfig,'type',6)">
        </Radio>
      </Radio-group>
    </div>
    <div class="chosePage">
      <label for="">文件类型：</label>
      <Radio-group v-model="longPic">
        <Radio label="pdf"></Radio>
      </Radio-group>
    </div>
    <div>
      <label for="">选择页面：</label>
      <Radio-group v-model="chosepage">
        <Radio label="全部页面" @choseLabel="choseAll"></Radio>
        <Radio label="指定页面" @choseLabel="choseIndexLabel" ref="input"></Radio>
        <input type="text" label="指定" id="inputpage" :placeholder="placeholder" class="share-writepro" v-model="pageNum" :class="{cantwrite:ischooseAll}" @mousedown="getChoosePage">
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
      phone: '标清分享',
      longPic: 'pdf',
      chosepage: '全部页面',
      pageNum: '',
      placeholder: '空格隔开，例：1 2 5 7 19-20',
      ischooseAll: true
      //默认请求配置（小写）
      
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
    pdfqueryconfig() {
       return {
         d: designEvent.getDesignInfo().designId,
        type: 3,
        tid:this.teamId ? this.teamId : 0,
       } 
      }
  },
  methods: {
    //选择指定页面
    choseIndexLabel() {
      this.ischooseAll = false
      this.placeholder = '空格隔开，例：1 2 6 15-22'
      this.$set(this.pdfqueryconfig, 'range', testPageNum(this.pageNum, this))
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
      // this.$set(this.pdfqueryconfig,'b','')
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
    this.$emit('choseValPdf', this.pdfqueryconfig);
  },
  watch: {
    //对象变化监听
    pdfqueryconfig: {
      handler: function(val, oldval) {
        this.$emit('choseValPdf', val)
      }

    },
    pageNum(val, oldval) {
      if (val != oldval) {
        this.choseIndexLabel()
      }
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
.chosePage {
  margin: 34px 0 22px 0;
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
</style>



