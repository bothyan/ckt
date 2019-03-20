<template>
  <div id="leftPanel-template">
    <div class="leftPanel-template-content" v-ss-scroll="scrolling" ref="dom">
      <div class="leftPanel-template-showType">
        <span class="selectTextBlock" :class="{active:showCollectedTemplates===0}" @click="showCollectedTemplates=0">推荐模板</span>
        <span class="selectTextBlock" :class="{active:showCollectedTemplates===2}" @click="showCollectedTemplates=2">收藏模板</span>
        <span class="selectTextBlock" :class="{active:showCollectedTemplates===1}" @click="showCollectedTemplates=1">{{teamId>0?'团队模板':'购买模板'}}</span>
      </div>
      <div class="leftPanel-template-result" ref="result">
        <div class="leftPanel-template-result-container">
          <templateBlock
            class="leftPanel-template-result-block"
            v-for="(e,i) in blockData"
            :data="e"
            :key="i"
            :state="blockState[i]"
            :index="i"
            @click="currentBlock=i"
            @cancel="clearBlock"
            :style="{marginTop:blockStyle[i]+'px'}"
            @tempIdList="e=>{$set(blockData[i],'tempIdList',e)}"
            @updateMountedIndex="updateMountedIndex"
            :large="isLarge"
          ></templateBlock>
          <div class="leftPanel-search-result-null" v-show="notFound">
            <span>没有内容</span>
            <span v-if="!apiInfo">去<a href="/templatecenter" target="_blank">模板中心</a>看看</span>
          </div>
          <div class="leftPanel-result-loading"
               v-show="loading"
          ></div>
        </div>
        <transition name="result">
          <templateMore
            class="leftPanel-template-result-block-more"
            v-if="currentBlock!==null"
            :style="{top:resultTop+'px'}"
            :data="blockData[currentBlock]"
            :showCollectedTemplates="showCollectedTemplates"
            :collectedTemplateIdsStr="collectedTemplateIdsStr"
            @tempIdList="e=>{$set(blockData[currentBlock],'tempIdList',e)}"
            @refresh="refresh"
            @refreshCollected="refreshCollected"
            :large="isLarge"
          ></templateMore>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  import templateBlock from './comp/templateBlock.vue'
  import templateMore from './comp/templateMore.vue'
  import {mapGetters,mapActions} from 'vuex'
  import {_throttle} from 'common/common'

  let getdata={
    pageNo:1,
    pageSize:10,
    isShowMyCollectedTemplates:0,
    parentKindId:null,
    secondKindId:null,
    tagId:null,
    themeId:null,
    isOfficial:0,
//    startTime:"",
//    endTime:"",
    keywords:"",

    timeOrder:0,
    useTimesOrder:0,
    collectionTimesOrder:0,
    stickOrder:1,
    priceType:0,
    usage:null,
    time:new Date().getTime(),
  }
  export default{
    name:'leftPanel-template',
    data(){
      return{
        blockData:[],
        currentBlock:null,
        blockState:[],
        blockStyle:[],
        resultTop:0,
        showCollectedTemplates:0,
        pageNo:1,
        pageTotal:1,
        loading:false,
        throttled:{},
        collectedTemplateIdsStr:'',
        notFound:false,
        hasMountedIndex:0
//        isLarge:true
      }
    },
    methods:{
      updateMountedIndex(index){
        if(index>this.hasMountedIndex)
          this.hasMountedIndex=index
      },
      refresh(){
        this.clearBlock()
        this.currentBlock=null
        this.blockData=[]
        this.checkGetData()
      },
      refreshCollected(){
        this.getTemplateIsCollected()
      },
      getDataAllTemplates(){
        this.loading=true
        this.$http.post('/designtemplate/getAllTemplates',{secondKindId:this.designInfo.designKindId,pageNo:this.pageNo,pageSize:10,stickOrder:1,priceType:this.apiInfo?2:0})
        .then(res=>{
          if(res.data.body){
            this.$http.get(res.data.body.cacheUrl).then(({data})=>{
              this.pageTotal=data.body.totalCount/10>1?
                (((data.body.totalCount/10)|0)+(data.body.totalCount-((data.body.totalCount/10)|0)*10>0?1:0)):1
              let arr=[]
              let {hasMountedIndex}=this
              data.body.queryDesignTemplateBeanList.forEach((template,index)=>{
//									let isCollected=false
//									this.collectedTemplateIdsStr.split(',').forEach(v=>{
//										if(v==template.designTemplateId){
//											isCollected=true
//										}
//									})
                arr.push({...template,index,hasMountedIndex})
              })
              this.blockData.push(...arr)
              this.notFound=this.blockData.length===0
              this.loading=false
            },err=>{
              this.setMessageShow({placeHolder:'网络出错',kind:'error'})
            })
          }
        },err=>{
          this.setMessageShow({placeHolder:'网络出错',kind:'error'})
        })
      },
      getDataTemplateInFolder(type){
        let {pageNo}=this
        this.loading=true
        this.$http.post('/designtemplate/listTemplateInFolder',{pageNo,type,pageSize:10,kindId:this.designInfo.designKindId})
        .then(res=>{
          let {body}=res.data
          let {hasMountedIndex}=this
          if(body.templates){
            this.pageTotal=body.totalCount/10>1?(((body.totalCount/10)|0)+(body.totalCount-((body.totalCount/10)|0)*10>0?1:0)):1
            let arr=[]
            body.templates.forEach(e=>{
//								let isCollected=false
//								this.collectedTemplateIdsStr.split(',').forEach(v=>{
//                  	if(v==e.template.designTemplateId){
//		                  isCollected=true
//                    }
//                  })
              arr.push({...e.template,hasMountedIndex})

            })
            this.blockData.push(...arr)
          }else {
            this.blockData=[]
          }
          this.notFound=this.blockData.length===0
          this.loading=false
        },err=>{
          this.setMessageShow({placeHolder:'网络出错',kind:'error'})
        })
      },
      getTeamTemplate(){
        this.$http.post('/designtemplate/listTeamTemplate',{tid:this.teamId,sort:0,skid:this.designInfo.designKindId,pageNo:this.pageNo})
        .then(res=>{
          let {body}=res.data
          let {hasMountedIndex}=this
          if(body.templates){
            this.pageTotal=body.totalCount/10>1?(((body.totalCount/10)|0)+(body.totalCount-((body.totalCount/10)|0)*10>0?1:0)):1
            let arr=[]
            body.templates.forEach(e=>{
              delete e.createTime
              arr.push({
                ...e,designTemplateImageUrl:e.thumbImgUrl,
                designTemplatePageCount:e.pageCount,
                templateTitle:e.title,
                designTemplateId:e.teamTemplateId,
                hasMountedIndex
              })
            })
            this.blockData.push(...arr)
          }else {
            this.blockData=[]
          }
          this.notFound=this.blockData.length===0
          this.loading=false
        },err=>{
          this.setMessageShow({placeHolder:'网络出错',kind:'error'})
        })
      },
      getTemplateIsCollected(){
        this.$http.post('/designtemplate/getTemplateIdsStr',{type:2})
        .then(res=>{
          if(res.data.body){
            let {collectedTemplateIdsStr}=res.data.body
            this.collectedTemplateIdsStr=collectedTemplateIdsStr
          }
        },err=>{
          this.setMessageShow({placeHolder:'网络出错',kind:'error'})
          console.log('网络出错')
        })
      },
      setBlock(i,h){
        let blockState=[],blockStyle=[];
        for (let j=0;j<this.blockData.length;j++){
          if(j===i){
            blockState.push(1)
          }else {
            blockState.push(2)
          }
        }
        this.blockState=blockState

        if(this.isLarge){
          for (let j=0;j<this.blockData.length;j++){
            if(j===i+1){
              blockStyle.push(this.resultHeight+24)
            }else {
              blockStyle.push(8)
            }
          }
          this.resultTop=(this.blockHeight+8)*(i+1)+8
        }else {
          let row=((i/2)|0)+1
          for (let j=0;j<this.blockData.length;j++){
            if(j===row*2||j===row*2+1){
              blockStyle.push(this.resultHeight+24)
            }else {
              blockStyle.push(8)
            }
          }
          this.resultTop=(this.blockHeight+8)*row+8
        }
        this.blockStyle=blockStyle
      },
      clearBlock(){
        let blockState=[],blockStyle=[];
        for (let i=0;i<this.blockData.length;i++){blockState.push(0)}
        for (let i=0;i<this.blockData.length;i++){blockStyle.push(8)}
        this.blockState=blockState
        this.blockStyle=blockStyle
        this.currentBlock=null
      },
      scrolling(e,p){
        this.throttled.apply(this,[e,p])
      },
      scrollExec(e,p){
        let sT=p.scrollTop,T=this.$refs.dom.lastChild.offsetHeight+120-this.$refs.dom.offsetHeight
        if(sT>16){
          this.$emit('searchBlock',{s:1,d:[]})
        }else {
          this.$emit('searchBlock',{s:0,d:[]})
        }
        if(sT>=T&&!this.loading&&this.pageNo<this.pageTotal){
          this.pageNo+=1
        }
      },

      checkGetData(){
        this.getTemplateIsCollected()
        if(this.showCollectedTemplates>0){
          if(this.isLogin){
            if(this.teamId>0&&this.showCollectedTemplates===1){
              this.getTeamTemplate()
            }else{
              this.getDataTemplateInFolder(this.showCollectedTemplates)
            }
          }else{
            this.showCollectedTemplates=0
            this.showLogreg(1)
          }
        }else{
          this.getDataAllTemplates()
        }
      },
      ...mapActions({
        showLogreg:'setLogregShow',
        setMessageShow:'setMessageShow'
      })
    },
    watch:{
      index(){
        if(this.index===1&&this.showCollectedTemplates===0&&this.blockData.length===0)
          this.getDataAllTemplates()
      },
      currentBlock(v){
//				this.clearBlock()
        if(v!==null)
          this.setBlock(v)
      },
      //判断登录状态切换到收藏和购买
      showCollectedTemplates(){
        this.hasMountedIndex=0
        this.clearBlock()
        this.pageNo=1
        this.pageTotal=1
        this.blockData=[]
        this.currentBlock=null
        this.checkGetData()
      },
      pageNo(val,old){
        if(val>old&&old>0)
          this.checkGetData()
      },
      blockData(){
        let T=this.$refs.dom.lastChild.offsetHeight+120-this.$refs.dom.offsetHeight
        if(T<=0&&!this.loading&&this.pageNo<this.pageTotal){
          this.pageNo+=1
        }
      },
      designInfo(v){
        console.log(v)
      },
//			collectedTemplateIdsStr(str){
//				let arr=[]
//        this.blockData.forEach(e=>{
//	        let isCollected=false
//	        str.split(',').forEach(v=>{
//		        if(v==e.designTemplateId){
//			        isCollected=true
//		        }
//	        })
//	        arr.push({...e,isCollected})
//        })
//        this.blockData=arr
//      }
    },
    components:{
      templateBlock,templateMore
    },
    computed:{
      isLarge(){
        let f=false
        if(this.blockData.length>0){
          if(parseFloat(this.blockData[0].width)/parseFloat(this.blockData[0].height)>=1.8)
            f=true
        }
        return f
      },
      blockHeight(){
        if(this.blockData.length>0){
          let w=this.isLarge?280:136
          return parseFloat(this.blockData[0].height)/parseFloat(this.blockData[0].width)*w
        }
        return 0
      },
      resultHeight(){
        let h=0
        if(this.isLarge){
          if(this.currentBlock!==null){
            if(this.blockData[this.currentBlock].designTemplatePageCount>1){
              let c=this.blockData[this.currentBlock].designTemplatePageCount
              h=74+(8+this.blockHeight)*c
            }else{
              h=74
            }
          }
          return h
        }else {
          if(this.currentBlock!==null){
            if(this.blockData[this.currentBlock].designTemplatePageCount>1){
              let c=this.blockData[this.currentBlock].designTemplatePageCount,row=((c/2)-((c/2)|0))>0?((c/2)|0)+1:((c/2)|0)
              h=74+(8+this.blockHeight)*row
            }else{
              h=74
            }
          }
          return h
        }
      },
      ...mapGetters({
        teamId:'getTeamId',
        isVip:'getIsVip',
        isLogin:'getIsLogin',
        index:'getLeftPanelIndex',
        designInfo:'getDesignInfo',
        apiInfo:'getApiInfo'
      })
    },
    beforeMount(){
      this.throttled=_throttle(this.scrollExec,200)
      if(this.index===1)
        this.getDataAllTemplates()
    }
  }
