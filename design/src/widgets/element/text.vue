<template>
  <svg ref="text" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
       x="0px" y="0px"
       :width="width" :height="height"
       :viewBox="viewBox"
       v-html="svgContent"
  >
  </svg>
</template>

<script>
  import { getTransformAttr } from 'common/common'
  import elementBus from 'dataBus/element'
  import dataHandle from 'common/dataHandle'
  import pageBus from 'dataBus/page'
  import pageEleBus from 'dataBus/pageEle'
  import editorBus from 'dataBus/editor'
  import toolsBarBus from 'dataBus/toolsBar'
  import textBus from 'dataBus/text'
  import defaultTitle from './defaultTitle.svg'
  import defaultSubTitle from './defaultSubTitle.svg'
  import defaultContent from './defaultContent.svg'
  import webSocket from 'dataBus/webSocket'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'text',
    props: {
      eleData: {
        type: Object,
        required: true
      },
      pageId: {
        require: true
      },
      eleIndex: {
        type: Number
      },
      textLoading: {
        type: Boolean
      }
    },
    data () {
      return {
        svgDom: ``,
        svgContent: '',
        w: 0,
        width: 0,
        height: 0,
        viewBox: '0 0 95.0 22.16',
        textColor: '',
        fontFamily: '',
        align: '',
        fs: '',
        fontSize: '',
        italic: '',
        wspace: '',
        wsp: '',
        vspace: '',
        vsp: '',
        bold: '',
        decoration: '',
        html: null,
        colorLocked: true // 修改颜色的锁
      }
    },
    computed: {
      ...mapGetters({
        designInfo: 'getDesignInfo',
        pageScale: 'getPageScale',
        fontColor: 'getFontColor',
        pageWidth: 'getPageWidth',
        pageHeight: 'getPageHeight',
        focusPageIndex: 'getFocusPageIndex',
        focusElemIndex: 'getFocusElemIndex',
        editorInfo: 'getEditorInfo',
        isLogin: 'getIsLogin',
        logregShow: 'getLogregShow',
        circleSelectElements: 'getCircleSelectElements',
        colorBoardShow: 'getColorBoardShow',
        groupFlag: 'getGroupFlag' // 是否是组合状态
      })
    },
    watch: {
      colorBoardShow (v) {
        if (v) return
        this.colorLocked = false
        this.changeFontColor(this.eleData['data-elem'].fill)
      },
      focusElemIndex (v, ov) {
        if (v == -1 && ov == this.eleIndex) {
          this.colorLocked = false
          this.changeFontColor(this.eleData['data-elem'].fill)
        } else {
          this.colorLocked = true
        }
      },
      eleData: {
        handler (v) {
          let e = v['data-elem']
          this.textColor = e.fill
          this.fontFamily = e['font-family']
          this.align = e['data-align']
          this.italic = e['data-italic']
          this.wspace = ~~e.wspace
          this.wsp = ~~e.wsp
          this.vspace = ~~e.vspace
          this.vsp = ~~e.vsp
          this.bold = e['data-bold']
          this.decoration = e['data-decoration']
          this.html = v.html
          this.w = e.w
          this.width = e.width
          this.height = e.height
          this.fontSize = e['font-size']
          this.fs = e.fs
        },
        deep: true
      },
      textColor (v, ov) { // json 的颜色
        if (ov === '') return
        this.update(1)
      },
      fontFamily (v, ov) {
        if (ov === '') return
        this.update(2)
      },
      align (v, ov) {
        if (ov === '') return
        this.update(3)
      },
      fs (v, ov) {
        if (ov === '' || ov === undefined || v === undefined) return
        this.update(4)
      },
      italic (v, ov) {
        if (ov === '') return
        this.update(5)
      },
      wsp (v, ov) {
        if (ov === '') return
        this.update(6)
      },
      vsp (v, ov) {
        if (ov === '') return
        this.update(7)
      },
      bold (v, ov) {
        if (ov === '') return
        this.update(8)
      },
      decoration (v, ov) {
        if (ov === '') return
        this.update(9)
      },
      html (v, ov) {
        if (this.eleData['data-elem'].needToUpdate) {
          this.update(10)
        } else {
          if (ov === null) return // 会导致编辑状态下切换画布再切回，svg不变
          this.update(10)
        }
      },
      fontColor(v) { // 预览颜色
        if (!this.groupFlag && this.circleSelectElements.indexOf(this.eleIndex) !== -1) {
          this.colorLocked = false;
          this.changeFontColor(v);
        }
        if (this.focusElemIndex != this.eleIndex) return
        this.changeFontColor(v)
      },
      w (v, ov) {
        if (ov === 0 || ov === undefined || v === undefined) return
        this.update(11)
      },
      logregShow (v) {
        if (!v) {
          this.materialToUseful() // 将试用时的文字素材转成登录后可使用的素材
        }
      }
    },
    methods: {
      ...mapActions({
        setLogreg: 'setLogregShow',
        setMessageShow: 'setMessageShow',
        setCurColor: 'setFontColor'
      }),
      // 改变文字 svg 颜色
      changeFontColor (color) {
        if (this.focusElemIndex !== this.eleIndex && this.colorLocked) return
        let paths = this.$refs.text.getElementsByTagName('path'),
          lines = this.$refs.text.getElementsByTagName('line')
        for (let i = 0; i < paths.length; i++) {
          paths[i].attributes.fill.value = color
          if (paths[i].attributes.stroke) {
            paths[i].attributes.stroke.value = color
          }
        }
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].attributes.stroke) {
            lines[i].attributes.stroke.value = color
          }
        }
      },
      // 获取 svg 的 viewBox
      getViewBox (val, ex) {
        this.viewBox = val.substring(val.indexOf('viewBox'), val.indexOf('>')).split('"')[1]
        if (ex) { // 如果是返回的svg
          let splited = this.viewBox.split(' ')
          let width = splited[2],
            height = splited[3]
          let ratio = this.width / this.height
          if (width / height !== ratio) {
            splited[3] = width / ratio
          }
          this.viewBox = splited.join(' ')
        }
      },

      init () {
        this.dataInit()
        this.width = this.eleData['data-elem'].width
        this.height = this.eleData['data-elem'].height

        let path = ''
        if (this.eleData['data-elem'].id) {
          switch (this.eleData['data-elem'].id) { // 默认文字
            case '-1':
              path = defaultTitle
              break
            case '-2':
              path = defaultSubTitle
              break
            case '-3':
              path = defaultContent
              break
          }
          if (path === '') { // 不是默认文字
            this.getMaterialUrlsByIds(this.eleData['data-elem'].id)
            return
          } else {
            this.eleData['data-elem'].id = '' // 重置 id
          }
          // 请求默认文字
          this.$http.get('//' + window.location.host + path).then(res => {
            if (res.status === 200) {
              this.svgDom = res.data
              this.svgContent = this.svgDom.substring(this.svgDom.indexOf('<rect'), this.svgDom.lastIndexOf('</g>'))
              this.getViewBox(this.svgDom)
            }
          })
        } else {
          this.update(13)
        }
      },
      getMaterialUrlsByIds (id) {
        this.$http.post('/material/getMaterialUrlsByIds', {mids: id}).then(res => {
          this.getSvgByUrl(res.body.urls[id])
        })
      },
      getSvgByUrl (v) {
        this.$http.get(v).then(res => {
          this.svgDom = res.data
          this.svgContent = this.svgDom.substring(this.svgDom.indexOf('<rect'), this.svgDom.lastIndexOf('</g>'))
          this.getViewBox(this.svgDom)
        })
      },
      // 获取 json 中的属性值
      dataInit () {
        let e = this.eleData['data-elem']
        e.w = e.width
        e.fs = e['font-size']
        e['data-italic'] = e['data-italic'] ? e['data-italic'] : 'false'
        e['data-bold'] = e['data-bold'] ? e['data-bold'] : 0
        e['data-decoration'] = e['data-decoration'] ? e['data-decoration'] : 'false'
        this.textColor = e.fill
        this.fontFamily = e['font-family']
        this.align = e['data-align']
        this.fontSize = e['font-size']
        this.italic = e['data-italic']
        this.wspace = ~~e.wspace
        this.wsp = ~~e.wspace
        this.vspace = ~~e.vspace
        this.vsp = ~~e.vspace
        this.bold = e['data-bold']
        this.decoration = e['data-decoration']
        this.html = this.eleData.html
        this.fs = e['font-size']
        this.w = e.width
//        textBus.setUpdateFlagByPageId(false, this.pageId, this.eleIndex)
      },
      // JSON 中相关属性改变后发请求
      update (v) {
//        console.log('文字转曲请求来源：'+ v);
        if (~~this.height == 0) {
          return
          pageEleBus.delElement(this.focusPageIndex, this.eleIndex)
        }
        elementBus.setLoading(true, this.pageId, this.eleIndex)
        this.$emit('update:textLoading', true)
        // 请求参数
        let data = {reqtype: 3},
          elem = this.eleData['data-elem']
        data.params = {
          'material_id': ~~(elem.id || elem['data-key'] || ''),
          'c': !!this.designInfo.ic, // 是否是协作设计
          'ffam': elem['font-family'],
          'textData': [],
          'vWidth': this.width,
          'vHeight': this.height,
          'ele_id': this.eleData.eleid,
          'pageId': this.pageId
        }

        this.handleWidthDom(1) // 添加dom

        let sizeScale = 1
        if (this.fontSize * parseFloat(this.pageScale) < 12) {
          sizeScale = 12 / this.fontSize / parseFloat(this.pageScale)
        }

        let span = document.getElementById('testWidth'),
          editorWidth = elem.width * sizeScale,
          splited = [],
          common = { // 通用参数
            ff: this.fontFamily,
            fc: this.textColor,
            fz: this.fontSize,
            tilt: this.isTrue(this.italic) ? 1 : 0,
            word_space: ~~this.wspace,
            bl: this.bold ? this.bold * 100 : 0, // 加粗描边值
            uline: this.isTrue(this.decoration) ? 1 : 0
          }
        // 文字宽度计算初始化
        span.style.fontFamily = this.fontFamily
        span.style.textAlign = this.align
        span.style.width = this.width * sizeScale + 'px'
        //let standardWspace = span.offsetWidth;
        span.style.letterSpacing = this.wspace / 1000 + 'em'
        span.style.fontSize = this.fontSize * sizeScale + 'px'

        // 换行计算
        let htmlEle = this.html.split(''),
          overflowIndex = [] // 需要换行的字符的 index 数组
        span.value = htmlEle[0]
        let text_scroll = span.scrollHeight,
          each_scroll = text_scroll
        span.value = ''
        for (let i = 0; i < htmlEle.length; i++) {
          span.value += htmlEle[i]
          if (Math.round((span.scrollHeight - text_scroll) / each_scroll) >= 1) {
            if (htmlEle[i] === '\n') {
              overflowIndex.push(i)
            }
            else {
              overflowIndex.push(i - 1)
            }
            text_scroll = span.scrollHeight
          }
        }

        if (htmlEle[0] === '\n') {
          overflowIndex.unshift(0)
        }
        if (overflowIndex.length > 0) {
          // 将每行存入数组
          splited.push(htmlEle.slice(0, overflowIndex[0] + 1).join(''))
          for (let i = 1; i < overflowIndex.length; i++) {
            //console.log(splited);
            splited.push(htmlEle.slice(overflowIndex[i - 1] + 1, overflowIndex[i] + 1).join(''))
          }
          splited.push(htmlEle.slice(overflowIndex[overflowIndex.length - 1] + 1).join(''))
        } else {
          splited.push(htmlEle.join(''))
        }

        // 将每行字处理成后端需要的格式
        for (let i = 0; i < splited.length; i++) {
          data.params.textData.push({})
          data.params.textData[i].align = 0
          data.params.textData[i].line_space = 0
          data.params.textData[i].texts = []
          // 每一行
          switch (this.align) {
            case 'left':
              data.params.textData[i].align = 0
              break
            case 'center':
              data.params.textData[i].align = 1
              break
            case 'right':
              data.params.textData[i].align = 2
              break
          }
          data.params.textData[i]['line_space'] = ~~elem.vspace
          let arr = splited[i]
          for (let j = 0; j < arr.length; j++) {
            // 每一个字
            let ob = {}
            ob.text = arr[j]
            Object.assign(ob, common)
            //console.log(ob);
            data.params.textData[i].texts.push(ob)
          }
        }
        for (let i in data.params.textData) {
          if (data.params.textData[i].texts.length == 0)
            data.params.textData.splice(i, 1)
        }

        span = null

        this.handleWidthDom() // 移除dom

        data = JSON.stringify(data)

        webSocket.send(data)
        if (this.paramsEleId != this.eleData.eleid) {
          webSocket.addCallBack(3, this.wsCallBack)
        }
      },
      // webSocket 回调
      wsCallBack (params) {
        this.$emit('update:textLoading', false)
        let code = params.code
        switch (code) {
          case 1:
            if (params.ele_id != this.eleData.eleid) return
            if (pageEleBus.getEleIndexById(params.ele_id, params.pageId) == undefined) return
            this.$nextTick(() => {
              let eleIndex = pageEleBus.getEleIndexById(params.ele_id, params.pageId)
//              let eleIndex = this.eleIndex
              this.paramsEleId = params.ele_id
              this.svgDom = params.svgJson.svg
              this.commitWidthAndHeight(params.svgJson.maxWidth, params.svgJson.maxHeight, eleIndex, params.pageId)
              this.svgContent = this.svgDom.substring(this.svgDom.indexOf('<rect'), this.svgDom.lastIndexOf('</g>'))
              this.getViewBox(this.svgDom)

              textBus.setUpdateFlagByPageId(false, params.pageId, eleIndex)

              // 设置 id
              let mId = elementBus.getMaterialIdByPageId(params.pageId, eleIndex)
              if (!mId || mId != params.material_id) { // 如果不是后台返回的 id
                elementBus.setMaterialIdByPageId(params.material_id + '', params.pageId, eleIndex)
                elementBus.emptyDataElemValue('data-key', params.pageId, eleIndex)

                let mid = {
                  pageId: params.pageId,
                  pageIndex: this.focusPageIndex, // 有 pageId 会忽略 pageIndex
                  eleIndex,
                  key: 'id',
                  value: params.material_id,
                  eventType: 1
                }
                let dataKey = {
                  pageId: params.pageId,
                  pageIndex: this.focusPageIndex, // 有 pageId 会忽略 pageIndex
                  eleIndex,
                  key: 'data-key',
                  value: '',
                  eventType: 1
                }
                dataHandle.commit('element', dataKey)
                dataHandle.commit('element', mid).push(true)
              }
              elementBus.setLoading(false, params.pageId, eleIndex)
            })
            break
          case -1:
            this.setMessageShow({placeHolder: '参数错误'})
            break
          case -2: // 未登录
            this.setMessageShow({placeHolder: '请先登录'})
            this.setLogreg(1)
            break
          case -3:
            this.setMessageShow({placeHolder: 'ffam字体空'})
            break
          case -4:
            this.setMessageShow({placeHolder: '缓存不存在'})
            break
          case -5:
            this.setMessageShow({placeHolder: 'ff字体文字错误'})
            break
          case -6:
            this.setMessageShow({placeHolder: '字体大小错误'})
            break
          case -9:
            this.setMessageShow({placeHolder: '素材不存在'})
            break
          case -11:
            this.setMessageShow({placeHolder: '不是文字素材'})
            break
          case -12:
            this.setMessageShow({placeHolder: '不是团队素材'})
            break
          case -13:
            this.setMessageShow({placeHolder: '素材不存在'})
            break
          case -15:
            this.setMessageShow({placeHolder: '覆盖素材有误'})
            break
          default:
            this.setMessageShow({placeHolder: '文字出错，错误码：' + code})
        }
      },
      materialToUseful () { // 将试用时的文字素材转成登录后可使用的素材
        if (!this.eleData['data-elem'].id) return
        let data = {
          material_ids: this.eleData['data-elem'].id
        }
        this.$http.post('/material/materialToUseful', data).then(res => {
          // -1参数错误；-2未登录；-3参数转化异常；-4废弃表中素材不存在；
          // -5更新素材用户id失败；-6更新废弃素材状态失败；-7获取cookie错误；1操作成功
          switch (res.body.code) {
            case -1:
              this.setMessageShow({placeHolder: '转换素材参数错误'})
              break
            case -2:
              this.setMessageShow({placeHolder: '请先登录'})
              break
            case -3:
              this.setMessageShow({placeHolder: '素材转换参数异常'})
              break
            case -4:
              this.setMessageShow({placeHolder: '废弃表中素材不存在'})
              break
            case -5:
              this.setMessageShow({placeHolder: '更新素材用户id失败'})
              break
            case -6:
              this.setMessageShow({placeHolder: '更新废弃素材状态失败'})
              break
            case -7:
              this.setMessageShow({placeHolder: '转换素材获取cookie错误'})
              break
          }
        })
      },
      commitWidthAndHeight (w, h, eleIndex, pId) {
        elementBus.setHeightByPageId(h, pId, eleIndex)
        elementBus.setWidthByPageId(w, pId, eleIndex)

        let common = {
          pageId: pId,
          pageIndex: this.focusPageIndex, // 有 pageId 会忽略 pageIndex
          eleIndex,
          eventType: 1
        }

        let width = {
          key: 'width',
          value: w
        }
        let height = {
          key: 'height',
          value: h
        }

        let transform = elementBus.getTransformByPageId(pId, eleIndex),
          translate = getTransformAttr(transform, 'translate'),
          rotate = []

        if (transform.indexOf('rotate') >= 0) {
          rotate = getTransformAttr(transform, 'rotate')
        } else {
          rotate = [0, 0, 0]
        }

        rotate[1] = w / 2
        rotate[2] = h / 2

        let trans = `translate(${translate[0]},${translate[1]})rotate(${rotate[0]},${rotate[1]},${rotate[2]})`

        elementBus.setTransformByPageId(trans, pId, eleIndex)

        let transformSave = {
          key: 'transform',
          value: trans
        }

        Object.assign(width, common)
        Object.assign(height, common)
        Object.assign(transformSave, common)

        dataHandle.commit('element', width)
        dataHandle.commit('element', height)
        dataHandle.commit('element', transformSave)
        dataHandle.push(true)
        //不是组合状态，是焦点元素，焦点page
        if (!this.groupFlag && eleIndex === this.focusElemIndex && dataHandle.getPageIndexByPageId(pId) === this.focusPageIndex) {
          editorBus.setEditorState();
        }
      },
      isTrue (v) {
        return v === 'true' || v === true
      },
      handleWidthDom (v) { // 处理衡量文字换行的 dom
        let app = document.getElementById('app')
        if (v) { // 创建
          let textarea = document.createElement('textarea')
          textarea.setAttribute('id', 'testWidth')
          textarea.style['text-decoration'] = 'none'
          textarea.style['word-break'] = 'break-all'
          textarea.style.height = '0px'
          app.appendChild(textarea)
        } else { // 删除
          let textarea = document.getElementById('testWidth')
          app.removeChild(textarea)
        }
      }
    },
    mounted () {
      this.init()
      this.setCurColor(this.eleData['data-elem'].fill)
    }
  }
</script>