<template>
    <svg version="1.1" id="tu-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
         x="0px" y="0px"
         :width="width" :height="height"
         :viewBox = "viewBox"
         :imgId="imgId"
         >
        <image :xlink:href="imgUrl" x="0" y="0" :width="imgWidth" :height="imgHeight"  :filter="imgFilter" />
    </svg>
</template>

<script>
  import g_config from 'config/global_config';
  import { mapActions,mapGetters } from 'vuex';
  import IMG from 'dataBus/img.js'
  import leftPanel from 'dataBus/leftPanel'
  export default {
    name:'image',
    data(){
      return {
        dataSvgColors:"",
        width:0,
        height:0,
        imgWidth: 0,
        imgHeight: 0,
        imgFilter:'',
        svgDom:'',
        imgUrl:'',
        showFilter:false,
        imgId:'',
        dataKey:'',
        viewBox:"",
        mid:''
      }
    },
    props:{
      eleIndex: {
      type: Number,
      required: true
      },
      imgFilterId:{
        type:String
      },
    pageId: {
      require: true
    },      
      json:{
        type:Object,
        required:true
      }
    },
    computed: {
      ...mapGetters({
        'focusPageIndex': 'getFocusPageIndex',
        'designInfo': 'getDesignInfo'
      }),
    },
    watch:{
      json:{
        handler:function (val) {
          this.update();
        },
        deep:true
      },
      //储存当前修改的图片地址
      imgUrl:function(v){

        IMG.setImgUrl(v,this.focusPageIndex,this.eleIndex);
      },
      imgFilterId:function(v){
        this.imgFilter = "url(#"+v+")";
      }
    },
    methods:{
      init(){
        //加载图片
        if(this.imgFilterId != ""){
           this.imgFilter = "url(#"+this.imgFilterId +")";
        }
        this.load_img(800);
      },
      update(){
        this.width = this.json['width'];
        this.height = this.json['height'];
        if(this.json['id']!=undefined){
          this.imgId = this.json['id'];
        }
        if(this.json['data-key']!=undefined && this.json['data-key']!='false')
         this.dataKey =this.json['data-key'];
  
        if(this.json['viewBox'] != undefined && this.json['viewBox'] != '') {
          this.viewBox = this.json['viewBox'];
          this.imgWidth = this.json['imgWidth'];
          this.imgHeight = this.json['imgHeight'];
        }else{
          IMG.initImageViewBox(this.width, this.height,this.focusPageIndex,this.eleIndex);
          this.viewBox = `0 0 ${this.width} ${this.height}`;
          this.imgWidth = this.width;
          this.imgHeight = this.height;
        }
       // this.init()
      },
      load_img(width=150){
        if(this.json['data-key']!=undefined&&this.json['data-key']!='false'){
          let imgUrl ='//'+this.designInfo.imgHost+'/materials/'+this.json['data-key']+'@0e_'+width+'w_'+width+'h_0c_0i_0o_1x.png';
          if(width==150){
            this.imgUrl = imgUrl;
            return;
          } 
          let img = new Image();
              img.src = imgUrl;
              img.onload= ()=>{
                this.imgUrl = imgUrl;
              }
        }else{
          //加载用户上传的图片
          const  mid =this.json['id'];
	          if(mid!==undefined){
		          this.$http.post(
			          '/material/getMaterialUrlsByIds',
			          {
				          mids :mid,
				          w : width
			          }
		          ).then((back)=>{
			          if(!back['body']['code']){
                 
                  if(width==150){
                    this.imgUrl = back['body']['urls'][mid];
                    return;
                  }
				          let img = new Image();
				          img.src =back['body']['urls'][mid];
				          let me = this;
				          img.onload=function(){
					          me.imgUrl = this.src
				          }
			          }else{
				          console.log(`ID为 %c「${mid}」%c 的IMG素材未能成功加载|原因是 %c「${back['body']['code']}」%c(-1参数有误;-2未登录;-3权限不足)`,"color:#fff;background:red",'color:black',"color:red",'');
			          }
		          }).catch((error)=>{
			          console.log('加载图片素材-网络链接失败');
		          });
          }

        }

      }

    },
    created(){
    //设置滤镜id
      if (this.imgFilterId!='')
        this.imgFilter = "url(#" + this.imgFilterId + ")";
      		//设置缩略图的地址
    let thumbImg = leftPanel.dragElementPreviewImg.getImgUrl();
		if (thumbImg != '') {
			this.imgUrl = thumbImg;
			//重新置空图片地址
			leftPanel.dragElementPreviewImg.setImgUrl('');

		}else{
      this.load_img();
    }
      this.update();
    },
    mounted(){
      this.init();
    },



  }
</script>