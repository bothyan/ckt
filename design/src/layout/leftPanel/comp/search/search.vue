<template>
  <div id="leftPanel-search">
    <div class="leftPanel-search-content" v-ss-scroll="scrolling" ref="dom">
      <div class="leftPanel-search-content-type">
        <span class="selectTextBlock" :class="{active:searchType===1}" @click="setType(1)">素材</span>
        <span class="selectTextBlock" :class="{active:searchType===2}" @click="setType(2)">模板</span>
      </div>
      <material
        :keyword="keyword"
        v-if="searchType===1"
        :loadCtrl="loadFlag"
        @resize="e=>{childHeight=e}"
        @doSearch="k=>{$emit('doSearch',k)}"
        :clearFlag="clearFlag"
        :search="search"
      ></material>
      <templates
        :keyword="keyword"
        v-if="searchType===2"
        :loadCtrl="loadFlag"
        @resize="e=>{childHeight=e}"
        @doSearch="k=>{$emit('doSearch',k)}"
        :clearFlag="clearFlag"
        :search="search"
      ></templates>
    </div>
  </div>
</template>
<script>
  import material from './comp/searchMaterial.vue'
  import templates from './comp/searchTemplate.vue'
  import {mapGetters,mapActions} from 'vuex'
  import {_throttle} from 'common/common'

	export default{
		name:'leftPanel-search',
		data(){
			return{
				throttled:{},
				childHeight:0,
        loadFlag:Date.now(),
				search:false
			}
		},
		methods:{
      ...mapActions({
	      setSearchType:'setLeftPanelSearchType'
      }),
      setType(t){
//      	console.log(this.keyword)
	      this.setSearchType(t)
//        this.$nextTick(()=>{
//	        this.search=!this.search
//        })
      },
			scrolling(e,p){
				this.throttled.apply(this,[e,p])
			},
			scrollExec(e,p){
				let sT=p.scrollTop,T=this.childHeight-this.$refs.dom.offsetHeight+72
        if(sT>16){
	        this.$emit('searchBlock',{s:1,d:[]})
        }else {
	        this.$emit('searchBlock',{s:0,d:[]})
        }
				if(sT>=T){
          this.loadFlag=Date.now()
				}
			},
		},
		beforeMount(){
			this.throttled=_throttle(this.scrollExec,200)
		},
		props:{
			keyword:{
				type:Object,
				required:true
			},
			clearFlag:{

      }
		},
		components:{
			material,templates
    },
		watch:{
			childHeight(v){
				this.scrollExec(null,{scrollTop:this.$refs.dom.scrollTop})
      },
		},
    computed:{
      ...mapGetters({
	      searchType:'getLeftPanelSearchType'
      })
    }

	}
</script>
<style lang="less" scoped>
  @import '../common';

  #leftPanel-search{
    overflow: hidden;

    .leftPanel-search-content{
      width: 312px;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      padding-top: 72px;
      overflow-y: auto;
      overflow-x: hidden;
      transform: translate(0,0);

      .leftPanel-search-content-type{
        padding:0  16px 16px 16px;
        width: 312px;

        &:after{
          content: '';
          display: block;
          clear: both;
        }
        
        &>span{
          width: 132px;
          margin-right: 16px;
          float: left;
          box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);

          &:nth-child(2){
            margin-right: 0;
          }
        }
      }
    }

  }
</style>