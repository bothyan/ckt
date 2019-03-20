<template>
  <div>
    <div>
      <label for="">文件类型：</label>
      <Radio-group v-model="fileType">
        <Radio label=" png " @choseLabel="$set(queryconfig,'type',5)">
        </Radio>
        <Radio label=" jpg " @choseLabel="$set(queryconfig,'jpg',1)"
       >
        </Radio>
      </Radio-group>
    </div>
    <div class="choosePage">
      <label for="">选择页面：</label>
      <Radio-group v-model="choosePage">
        <Radio label="全部" @choseLabel="choseAll"></Radio>
        <Radio label="指定" @choseLabel="choseIndexLabel" ref="input"></Radio>
        <input type="text" label="指定" :placeholder="placeholder" class="share-writepro" v-model="pageNum"  @mousedown="getChoosePage">
      </Radio-group>
    </div>
    <div>
      <label for="">拼接长图：</label>
      <Radio-group v-model="longPic">
        <Radio label="关闭" @choseLabel="$set(queryconfig,'join',0)"></Radio>
        <Radio label="无缝" @choseLabel="$set(queryconfig,'join',1)"></Radio>
        <Radio label="有缝" @choseLabel="$set(queryconfig,'join',2)"></Radio>
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
      fileType: ' png ',
      longPic: '关闭',
      choosePage: '全部',
      pageNum: '',
      placeholder: '空格隔开，例：1 2 6 15-22',
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
    queryconfig(){
      return {
        d: designEvent.getDesignInfo().designId,//从仓库中取出设计id
        opa: 1,
        join: 0,
        type: 5,
        tid:this.teamId ? this.teamId : 0,
      }
    }
  },
  methods: {
    //选择指定页面
    choseIndexLabel() {
      this.ischooseAll = false
      this.placeholder = '空格隔开，例：1 2 6 15-22'
      this.$set(this.queryconfig, 'range', testPageNum(this.pageNum, this))
    },
    checkNum() {
      console.log(this.pageNum)
      if (testPageNum(this.pageNum, this) == "false"||this.pageNum=='0') {
          this.$store.dispatch('setMessageShow',{placeHolder:'非法字符，或者页码超过最大值'})
        return false;
      }
    },
    //选择全部
    choseAll() {
      this.ischooseAll = true
      this.placeholder = '空格隔开，例：1 2 6 15-22'
      // this.$set(this.queryconfig,'b','')
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
    this.$emit('choseVal', this.queryconfig)
  },
  watch: {
    //对象变化监听
    queryconfig: {
      handler: function(val, oldval) {
        this.$emit('choseVal', val)
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
.choosePage {
  margin: 22px 0 22px 0;
}

.share-writepro {
  width: 200px;
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