</script>
<style lang="less" scoped>
  @import '../common';

  #leftPanel-template{
    overflow: hidden;
    transform: translate(0,0);

    .leftPanel-template-content{
      width: 312px;
      height: 100%;
      /*padding-left: 16px;*/
      box-sizing: border-box;
      position: relative;
      padding-top: 72px;
      overflow-y: auto;
      overflow-x: hidden;

      .leftPanel-template-showType{
        margin-left: 16px;
        /*text-align: center;*/

        &:after{
          content: '';
          display: block;
          clear: both;
        }

        span{
          width: 88px;
          margin-right: 8px;
          display: block;
          float: left;

          &:nth-last-child(1){
            margin-right: 0;
          }
        }
      }

      .leftPanel-template-result{
        position: relative;

        .leftPanel-template-result-container{
          margin: 16px;
          width: 280px;
          min-height: 80px;
          position: relative;

          &:after{
            content: '';
            display: block;
            clear: both;
          }

          .leftPanel-template-result-block{
            float: left;
            margin-top: 8px;
            transition: all .3s ease;

            &:nth-child(2n-1){
              margin-right: 8px;
            }
          }

          .leftPanel-search-result-null{
            position: fixed;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            height: 190px;
            width: 128px;
            box-sizing: border-box;
            padding-top: 140px;

            span{
              display: inline-block;
              width: 100%;
              font-size: 14px;
              line-height: 22px;
              color: #BFBFBF;
              text-align: center;

              &>a{
                text-decoration: none;
                color: #428bca;
                cursor: pointer;
              }
            }

            &:after{
              content: '';
              top:0;
              left:0;
              position: absolute;
              width: 128px;
              height: 124px;
              background: url("../search/searchNotFound.png") no-repeat;
              background-size: 128px 124px;
            }
          }

          .leftPanel-result-loading{
            width: 48px;
            height:60px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 2px;
            background: url("../img/onloadMaterial.gif") no-repeat;
            background-size: 48px 60px;
            z-index: 9;
          }
        }

        .result-enter-active, .result-leave-active {
          opacity:1;
          transition: opacity .3s ease;
        }
        .result-enter, .result-leave-to{
          opacity:0;
        }

        .leftPanel-template-result-block-more{
          position: absolute;
        }

      }
    }

  }
</style>