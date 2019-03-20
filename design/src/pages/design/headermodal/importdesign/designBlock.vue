<template>
  <div id="flow-box" :style="blockData.boxStyle" class="one-design-block">
    <div class="design-block-cont">
      <div class="block-wrap" :style="blockData.imgStyle">
        <i class="trangle-more" v-if="morepage">
          <i class="pagecount">{{pagecount}}</i>
        </i>
        <div class="thum-wrap" v-show="thumImg">
            <a class="design-info thub-color">...正在生成缩略图</a>
        </div>
        <img class="design-block-image" v-if="noImg" :src="designImg"/>
        <div class="msk" :style="{opacity:thumOPacity}" @click="morePageShow"  @mouseenter="showCurrentInfo" @mouseleave="hideCurrentInfo">
          <a v-if="morepage" class="design-info">点击查看
          </a>
          <a v-if="mydesign" class="design-info">点击置入我的设计</a>
          <a v-if="vip" class="design-info"><span class="vip-info">此功能为VIP会员专享</span><br/><a  class="up-vip">点此升级VIP会员</a><span class="vip-info">后方可使用</span></a>
        </div>
      </div>
      <p class="block-name">{{designTitle}}</p>
      <p class="block-time">{{designTime}}</p>
    </div>
  </div>
</template>
<script>
import modal from 'components/modal/modal.vue'
import { mapActions, mapGetters } from 'vuex'
import designSetInPage from 'dataBus/page.js'
import dataHandle from 'common/dataHandle'
import designEvent from 'dataBus/design'
import pageList from 'dataBus/pageList.js'
let {updatePageThumb} = pageList
export default {
  data() {
    return {
      modalshow: false,
      noImg: false,
      thumImg:false,
      thumOPacity:0,
      designImg:''
    }
  },
  components: {
    modal: modal,
  },
  props: {
    blockData: {
      required: true,
      type: Object,
      default: function() {
        return {
          data: {}
        }

      }
    }
  },
  computed: {
    ...mapGetters({
      isVip: 'getIsVip',
      pageIndex:'getFocusPageIndex'
    }),
    designTitle() {
       return this.blockData.data.designTitle==""?'默认标题':this.blockData.data.designTitle
    },
    designTime() {
      return this.blockData.data.createTime.substring(0, 10)
    },
    //多页
    morepage() {
      //外加判断是否是vip
      if (this.isVip == 2 && this.blockData.data.designPageCount > 1) {
        this.pagecount = this.blockData.data.designPageCount
        this.pageurl = this.blockData.data.imgUrl
        return true
      } else {
        return false
      }

    },
    //置入我的设计
    mydesign() {
      if (this.isVip == 2 && this.blockData.data.designPageCount == 1) {
        return true
      } else {
        return false
      }
    },
    vip() {
      if (this.isVip == 1) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
      let imgS = new Image(),
          thumbTime = this.blockData.data.lastThumbTime,
          updateTime = this.blockData.data.lastUpdateTime,
          imgUrl = this.blockData.data.imgUrl,
          lastThumbTime = Date.parse(thumbTime),
          lastUpdateTime = Date.parse(updateTime);
      if(isNaN(lastThumbTime)||(lastUpdateTime>lastThumbTime)){
             this.thumImg = true
              this.noImg = false;
        return;
      }
      let _this = this;
      imgS.src = this.blockData.data.imgUrl;
      imgS.onload = function(){
          this.thumImg = false
          _this.noImg = true;
          _this.designImg = imgUrl+'@230w.src?v='+thumbTime
      }
  },
  methods: {
    ...mapActions({
      setMessageShow: 'setMessageShow'
    }),
    showCurrentInfo(){
      this.thumOPacity = 1
      this.thumImg=false
    },
    hideCurrentInfo(){
      this.thumOPacity = 0;
      //获取进来之前的状态
      let thumbTime = this.blockData.data.lastThumbTime,
          updateTime = this.blockData.data.lastUpdateTime,
          imgUrl = this.blockData.data.imgUrl,
          lastThumbTime = Date.parse(thumbTime),
          lastUpdateTime = Date.parse(updateTime);
       if(isNaN(lastThumbTime)||(lastUpdateTime>lastThumbTime)){
            this.thumImg = true 
      }else{
        this.thumImg = false
      }
    },
    	 // 查询设计是否已应用新的保存方式
    applyNewSave(designId) {
      this.$http.post('/design/appliedNewSave', {d: designId}).then((response) => {
        // 操作的状态码 （-1参数错误；0未应用；1已应用）
        let code = response.body.code;
        //已经应用
        if(code === 1) {
             let query = {
          d: this.blockData.data.designId,
          udspk:0
        }
        this.getDesignV4(query)
        } else if(code === 0) {
          setTimeout(() => {
            this.applyNewSave(designId);
          }, 1000);
        } else {
          this.setErrorShow(3);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getDesignV4(query) {
      this.$http.post('/design/getDesignV4', query).then(res => {
        //单页设计置入
        		 if(res.body.error) {
								if(res.body.error == '非beta环境') {
									// 设计没有应用新的保存方式
									this.applyNewSave(query.d);
									return;
								}
								this.setErrorShow(3);
								return;
        		}
        let newpage = JSON.parse(res.body.firstPageJson)
        console.log(newpage)
        let pageUrl = this.blockData.data.imgUrl
        pageList.updatePageThumb(pageUrl,this.pageIndex)
        designSetInPage.setPageJson(newpage,this.pageIndex)
        this.setMessageShow({ placeHolder: '置入设计成功', kind: 'success' })
        //关闭模态框
        //触发保存
        this.$emit('closeWaterModal')
        designSetInPage.elementBlur()
        	dataHandle.commit('element',{
					eventType:5,
					pageIndex:dataHandle.vuexGetters().getFocusPageIndex,
					value:newpage
				}).push()
      }).catch(error => {
        console.log(error)
      })
    },
    //点击多页
    morePageShow: function() {
      if (this.morepage == true) {
        this.$emit('showMorePage', this.pagecount)
        this.$emit('sendToId', this.blockData.data.designId)
        this.$emit('showPageUrl', this.pageurl)
      } else if (this.mydesign == true) {
        //点击单页置入设计
        let query = {
          d: this.blockData.data.designId,
          udspk:0
        }
        this.getDesignV4(query)
      } else if (this.vip == true) {
        //点击跳转到充值页面
        window.open('/price?p=1')
      }
    },
    modalClose: function() {
      this.modalshow = false
    }
  }

}
</script>
<style lang="less" scoped>
.one-design-block {
  display: inline-block;
  background-color: #fff;
  padding: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .08);
  position: absolute;
  &:hover {
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .32);
  }
  .design-block-cont {
    img {
      width: 100%;
      cursor: pointer;
    }
    span {
      width: 100%;
      text-align: left;
      font-size: 14px;
      color: #333;
      line-height: 18px;
      margin-top: 10px;
      text-decoration: none;
    }
  }
}

.design-info {
  color: #fff;
  position: relative;
  top: 40%;
  .vip-info{
    color:#fff!important;
  }
  .up-vip{
    color: #14a3ed!important;
    text-decoration: underline!important;
  }
}
.thub-color{
  color:#000!important;
}

.block-name {
  margin-top: 16px;
  margin-bottom:8px;
  color:#626262;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.block-time{
  color:#bfbfbf;
}
.block-wrap {
  position: relative;
  .trangle-more {
    width: 0;
    height: 0;
    border-top: 40px solid #23C2FF;
    border-right: 40px solid transparent;
    display: inline-block;
    position: absolute;
    z-index: 100;
    top: -8px;
    left: -8px;
    .pagecount {
      display: inline-block;
      position: relative;
      top: -35px;
      left: 5px;
      color: #fff;
      font-style: normal;
    }
  }
}

.msk {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  text-align: center;
  opacity: 0;
  transition: opacity 0s;
  z-index: 1;
   background-color: rgba(0, 0, 0, .24);
}
.thum-wrap{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  text-align: center;
  z-index: 1;
  opacity: .8;
}

</style>

