<template>
  <div class="share-design">
    <div class="share-wrap">
      <div class="share-search">
        <div class="share-serch-proname">
          <label for="" class="share-proname">作品另存为：</label>
          <input type="text" placeholder="输入作品名称" class="share-writepro" maxlength="20" v-model="sharetitle">
          <span class="share-count">{{sharetitle.length}}/20</span><br />
          <span class="design-verify" v-show="verify">作品名不合理</span>
        </div>
        <label for="" class="chosefiles">选择文件夹：</label>

        <newdrop-down :dData="getFilelist" @select="selectfile" style="width:262px;" :hasFolderIcon="true" :trigger="'click'">
        </newdrop-down>
        <div class="exit" @click="cancel">取消</div>
        <div class="join-now" @click="sureSave">确认另存为</div>

      </div>

    </div>

  </div>
</template>
<script>
import newdropDown from 'ss-drop-down'
import modal from 'components/modal/modal.vue'
import dataHandle from 'common/dataHandle'
export default {
  name: 'joinactive',
  data() {
    return {
      sharetitle: '',
      getFilelist: []
    }
  },
  computed: {
    verify: function() {
      //设计名不能包含以下特殊字符//,/,:,*,?,"",<>,|
      var regStr = /[\/\\\:\*\?\"\<\>\|]/g;
      if (regStr.test(this.sharetitle)) {
        return true
      }
    }
  },
  components: {
    newdropDown: newdropDown,
    modal: modal
  },
  methods: {
    //获取我的设计文件夹
    getmyDesinfile() {
      let _this = this
      this.$http.post('/design/queryUserFolders').then(function(response) {
        let result = response.body.folderList;
        for (let i in result) {
          result[i].des = result[i].folder_name
        }
        	//添加一个全部的场景
				result.unshift({
					des: '默认文件夹',
					sel: '默认文件夹',
					folder_id: 0
				})
        _this.getFilelist = result

      }).catch(function(error) {
        console.log(error)
      })
    },
    selectfile: function(data) {
      this.selectSum = data
    },
    //取消保存
    cancel() {
      this.$emit('cancelModal')
    },
    sureSave() {
      if(this.sharetitle==""){
        this.$store.dispatch('setMessageShow',{placeHolder:'请输入作品名称'})
        return false;
      }else{
        if(window.localStorage.getItem('button')=='on'){
          return;
        }
        window.localStorage.setItem('button','on')
        let dataObj = {
        'selectSum':this.selectSum,
        'sharetitle':this.sharetitle
        }
        this.$emit('sureToSave', dataObj)
      }
      
      // this.$emit('changeDesignTitle',this.sharetitle)
      // dataHandle.commit('design',{
      //   key:'title',
      //   value:this.sharetitle,
      //   eventType:1
      //   }).push()

    }
  },
  beforeMount() {
    //获取文件夹
    this.getmyDesinfile()
  },
  mounted() {

  }

}
</script>
<style lang="less" scoped>
.center {
  text-align: center;
}

.design-verify {
  display: inline-block;
  color: red;
  position: absolute;
  left: 130px;
}

.share-wrap {
  width: 408px;
  height: 210px;
  background-color: #FFFFFF;
  border-radius: 5px;
  padding-top: 20px;
}

.share-title {
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 24px;
  color: #626262;
}

.share-proname {
  font-size: 14px;
  color: #626262;
  margin-top: 15px;
  display: inline-block;
}

.chosefiles {
  font-size: 14px;
  color: #626262;
  margin-left: 17px;
  display: inline-block;
  position: relative;
  top: -10px;
}

.share-serch-proname {
  margin-left: 17px;
  margin-bottom: 18px;
}

.share-search .share-writepro {
  width: 262px;
  height: 40px;
  line-height: 40px;
  border: none;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
  background: #FBFBFB;
  padding-left: 20px;
  color: #808080;
  &::-webkit-input-placeholder {
    color: #cdcdcd;
  }
}

.share-count {
  position: relative;
  right: 42px;
  color: #CFCFCF;
}

.join-now {
  width: 215px;
  height: 40px;
  background-color: #07AFFD;
  font-size: 14px;
  color: #FFF;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  margin-top: 31px;
  &:active{
      background-image:linear-gradient(90deg,#5ea2ff,#00e3ff);
    }
  &:hover{
    opacity:.8;
  }
}

.exit {
  width: 106px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #D8D8D8;
  font-size: 14px;
  color: #626262;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  margin: 31px 26px 0 17px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: " ";
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}
</style>


