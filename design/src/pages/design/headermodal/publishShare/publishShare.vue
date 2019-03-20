<!--
  发布分享 2017/11/2
  胡元港 phone：15280907093
-->
<template>
  <modal type="modal1" :modalShow="true" @modalClose="closeShare">
    <div class="publish-share" v-if="!qrcodeShow">
      <div class="header">
        <div class="header-bar">
          <span :class="{active: childShow === 1}" @click="setChildShow(1)">分享设计</span>
          <span :class="{active: childShow === 2}" @click="setChildShow(2)">参加活动</span>
        </div>
      </div>
      <div class="share" v-show="!joinSuccess&&childShow === 1">
        <div class="share-link">
          <i class="share-icon"></i>
          <input class="share-url" :value="shareUrl"  readonly/>
          <button class="share-copy blue-btn" @click="copyLink" :data-clipboard-text="shareLink">复制链接</button>
        </div>
        <div class="choose">
          <span class="checkbox" :class="{active: copyFlag, 'no-active': !copyFlag}" @click="changeCopyState"></span>
          <p class="tip-text">允许他人复制并使用此设计（该设计内容不会被修改）</p>
        </div>
        <div class="share-other">
          <p>分享到第三方</p>
          <ul class="other-list">
            <li class="list-item" @click="shareThirdParty('qq')">
              <i class="icon icon-qq"></i>
              <p class="icon-text">QQ</p>
            </li>
            <li class="list-item" @click="shareThirdParty('wechat')">
              <i class="icon icon-wechat"></i>
              <p class="icon-text">微信</p>
            </li>
            <li class="list-item" @click="shareThirdParty('weibo')">
              <i class="icon icon-weibo"></i>
              <p class="icon-text">微博</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="activity" v-show="childShow === 2 && !joinSuccess">
        <div class="activity-title">
          <label class="label-text">作品名称：</label>
          <input class="title-input" @blur="inputBlur('title')" v-model="designTitle" placeholder="输入作品名称" />
          <span class="word-limit">{{designTitle.length}}/20</span>
        </div>
        <div class="activity-describe">
          <label class="label-text">作品描述：</label>
          <textarea class="describe-input" @blur="inputBlur('des')" v-model="designDes" placeholder="输入作品描述" ></textarea>
          <span class="word-limit">{{designDes.length}}/40</span>
        </div>
        <div class="activity-choose">
          <p class="title">选择你要参加的活动</p>
          <div class="activity-wrap">
            <p class="no-activity" v-if="activities.length===0">暂时没有可以参与的活动</p>
            <p class="activity-active" v-else @click="listShow=!listShow">{{selectActivityName || '请选择'}}</p>
            <ul class="activity-list" v-show="listShow">
              <li class="list-item" v-for="(a, i) in activities" :class="{'can-join': !a.isDone}" @click="!a.isDone&&selectActivity(a)" :key="i">{{a.activityName}}</li>
            </ul>
          </div>
          <button class="just-join blue-btn" @click="justJoin">立即参加</button>
        </div>
      </div>
      <div class="activity-success" v-show="childShow === 2 && joinSuccess">
        <p class="title">作品分享成功</p>
        <div class="share-link">
          <i class="share-icon"></i>
          <input class="share-url" :value="shareLink"  readonly/>
          <button class="join-copy" @click="copyJoinLink" :data-clipboard-text="shareLink">复制链接</button>
          <a class="open-link blue-btn" :href="shareLink" target="_blank">在网页上打开</a>
        </div>
        <div class="share-other">
          <p>分享到第三方</p>
          <ul class="other-list">
            <li class="list-item" @click="shareThirdParty('qq')">
              <i class="icon icon-qq"></i>
              <p class="icon-text">QQ</p>
            </li>
            <li class="list-item" @click="shareThirdParty('wechat')">
              <i class="icon icon-wechat"></i>
              <p class="icon-text">微信</p>
            </li>
            <li class="list-item" @click="shareThirdParty('weibo')">
              <i class="icon icon-weibo"></i>
              <p class="icon-text">微博</p>
            </li>
          </ul>
        </div>
        <a class="look-join" :href="hasJoined" target="_blank">查看参加的活动</a>
      </div>
    </div>
    <div class="qrcode-page" v-else>
      <span class="weixin-text">打开微信"扫一扫"</span>
      <qrcode :qrcodeurl="wechatLink" size="150"></qrcode>
    </div>
  </modal>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import modal from 'components/modal/modal.vue'
  import qrcode from 'components/qrcode/qrcode'
  import Clipboard from 'clipboard'
  export default {
    props: ['show'],
    data() {
      return {
        childShow: 1,
        designTitle: '',
        designDes: '',
        activities: [],
        selectActivityId: '',
        selectActivityName: '',
        workId: 0,
        listShow: false,
        copyFlag: false,
        qrcodeShow: false,
        joinSuccess: false,
        //qq分享默认图片和描述
        shareImg:'http://eyuankupub.oss-cn-beijing.aliyuncs.com/sys/weixinorcode.png',
        shareSummary:'快来看我在创客贴www.chuangkit.com设计的美图吧！这里有海量免费的素材和模板，只要托拉拽就可以免费在线设计出心仪的图片啦',
        shareContent: '这里有海量免费的素材和模板，只要会用鼠标拖拉拽，就可以用几分钟的时间轻松搞定海报、朋友圈封面、PPT、名片！学生党、微商、运营小编、社交达人们快来和我一起分享你的设计和创意吧！创客贴——设计从未如此简单有趣。',
        ownImg: 'https://imgpub.chuangkit.com/design/2017/09/05/16432551_thumb?1504602201000',
        joinContent: '我参加了本次活动,快来给点赞,我和奖品就差个你了~',
        joinTitle: '创客贴活动',
        activityPost: false
      }
    },
    computed: {
      ...mapGetters({
        shareUrl: 'getShareUrl',
        designInfo: 'getDesignInfo',
        myDesignTitle: 'getDesignTitle'
      }),
      shareLink() {
        if(this.childShow === 1) {
          let designid = this.designInfo.designId;
          return window.location.protocol+'//'+window.location.hostname+'/sharedesign?d=' + designid
        }
        else if(this.childShow === 2) {
          return window.location.origin + '/activecenter/share?workId=' + this.workId;
        }
		  },
      wechatLink() {
        if(this.childShow === 1) {
          let designid = this.designInfo.designId;
          return window.location.protocol+'//'+window.location.hostname+'/mobilesharedesign?d=' + designid
        }
        else if(this.childShow === 2) {
          return window.location.origin + '/activecenter/share?workId=' + this.workId;
        }
      },
      hasJoined() {
        return '/activecenter/active?id=' + this.selectActivityId + '&order=0&pageNo=1'
      },
      titleVerify() {
        return this.verify(this.designTitle);
      },
      desVerify() {
        return this.verify(this.designDes);
      }
    },
    watch: {
      designTitle(v) {
        if(v.length > 20){
          this.designTitle = v.slice(0, 20);
        }
      },
      designDes(v) {
        if(v.length > 20){
          this.designDes = v.slice(0, 40);
        }
      },
      show(v) {
        if(v && !this.activityPost) {
          this.getActivityList();
        }
        if(this.designInfo.iaus === 1) {
          this.copyFlag = false;
        } else if(this.designInfo.iaus === 3) {
          this.copyFlag = true;
        }
      }
    },
    components: { modal, qrcode },
    methods: {
      ...mapActions({
        setMessageShow: 'setMessageShow',
        setShareState: 'setShareState'
      }),
      changeCopyState() {
        let data = {
              d: this.designInfo.designId,
              s: this.copyFlag ? 1 : 3
            };
        this.$http
            .post('/share/updatePublishState', data)
            .then(res => {
              let code = res.body.code
              switch (code) {
                case 0:
                  this.setMessageShow({ placeHolder: '更新分享状态错误！' });
                  break;
                case -2:
                  //说明未登录
                  break;
                case 1:
                  this.copyFlag = !this.copyFlag;
                  this.setShareState(data.s);
                  this.setMessageShow({ placeHolder: '更新分享状态成功！', kind: 'success' });
                  break;
              }
            })
            .catch(error => {
              this.setMessageShow({ placeHolder: '更新分享状态错误！' });
              console.log(error)
            })
      },
      shareThirdParty(type) {
        if(this.childShow === 1) {
          switch(type) {
            case 'qq': 
                let qq = `http://connect.qq.com/widget/shareqq/index.html?url=${this.shareLink}&title=${this.myDesignTitle||'未命名'}&site=www.chuangkit.com&summary=${this.shareSummary}&pics=${this.shareImg}&desc=${this.shareContent}`;
                window.open(qq);
                break;
            case 'wechat':
                this.qrcodeShow = true;
                break;
            case 'weibo':
                let weibo = "http://service.weibo.com/share/share.php?url=" + this.shareLink +
                              "&content=utf-8" + "&title=" + this.shareContent + "&pic=" +
                              this.ownImg+"||"+this.shareImg + "&appkey=3818167868";
                window.open(weibo);
                break;
          }
        }
        else if(this.childShow === 2) {
          switch(type) {
            case 'qq': 
                let qq = `http://connect.qq.com/widget/shareqq/index.html?url=${this.shareLink}&title=${this.joinTitle}&site=www.chuangkit.com&summary=${this.shareSummary}&pics=${this.shareImg}&desc=${this.joinContent}`;
                window.open(qq);
                break;
            case 'wechat':
                this.qrcodeShow = true;
                break;
            case 'weibo':
                let weibo = "http://service.weibo.com/share/share.php?url=" + this.shareLink +
                              "&content=utf-8" + "&title=" + this.joinContent + "&pic=" +
                              this.ownImg+"||"+this.shareImg + "&appkey=3818167868";
                window.open(weibo);
                break;
          }
        }
      },
      closeShare() {
        this.$emit('closeShare');
        this.childShow = 1;
        this.joinSuccess = false;
        this.qrcodeShow = false;
      },
      copyLink() {
        let _this = this,
            clipboard = new Clipboard('.share-copy');
        clipboard.on('success', function(e) {
          e.clearSelection();
          _this.$store.dispatch('setMessageShow', { placeHolder: '复制成功', kind: 'success', });
        });
        clipboard.on('error', function(e) {
          _this.$store.dispatch('setMessageShow', { placeHolder: '复制错误', kind: 'error', });
        });
      },
      copyJoinLink() {
        let _this = this,
            clipboard = new Clipboard('.join-copy');
        clipboard.on('success', function(e) {
          e.clearSelection();
          _this.$store.dispatch('setMessageShow', { placeHolder: '复制成功', kind: 'success', });
        });
        clipboard.on('error', function(e) {
          _this.$store.dispatch('setMessageShow', { placeHolder: '复制错误', kind: 'error', });
        });
      },
      justJoin() {
        let _this = this;
        if(this.activities.length === 0) {
          this.setMessageShow({ placeHolder: '暂时没有可以参与的活动', kind: 'error' });
          return ;
        }

        if (this.designTitle == '') {
          this.setMessageShow({ placeHolder: '请填写作品名称', kind: 'error' });
          return ;
        }
        if (this.designDes == '') {
          this.setMessageShow({ placeHolder: '请填写作品描述', kind: 'error' });
          return;
        }
        if (this.selectActivityId == '') {
          this.setMessageShow({ placeHolder: '请选择要参加的活动', kind: 'error' });
          return;
        }
        if(this.titleVerify) {
          this.setMessageShow({ placeHolder: '作品名称格式有误,请重新输入', kind: 'error'});
          return;
        }
        if(this.desVerify) {
          this.setMessageShow({ placeHolder: '作品描述格式有误,请重新输入', kind: 'error'});
          return;
        }
        this.$http.post('/activity/publishWork', {
          workName: this.designTitle,
          workDesc: this.designDes,
          designId: _this.designInfo.designId,//需要从仓库取出
          aid: this.selectActivityId
        }).then(function(res) {
          //这里还需要对状态码进行判断
          let code = res.body.code
          switch (code) {
            case 0:
              _this.setMessageShow({ placeHolder: '此设计已经参加过该活动', kind: 'error' })
              break;
            case 1:
              _this.setMessageShow({ placeHolder: '恭喜,已成功参与', kind: 'success' })
              _this.joinSuccess = true;
              _this.workId = res.body.workId
              break;
            case 2:
              _this.setMessageShow({ placeHolder: '请输入作品名称和作品描述', kind: 'error' })
              break;
            case 3:
              _this.setMessageShow({ placeHolder: '请先注册/登录', kind: 'error' })
              break;
            case 4:
              _this.setMessageShow({ placeHolder: '作品描述字数超出', kind: 'error' })
              break;

          }
        }).catch(function(error) {
          console.log(error)
        })
      },
      selectActivity(a) {
        this.selectActivityName = a.activityName;
        this.selectActivityId = a.activityId;
        this.listShow = false;
      },
      setChildShow(index) {
        if(this.joinSuccess)
          return;
        this.childShow = index;
      },
      inputBlur(type) {
        if(type === 'title' && this.titleVerify) {
          this.setMessageShow({ placeHolder: '作品名称格式有误,请重新输入', kind: 'error'});
        } else if(type === 'des' && this.desVerify) {
          this.setMessageShow({ placeHolder: '作品描述格式有误,请重新输入', kind: 'error'});
        }
      },
      verify(v) {
        return /[\/\\\:\*\?\"\<\>\|]/g.test(v);
      },
      getActivityList() {
        this.$http
          .post('/activity/list', {
            d: this.designInfo.designId
          })
          .then(res => {
            if(res.body.code === 1) {
              this.activities = res.body.page.recordData
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "publishShare.less";
</style>