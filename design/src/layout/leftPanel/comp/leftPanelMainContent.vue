<template>
  <div class="leftPanel-mainContent" ref="leftPanel">
    <div class="leftPanel-mainContent-search-input" :class="{active1:searchState===1,active2:searchState===2}">
      <div class="leftPanel-mainContent-search-shadow" v-if="showShadow"></div>
      <input
        type="text"
        :placeholder="placeholder"
        v-model="keyword"
        @keydown.enter="doSearch"
        @click="$emit('changeIndex',0)"
      >
      <div
        class="leftPanel-mainContent-search-input-delete"
        v-show="keyword.length>0"
        @click="clear"
      ></div>
      <div class="leftPanel-mainContent-search-input-types" v-if="searchState===2">
        <dropDown class="types-dropDown" :data="selectOpt" reSet="" @select="selectType"></dropDown>
        <div
          class="leftPanel-mainContent-search-input-types-close"
          @click="materialShowResultFlag=!materialShowResultFlag"
        ></div>
      </div>
    </div>
    <div class="leftPanel-mainContent-comps" :style="{top:-index*100+'%'}">
      <search
        class="leftPanel-mainContent-comp"
        :keyword="searchKeyword"
        @doSearch="e=>{keyword=e}"
        @searchBlock="changeSearch"
        :clearFlag="clearFlag"
      ></search>
      <templates
        class="leftPanel-mainContent-comp"
        @searchBlock="changeSearch"
      ></templates>
      <material
        class="leftPanel-mainContent-comp"
        @searchBlock="changeSearch"
        @updateSel="updateSel"
        :closeResult="materialShowResultFlag"
        :typesSel="selId"
      ></material>
      <fonts
        class="leftPanel-mainContent-comp"
        @searchBlock="changeSearch"
      ></fonts>
      <background
        class="leftPanel-mainContent-comp"
        @searchBlock="changeSearch"
      ></background>
      <tools
        class="leftPanel-mainContent-comp"
        @searchBlock="changeSearch"
      ></tools>
      <upload
        class="leftPanel-mainContent-comp"
        @searchBlock="changeSearch"
        @showQrCode="e=>{$emit('showQrCode',e)}"
      ></upload>
    </div>
  </div>
</template>
<script>
	import search from './search/search.vue'
	import templates from './template/template.vue'
	import material from './material/material.vue'
	import background from './background/background.vue'
	import fonts from './font/font.vue'
	import tools from './tools/tools.vue'
	import upload from './upload/upload.vue'
	import dropDown from '../../../components/dropDown/dropDown.vue'
	import {mapGetters} from 'vuex'

	export default{
		data(){
			return{
				searchKeyword:{},
				keyword:'',
				searchState:0,
				selectData:[],
				selId:{},
				clearFlag:false,
        materialShowResultFlag:false,
        showShadow:false
			}
		},
		components:{
			search,templates,material,dropDown,background,fonts,tools,upload
		},
		methods:{
			doSearch(){
				this.$emit('changeIndex',0)
				if(/^\s*$/.test(this.keyword))
					return
				this.searchKeyword={
					k:this.keyword,
					t:Date.now()
				}
			},
			changeSearch({s,d}){
				this.searchState=s
				this.selectData=d
			},
			updateSel(v){
//  			console.log('updateSel',v)
				this.selectData=v
			},
			selectType({id}){
//        let selectData=[...this.selectData]
//	      selectData.map(e=>{
//        	e.active=e.kindId===id
////		      selectData.push({...e,active:e.kindId===id})
//        })
//        this.selectData=selectData
//        console.log(id)
				this.selId={id,t:Date.now()}
			},
      clear(){
				this.keyword=''
        this.clearFlag=!this.clearFlag
      }
		},
		computed:{
			selectOpt(){
				let opt=[],sel='全部'
				for(let i=0;i<this.selectData.length;i++){
					opt.push({dis:false,des:this.selectData[i].kindTitle,
						sel:this.selectData[i].active,id:this.selectData[i].kindId})
					if(this.selectData[i].active){
						sel=this.selectData[i].kindTitle
					}
				}
				return {sel,opt,id:null}
			},
			...mapGetters({
				searchType:'getLeftPanelSearchType'
			}),
			placeholder(){
				let str=this.searchType===1?'素材':'模板'
				return `请输入${str}关键字，按enter键确认`
			}
		},
		props:{
			index:{
				required:true,
				default:0
			}
		},
		watch:{
			index(){
				this.searchState=0
        this.showShadow=true
//        setTimeout(()=>{
//	        this.showShadow=false
//        },400)
			},
			searchType(){
				this.doSearch()
      }
		}
	}

</script>
<style lang="less">
  .leftPanel-mainContent{
    /*padding-top: 72px;*/
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    /*overflow-x: hidden;*/
    /*overflow-y: auto;*/
    overflow: hidden;
    position: relative;
    background-color: #f8f8f8;
    z-index:99;


    .leftPanel-mainContent-search-input{
      position: absolute;
      top:0;
      left: 0;
      width: 100%;
      height: 72px;
      background: transparent;
      /*background: #f8f8f8;*/
      z-index: 100;
      transition: all .4s ease;

      .leftPanel-mainContent-search-shadow{
        width: 296px;
        height: 100%;
        background: #f8f8f8;
      }

      &[class~='active1']{
        background:#F8F8F8;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.16);
      }

      &[class~='active2']{
        background:#F8F8F8;
        height: 116px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.16);
      }

      &>input{
        position: absolute;
        top:16px;
        left: 50%;
        transform: translateX(-50%);
        width: 280px;
        height: 40px;
        background: #ffffff;
        /*width: 100%;*/
        /*height: 100%;*/
        box-sizing: border-box;
        padding: 0 32px 0 12px;
        line-height: 40px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.08);
        border:none;
        font-size: 12px;

        &:focus,&:hover{
          box-shadow: 0 4px 8px 0 rgba(72, 182, 243, 0.16);
          outline: none;
        }

        &::placeholder{
          color: #BFBFBF;
        }
      }

      .leftPanel-mainContent-search-input-delete{
        width: 16px;
        height: 16px;
        background: url("./img/deleteText.svg") no-repeat;
        position: absolute;
        top:28px;
        right:28px;
        cursor: pointer;
      }

      .leftPanel-mainContent-search-input-types{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 280px;
        top:72px;

        .types-dropDown{
          width: 184px;
          height: 28px;
          background: #FFFFFF;
          box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
        }

        .leftPanel-mainContent-search-input-types-close{
          width: 20px;
          height:20px;
          display: block;
          float: right;
          background: url("./img/leftPanel-close.svg") no-repeat 0 0;
          cursor: pointer;
          margin: 4px 0;

          &:hover{
            background: url("./img/leftPanel-close.svg") no-repeat 0 -20px;
          }
        }
      }
    }

    .leftPanel-mainContent-comps{
      width: 100%;
      height: 700%;
      left: 0;
      top:0;
      position: absolute;
      transition: top .4s ease;

      &>.leftPanel-mainContent-comp{
        width: 100%;
        height: 14.286%;
        box-sizing: border-box;
        /*padding-top: 58px;*/
        div {
          &::-webkit-scrollbar-thumb {
            width: 8px;
            border-radius: 10px;
            background-color: #e2e2e2;
          }
        }
        
      }
    }

  }
</style>
