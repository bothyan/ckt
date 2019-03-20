<template>
  <div>
    createDesign
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        kindId: null,           // 分类id
        templateId: null,       // 模版id
        teamId: null,           // 团队id
        teamTemplateId: null,   // 团队模版id
        kindWidth: null,        // 设计宽,高
        kindHeight: null,
        changeTemplate: null,   // 改变模版进入
        seeDesign: null         // 查看其他人设计
      }
    },
    beforeMount() {
    },
    mounted() {
      this.createDesignInit();
    },
    computed: {
      ...mapGetters({
        apiInfo: 'getApiInfo'
      })
    },
    methods: {
      ...mapActions({
      }),
      // 参数赋值
      createDesignInit() {
        let query = this.$route.query;

        this.kindId = query.k,
        this.templateId = query.t,
        this.teamId = query.tid,
        this.teamTemplateId = query.tt,
        this.kindWidth = query.w,
        this.kindHeight = query.h,
        this.changeTemplate = query.d_et,
        this.seeDesign = query.d_cd;
        this.designId = query.d;
        this.thirdKindId = query.tkid;

        this.parInspect();
      },
      // 参数检查
      parInspect() {
        // 缺少必要参数，跳回
        if( this.kindId == undefined &&
            this.templateId == undefined &&
            this.teamTemplateId == undefined &&
            this.designId == undefined &&
            this.thirdKindId == undefined
        ) {
          location.href = '/startDesign';
          return;
        }

        this.createDesign();
      },
      // 发请求创建设计
      createDesign() {

        let createDesignData = {};

        if(this.kindId != undefined) {
          createDesignData.k = this.kindId;
        } else if(this.templateId != undefined) {
          createDesignData.t = this.templateId;
        } else if(this.teamTemplateId != undefined) {
          createDesignData.tt = this.teamTemplateId;
        } else if(this.thirdKindId != undefined) {
          createDesignData.tk = this.thirdKindId;
          createDesignData.k = 127;
        }
        if(this.kindWidth != undefined) {
          if(this.apiInfo) {
            this.kindWidth = this.kindWidth + this.$route.query.unit;
            this.kindHeight = this.kindHeight + this.$route.query.unit;
          }
          createDesignData.ow = this.kindWidth;
          createDesignData.oh = this.kindHeight;
        }
        
        // 创建设计
        this.$http.post('/design/makeDesignIdV2', createDesignData).then((response) => {

          var result = response.body;

          var location_href = "/design?d=" + result.d + "&h=" + result.oh + "&k=" + result.k + "&sec=" + result.sec + "&w=" + result.ow + "&kt=" + encodeURIComponent(result.kt) + "&mp=" + result.mp + "&bv=" + result.bv;

          if(this.templateId != undefined) {
            location_href += "&t=" + this.templateId;
          }
          if(this.teamTemplateId != undefined) {
            location_href += "&tt=" + this.teamTemplateId;
          }
          if(this.teamId != undefined) {
            location_href += "&tid=" + this.teamId;
          }
          if(this.changeTemplate != undefined) {
            location_href += '&d_et=' + this.changeTemplate;
          }
          if(this.seeDesign != undefined) {
            location_href += '&d_cd=' + this.seeDesign;
          }
          if(this.thirdKindId != undefined) {
            location_href += '&tkid=' + this.thirdKindId;
          }

          // 进入功能页
          this.$router.push(location_href);

        }).catch((error) => {
          console.log(error);
        });

      }
    }
  } 
</script>
