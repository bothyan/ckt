<template>
  <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 
    :viewBox="viewBox" 
    :width="width" 
    :height="height" 
    :filter="imgFilter"
    v-html="svgContext"
    ref="svgNode">
      
  </svg>
</template>

<script>
import leftPanel from "dataBus/leftPanel";
import g_config from "config/global_config";
import { mapActions, mapGetters } from "vuex";
import { _empty, formatSvg, inArray } from "common/common";
import svgFrameBus from "dataBus/svgFrame";
import eleEvent from "dataBus/element";
import editorBus from "dataBus/editor.js";
import toolsBarBus from "dataBus/toolsBar.js";
export default {
  name: "svgFrame",
  props: {
    json: {
      type: Object,
      required: true
    },
    // svg在素材数组中的下标
    eleIndex: {
      type: Number,
      required: true
    },
    pageId: {
      require: true
    },
    imgFilterId: {
      type: String
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      thumbUrl: "",
      viewBox: "0 0 0 0",
      originViewBox: "0 0 0 0",
      // 直接请求回来的svg，未经过处理
      svgDom: "",
      colors: {},
      vary: {},
      sorbs: {},
      AllSorbs: {},
      imgFilter: "",
      version: "1.0.1",
      tempUrl: "",
      loadingKeyArr: {}
    };
  },
  watch: {
    imgFilterId: function(v) {
      this.imgFilter = "url(#" + v + ")";
    },
    json: {
      handler: function(v) {
        // console.log("update触发了")
        this.update(v);
      },
      deep: true
    },
    viewBox: function(v) {
      //防止撤销时候viewbox变成0，0，0，0问题
      if (v == "0 0 0 0") {
        this.viewBox = this.originViewBox;
      }
    },
    vary: {
      handler: function(val, oldVal) {
        // 如果oldVal为undefined说明是初始化，相等说明此次此值没有变化
        //if(oldVal == undefined || val === oldVal) return;
        // DOM 更新了
        for (let i in val) {
          //处理变形
          // if(val[i]){
          //   let eles =  this.$el.querySelectorAll(`#${i} .cut`)||[];
          //   eles.forEach((ele)=>{
          //     ele.setAttribute('transform', val[i])
          //   })
          // }
          if (val[i]) {
            let el = this.$el.querySelector("#" + i);
            if (el) {
              el.querySelector("#" + i).setAttribute("transform", val[i]);
            }
          }
        }
      },
      deep: true
    },
    colors: {
      handler: function(val) {
        if (val != undefined) {
          //  console.log('ssss')

          let colorStr = "";
          //查找颜色节点替换颜色
          for (let i in val) {
            let color_eles = this.$el.querySelectorAll("." + i);

            for (let j = 0; j < color_eles.length; j++) {
              color_eles[j].setAttribute("fill", val[i]);
            }
          }
        }
      },
      deep: true
    },
    sorbs: {
      handler: function(val, oldVal) {
        if (val != undefined) {
          let tempAllSorb = this.updateSorbs();
          //let tempAllSorb = JSON.stringify(this.AllSorbs);
          // console.log(tempAllSorb)
          //  Object.assign(this.AllSorbs,val);
          for (let n in val) {
            tempAllSorb[n] = val[n];
          }
          for (let i in tempAllSorb) {
            if (tempAllSorb[i]["data-class"] == "zhiyuan") {
              this.emptySorb(i, tempAllSorb[i]);
            } else {
              if (oldVal[i] != undefined) {
                let comR = this.compareVal(tempAllSorb[i], oldVal[i]);
                this.setSorbVal(i, tempAllSorb[i], comR);
              } else {
                this.setSorbVal(i, tempAllSorb[i], true);
              }
            }
          }
          //this.AllSorbs = JSON.parse(tempAllSorb);
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      focusPageIndex: "getFocusPageIndex",
      focusElemIndex: "getFocusElemIndex",
      designInfo: "getDesignInfo"
    }),

    // 处理后svg标签
    svgContext() {
      if (this.svgDom.indexOf("svg") > -1) {
        return this.svgDom.substring(
          this.svgDom.indexOf(">") + 1,
          this.svgDom.lastIndexOf("<")
        );
      }
      return this.svgDom;
    }
  },
  methods: {
    update(json) {
      // 数据更新
      this.width = json.width;
      this.height = json.height;
      this.viewBox = json.viewBox;
      this.colors = json["data-colors"];
      this.sorbs = json["data-xhref-imgs"];
      this.vary = json["vary"];
    },
    init() {
      this.width = this.json.width;
      this.height = this.json.height;
      this.viewBox = this.json.viewBox;
      // this.colors = this.json['data-colors'];
      if (this.thumbUrl != "") {
        this.svgDom = `<image xlink:href='${this
          .thumbUrl}' x='0' y='0' width='${this.width}' height='${this
          .height}'/>`;
        this.viewBox = `0 0 ${this.width} ${this.height}`;
      }
      eleEvent.setLoading(true, this.pageId, this.eleIndex);
      if (
        this.json["data-key"] != undefined &&
        this.json["data-key"] != "false"
      ) {
        this.loadResource(this.json["data-key"], 2, data => {
          this.svgDom = formatSvg(data["data"]);
          this.initSvgFrame();
        });
      } else {
        this.loadResource(this.json["id"], 1, data => {
          //使用id加载
          this.svgDom = formatSvg(data["urls"][this.json["id"]]);
          this.initSvgFrame();
        });
      }
    },
    //初始化Svgframe基本属性
    initSvgFrame() {
      this.$nextTick(() => {
        //初始化颜色信息
        // 设置颜色
        if (this.json["data-colors"] == false) {
          // json中没有值
          this.initColors();
        } else {
          // json中有值
          this.colors = this.json["data-colors"];
        }

        //暂且屏蔽掉svgfram变形
        // this.initVaryType();
        // if(this.json['vary']!=false){
        //   this.vary = this.json['vary'];
        // }else{
        //   this.initVary();
        // }
        //初始化viewBox
        this.initViewBox();

        this.updateSorbs();
        this.initSorbOriginValue();
        this.sorbs = this.json["data-xhref-imgs"];
        if (this.focusElemIndex != -1 && this.focusElemIndex == this.eleIndex) {
          editorBus.setEditorState();
          toolsBarBus.setToolsBarState();
        }

        eleEvent.setLoading(false, this.pageId, this.eleIndex);
      });
    },
    //初始化 varytype
    initVaryType() {
      let root_g = this.$el.querySelector("g");
      let varyType = "db";
      if (root_g.id) {
        varyType = root_g.id;
      }
      this.$parent.elemVaryType = root_g.id;
      svgFrameBus.setVaryType(this.pageId, this.eleIndex, root_g.id);
    },
    // 初始化拉伸
    initVary() {
      let root_g = this.$el.querySelector("g"),
        child_gs = root_g.querySelectorAll("g"),
        child_count = 0, //统计子节点个数用于判断是否有子节点
        vary = {};

      if (child_gs.length > 0) {
        // 判断子元素有没有变形操作
        for (let i = 0; i < child_gs.length; i++) {
          if (child_gs[i].id) {
            vary[child_gs[i].id] = child_gs[i].getAttribute("transform") || "";
            child_count++;
          }
        }
      }
      // 'ry'情况
      if (child_count == 0) {
        let val = root_g.getAttribute("transform") || "";
        //  if(root_g.getAttribute('id')){
        //     vary[root_g.getAttribute('id')] = val;
        //   }else{

        //     console.warn(`素材${this.dataKey||this.mid}有问题`)
        //   }
      }

      svgFrameBus.setVary(vary, this.pageId, this.eleIndex);
    },
    initColors() {
      let colors = {};
      for (let i = 1; true; i++) {
        if (this.$el.querySelectorAll(".color-" + i).length == 0) {
          break;
        }
        colors["color-" + i] = this.$el
          .querySelector(".color-" + i)
          .getAttribute("fill");
      }
      svgFrameBus.setColors(colors, this.pageId, this.eleIndex);
    },
    //初始化viewBox信息
    initViewBox() {
      if (this.json["viewBox"] != "0 0 0 0") {
        this.viewBox = this.json["viewBox"];
        return;
      }
      let domStr = this.svgDom.substring(
        this.svgDom.indexOf("viewBox"),
        this.svgDom.indexOf(">")
      );
      let viewBoxFinded = domStr.match(/viewBox=\"(.*?)\"/) || [];
      if (viewBoxFinded.length > 1) {
        this.viewBox = viewBoxFinded[1];
        this.originViewBox = viewBoxFinded[1];
        svgFrameBus.setViewBox(viewBoxFinded[1], this.pageId, this.eleIndex);
      }
    },
    initSorbOriginValue() {
      let imgs = this.$el.querySelectorAll("image");
      for (let i = 0; i < imgs.length; i++) {
        let v = imgs[i];
        let width = v.getAttribute("width") || 100;
        let height = v.getAttribute("height") || 100;
        let transform = v.getAttribute("transform") || "";
        let x = v.getAttribute("x") || 0;
        let y = v.getAttribute("y") || 0;
        v.setAttribute("old-width", width);
        v.setAttribute("old-height", height);
        v.setAttribute("old-x", x);
        v.setAttribute("old-y", y);
        v.setAttribute("old-transform", transform);
      }
    },
    updateSorbs() {
      let imgs = this.$el.querySelectorAll("image");
      for (let i = 0; i < imgs.length; i++) {
        let v = imgs[i];
        let className = v.getAttribute("class");
        let width = v.getAttribute("width") || 100;
        let height = v.getAttribute("height") || 100;
        let transform = v.getAttribute("transform") || "";
        let allSorbs = {};
        allSorbs[className] = {
          "data-class": "zhiyuan",
          "data-img-key": "false",
          x: 0,
          y: 0,
          width: width,
          height: height,
          transform: transform,
          id: ""
        };

        return allSorbs;
      }
    },
    //对比是不是因为图改变引起的刷新
    compareVal(val, oldVal) {
      if (val.id != oldVal.id) {
        return true;
      }
      if (val["data-img-key"] != oldVal["data-img-key"]) {
        return true;
      }
      if (val["data-key"] != oldVal["data-key"]) {
        return true;
      }
      if (val.drop != oldVal.drop) {
        return true;
      }
      return false;
    },
    //加载资源
    loadResource(val, type, callback, w = 800) {
      if (val == undefined || val == "false") return;
      if (type == 1) {
        //通过ID取素材的  /material/getMaterialUrlsByIds.do
        this.$http
          .post("/material/getMaterialUrlsByIds", { mids: val, w: w })
          .then(
            response => {
              if (!response["body"]["code"]) {
                //  this.svgDom = formatSvg(response['body']['urls'][val['id']]);
                // this.initSvgData();
                callback(response["body"]);
              } else {
                //z拿不到图像
                console.warn(
                  `ID为 %c「${val}」%c 的素材未能成功加载|原因是 %c「${response["body"][
                    "code"
                  ]}」%c(-1参数有误;-2未登录;-3权限不足)`,
                  "color:#fff;background:red",
                  "color:black",
                  "color:red",
                  ""
                );
              }
            },
            error => {
              console.error(new Error(error));
            }
          );
      } else {
        this.$http
          .get("//" + this.designInfo.imgHost + "/materials/" + val)
          .then(
            response => {
              if (response.status == 200) {
                callback(response);
              } else {
                console.warn(
                  `data-key为 %c「${this.json[
                    "data-key"
                  ]}」%c 的素材未能成功加载|原因是 %c「${response["body"][
                    "code"
                  ]}」%c(-1参数有误;-2未登录;-3权限不足)`,
                  "color:#fff;background:red",
                  "color:black",
                  "color:red",
                  ""
                );
              }
            },
            error => {
              console.error(new Error(error));
            }
          );
      }
    },
    //通过dataKEy加载图片
    loadImgWithDataKey(dataKey, data, sorb_id, loadType = "small") {
      let imgUrl =
        "//" +
        this.designInfo.imgHost +
        "/materials/" +
        dataKey +
        "@0e_800w_800h_0c_0i_0o_1x.png";
      let imgUrlMini =
        "//" +
        this.designInfo.imgHost +
        "/materials/" +
        dataKey +
        "@0e_150w_150h_0c_0i_0o_1x.png";
      let _this = this;
      if (loadType != "big") {
        this.setData(data, imgUrlMini, sorb_id);
      }

      let img = new Image();
      img.src = imgUrl;
      img.onload = function() {
        _this.setData(data, imgUrl, sorb_id);
      };
      img.onerror = function(params) {
        // alert("图片加载失败");
      };
    },
    //设置节点内容
    setSorbVal(sorb_id, data, isImgChange = false) {
      let tempImg = svgFrameBus.getTempImgUrl(
        sorb_id,
        this.focusPageIndex,
        this.eleIndex
      );
      svgFrameBus.removeTempImgUrl(sorb_id, this.focusPageIndex, this.eleIndex);
      //只加载大图的标识
      let onlyLoadBig = false;
      //判断有没有图片的更改没有则不需要重设图片地址

      if (!isImgChange) {
        this.setData(data, undefined, sorb_id);
        return;
      }
      //从画布拖放时候图片的地址
      if (tempImg) {
        //直接加载大图
        if (tempImg.indexOf("800w") > -1) {
          //已经是大图
          this.setData(data, tempImg, sorb_id);
          return;
        }
        this.setData(data, tempImg, sorb_id);
        onlyLoadBig = true;
      }
      //从左边拖入缩略图地址
      if (data.fromLeft) {
        this.setData(data, data["imgUrl"], sorb_id);
        if(data.drop==false){
          return;
        }
        onlyLoadBig = true;
      }

      let loadType = onlyLoadBig ? "big" : "small";

      if (
        data["data-img-key"] != undefined &&
        data["data-img-key"] != "false"
      ) {
        this.loadImgWithDataKey(data["data-img-key"], data, sorb_id, loadType);
      } else if (data["data-key"] != undefined && data["data-key"] != "false") {
        this.loadImgWithDataKey(data["data-key"], data, sorb_id, loadType);
      } else {
        // console.log("id通道")
        if (data["id"] != undefined) {
          //先加载小图
          let _this = this;
          //左侧拖进来的不需要加载缩略图
          if (data.fromLeft) {
            onlyLoadBig = true;
          }
          if (!onlyLoadBig) {
            this.loadResource(
              data["id"],
              1,
              response => {
                let imgUrl = response.urls[data.id];
                this.setData(data, imgUrl, sorb_id);
              },
              150
            );
          }
          //再加载大图
          this.loadResource(data["id"], 1, response => {
            let imgUrl = response.urls[data.id];
            let img = new Image();
            img.src = imgUrl;
            let _this = this;
            img.onload = function() {
              _this.setData(data, imgUrl, sorb_id);
            };
          });
        }
      }
    },
    setData(data, imgUrl, sorb_id) {
      if (
        data["x"] == undefined ||
        data["y"] == undefined ||
        data["width"] == undefined ||
        data["height"] == undefined
      ) {
        return;
      }
      let eleDom = this.$el.querySelector("." + sorb_id);
      if (!eleDom) return;
      if (imgUrl != undefined) {
        eleDom.setAttribute("xlink:href", imgUrl);
      }
      eleDom.setAttribute("x", data["x"]);
      eleDom.setAttribute("y", data["y"]);
      eleDom.setAttribute("transform", data["transform"] || "");
      eleDom.setAttribute("width", data["width"]);
      eleDom.setAttribute("height", data["height"]);
    },
    //设置空的时候的svg填充
    emptySorb(sorb_id, data) {
      let eleDom = this.$el.querySelector("." + sorb_id);
      if (!eleDom) return;
      
      let imgUrl = "http://eyuankupub.oss-cn-beijing.aliyuncs.com/sys/pic.png";
      eleDom.setAttribute("xlink:href", imgUrl);
      eleDom.setAttribute("x", eleDom.getAttribute("old-x"));
      eleDom.setAttribute("y", eleDom.getAttribute("old-y"));

      eleDom.setAttribute("transform", eleDom.getAttribute("old-transform"));
      eleDom.setAttribute("width", eleDom.getAttribute("old-width"));
      eleDom.setAttribute("height", eleDom.getAttribute("old-height"));
    }
  },
  created() {
    //设置缩略图的地址
    let thumbImg = leftPanel.dragElementPreviewImg.getImgUrl();
    if (thumbImg != "") {
      this.thumbUrl = thumbImg;
      //重新置空图片地址
      leftPanel.dragElementPreviewImg.setImgUrl("");
    }
    this.init();
  }
};
</script>