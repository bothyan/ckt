import leftPanel from 'dataBus/leftPanel'
import page from 'dataBus/page'
import dataHandle from 'common/dataHandle'

let {dragElementPreviewImg,dragElementImgInfo}=leftPanel
let {cloneFocusPageToMove,removePageClone}=page

export function elementCtrl(all,_this) {
  let {data,mousePos,elemRect,imgUrl,width,height,$node}=all
  // imgUrl=imgUrl+'@'+width*2+'w.src'
  let $div=document.createElement('div'),
    $img=document.createElement('img'),
    mousemoveFlag=false,
    mousemoveStart=false,
    mouseStartPos=null,
    svgLayoutOldJson=null,
    setSvgFrameFlag=false,
    svgFrameDropFlag = false,
    //解决兼容性问题，safari 意外出发mouseout
    mouseUpFlag=false

  let elWidth,elHeight
  if(elemRect.width<100){
    elWidth=elemRect.width*2.7
    elHeight=elemRect.height*2.7
  }else if(150>elemRect.width&&elemRect.width>100){
    elWidth=elemRect.width*2.5
    elHeight=elemRect.height*2.5
  }else if(elemRect.width>150){
    elWidth=elemRect.width*2.3
    elHeight=elemRect.height*2.3
  }
  if(data['data-elem']){
    data['data-elem'].width=elWidth
    data['data-elem'].height=elHeight
  }
  $div.style.cssText=`position: absolute;width:${elemRect.width}px;height:${elemRect.height}px;z-index:10010;display:none;cursor:move`
  $img.style.cssText=`display:block;width:100%;height:100%;`
  $img.ondragstart=e=>{e.preventDefault(); return false}
  $img.src=imgUrl
  $div.appendChild($img)
  document.body.querySelector('#app').appendChild($div)
  dragElementPreviewImg.setImgUrl(imgUrl)
  dragElementImgInfo={
    width:data['imgWidth'],
    height:data['imgHeight'],
    id:data['id'],
    'data-key':data['data-key']
  }
  page.elementBlur()
  //如果没有传入鼠标的坐标值，说明是触发直接添加到画布
  if(mousePos===null){
    _this.setElementDataReady({t:Date.now(),flag:true})
    return
  }

  window.addEventListener('mousemove',mousemove)
  window.addEventListener('mouseup',mouseup)

  if(data['data-type']==='img'){
    cloneFocusPageToMove((sorbIndex,elementId,evnet)=>{
      $div.style.opacity=0.5
      let pageIndex = dataHandle.vuexGetters().getFocusPageIndex
      let elemIndex =  page.getElementIndexbyId(elementId)
      let elem = dataHandle.getEleJson(pageIndex, elemIndex)
      // getImgInfo
			let reg = new RegExp('xlink:href\=\"\#([^\"]*)\"', 'g');
			reg.test(document.getElementById(evnet.target.parentElement.getAttribute('clip-path').replace('url(#','').replace(')','')).innerHTML);
			let smallNodeBBox = document.getElementById(RegExp.$1).getBBox();
      //当前拖动元素的图片地址（已经加载完）

      let imgHeight = all.width,
        imgWidth = all.height ,
        imgX = 0,
        imgY = 0;
      if (smallNodeBBox.width/ smallNodeBBox.height  <= all.width / all.height) //原图片宽高比例 大于 图片框宽高比例
      {
        imgWidth = smallNodeBBox.height  * (all.width / all.height);
        imgHeight  = smallNodeBBox.height;   //以框的高度为标准
        imgY = smallNodeBBox.y;
        imgX = -( imgWidth - smallNodeBBox.width ) / 2 + smallNodeBBox.x;
      }
      else {   //原图片宽高比例 小于 图片框宽高比例
        imgWidth = smallNodeBBox.width;   //以框的宽度为标准
        imgHeight = smallNodeBBox.width * (all.height / all.width);
        imgX = smallNodeBBox.x;
        imgY = -( imgHeight - smallNodeBBox.height ) / 2  + smallNodeBBox.y;
      }
      let fakeData ={
        ['sorb_'+sorbIndex]:{
          "data-class": "sorb_"+sorbIndex,
          "data-img-key": data['data-elem']['data-key'],
          'imgUrl':imgUrl,
          x: imgX,
          y: imgY,
          width:imgWidth,
          height:imgHeight,
          transform: '',
          id: data['data-elem'].id,
          fromLeft:true,
          drop:false
        }
      }
      svgFrameDropFlag = {
        fakeData: fakeData,
        sorbIndex: sorbIndex,
        svgLayoutOldJson: svgLayoutOldJson,
        elementId: elementId
      }
      svgLayoutOldJson=JSON.stringify(elem['data-elem']['data-xhref-imgs']||{})
      elem['data-elem']['data-xhref-imgs'] = {...JSON.parse(svgLayoutOldJson),...fakeData}
      setSvgFrameFlag= {
        eventType: 1,
        pageIndex,
        eleIndex:elemIndex,
        key: 'data-xhref-imgs',
        value: {...JSON.parse(svgLayoutOldJson), ...fakeData}
      }
    },(sorbIndex,elementId)=>{
      //解决兼容性问题 safari
      if(mouseUpFlag) return
      $div.style.opacity=1
      let pageIndex = dataHandle.vuexGetters().getFocusPageIndex
      let elemIndex =  page.getElementIndexbyId(elementId)
      let elem = dataHandle.getEleJson(pageIndex, elemIndex)
      if(svgLayoutOldJson){
        elem['data-elem']['data-xhref-imgs']=JSON.parse(svgLayoutOldJson)
        svgLayoutOldJson=null
      }
      setSvgFrameFlag=false
    })
  }

  function mousemove(e) {
    $node&&($node.display='none')
    let progress=0
    //差值
    let dv={
      width:elWidth-elemRect.width,
      height:elHeight-elemRect.height
    }
    if(!mousemoveStart){
      mouseStartPos={x:e.clientX,y:e.clientY}
      mousemoveStart=true
    }else{
      progress=((e.clientX-mouseStartPos.x)/(366-mouseStartPos.x))
    }

    let left=0
    let top=0
    let height=0
    let width=0
    //动画
    if(progress>1){
      width=elemRect.width+dv.width
      height=elemRect.height+dv.height
    }else if(progress>0){
      width=elemRect.width+dv.width*progress
      height=elemRect.height+dv.height*progress
    }else {
      width=elemRect.width
      height=elemRect.height
    }
    left=e.clientX-mousePos.x/elemRect.width*width
    top=e.clientY-mousePos.y/elemRect.height*height
    $div.style.display='block'
    $div.style.top=top+'px'
    $div.style.left=left+'px'
    $div.style.width=width+'px'
    $div.style.height=height+'px'
    if(e.clientX-mousePos.cx>5||e.clientY-mousePos.cy>5){
      mousemoveFlag=true
    }
  }

  function mouseup(e) {
    window.removeEventListener('mousemove',mousemove)
    window.removeEventListener('mouseup',mouseup)
    mouseUpFlag=true
    if(data['data-type']==='img') removePageClone()
    if(setSvgFrameFlag){
      let json=JSON.parse(JSON.stringify(setSvgFrameFlag))
      let pageIndex = dataHandle.vuexGetters().getFocusPageIndex
      let elemIndex = page.getElementIndexbyId(svgFrameDropFlag.elementId)
      let elem = dataHandle.getEleJson(pageIndex, elemIndex)
      let fakeData = JSON.parse(JSON.stringify(svgFrameDropFlag.fakeData));
      fakeData['sorb_' + svgFrameDropFlag.sorbIndex].drop = true;
      let oldData = JSON.parse(JSON.stringify(elem['data-elem']['data-xhref-imgs'] ));
      Object.assign(oldData,fakeData);
      elem['data-elem']['data-xhref-imgs'] = oldData;

      for (let i in json.value){
        let v = json.value[i];
        delete v.EditorImg;
        delete v.imgUrl;
        delete v.fromLeft;
      }

      dataHandle.commit('element',json).push()
    }
    if(svgLayoutOldJson===null){
      let {left,top,right,bottom}=_this.getPageRect
      if(e.clientX>366&&e.clientX>=left&&e.clientX<=right&&e.clientY>=top&&e.clientY<=bottom){
        _this.setElementData({data,imgUrl,elemPos:{
          top:e.clientY-top-mousePos.y/elemRect.height*(mousemoveFlag?elHeight:elemRect.height),
          left:e.clientX-left-mousePos.x/elemRect.width*(mousemoveFlag?elWidth:elemRect.width),
        },width:elWidth,height:elHeight,disable:true})
        _this.setElementDataReady({t:Date.now(),flag:true})
        $div.remove()
        $node&&($node.display='block')
      }else if(!mousemoveFlag){
        _this.setElementData({data,imgUrl,
          width:elWidth,height:elHeight,disable:true,animation:true})
        _this.setElementDataReady({t:Date.now(),flag:true})
        $div.remove()
        $node&&($node.display='block')
      }else {
        _this.setElementDataReady({t:Date.now(),flag:false})
        $div.style.transition='all .2s ease'
        $div.style.top=mouseStartPos.y-mousePos.y+'px'
        $div.style.left=mouseStartPos.x-mousePos.x+'px'
        $div.style.width=elemRect.width+'px'
        $div.style.height=elemRect.height+'px'
        setTimeout(()=>{
          $div.remove()
          $node&&($node.display='block')
        },200)
      }
    }else {
      $div.remove()
      $node&&($node.display='block')
    }
  }
}