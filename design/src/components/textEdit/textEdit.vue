<template>
  <div class="text-edit" contenteditable="true"
       autocorrect="off" autocomplete="off"
       spellcheck="false" @mouseup="textSelect"
       :style="style" @input="textChange"
       @keydown.p.stop.enter="enterDown"
       @keydown.stop.delete="deleteDown"
       @keydown.stop="keyDown"
       @blur.stop="blurFunc"
  >
    <div class="text-edit-line" v-for="(paragraph,pi) in paragraphsCopy" :key="'p-'+pi">
      <span
        class="text-edit-span"
        v-for="(span,si) in paragraph" :key="si"
        :style="{fontFamily:span.fontFamily,fontSize:span.fontSize,color:span.color,fontWeight:span.fontWeight}"
        :data-index="si" :data-text="span.text" :data-object="JSON.stringify(span)"
        @drag.prevent.stop="()=>{}"
      >
        <em v-if="span.italic&&span.underLine">
          <u>{{span.text}}</u>
        </em>
        <em v-else-if="span.italic">{{span.text}}</em>
        <u v-else-if="span.underLine">{{span.text}}</u>
        <span v-else>{{span.text}}</span>
      </span>
    </div>
  </div>
</template>
<script>
	let j={
		text:'',
		fontFamily:'',
		fontSize:'',
		color:'',
		italic:true, //斜体
		underLine:true, //下划线
	}
	const testJson={
		"opacity": 1,
		"shadow": {
			"blur": 30,
			"offset": 50,
			"opacity": 0.25,
			"show": false
		},
		"width": 600,
		"w": 692.5140968306436,
		"height": 80,
		"fs": 46.6653704063776,
		"wspace": "0",
		"wsp": "0",
		"data-align": "center",
		"vspace": "200",
		"vsp": "200",
		"material_id": "-1",
		"lock": false,
		"paragraphs":
			[
				[
					{
						"html":"第一段",
						"font-family": "Microsoft YaHei",
						"fill": "#ff00cc",
						"font-size": '18px',
						"data-decoration": true,
						"data-bold": 0,
						"data-italic": true,
					},
					{
						"html":"第一段",
						"font-family": "Microsoft YaHei",
						"fill": "#00ffcc",
						"font-size": '24px',
						"data-decoration": false,
						"data-bold": 20000,
						"data-italic": false,
					},
					{
						"html":"第一段",
						"font-family": "Microsoft YaHei",
						"fill": "#00ccff",
						"font-size": '24px',
						"data-decoration": true,
						"data-bold": 20000,
						"data-italic": true,
					},
					{
						"html":"第一段",
						"font-family": "Microsoft YaHei",
						"fill": "#ffcc00",
						"font-size": '24px',
						"data-decoration": false,
						"data-bold": 20000,
						"data-italic": true,
					},
					{
						"html":"第一段",
						"font-family": "Microsoft YaHei",
						"fill": "#00ccff",
						"font-size": '24px',
						"data-decoration": true,
						"data-bold": 20000,
						"data-italic": true,
					},
				],
				[
					{
						"html":"第二段",
						"font-family": "Microsoft YaHei",
						"fill": "#ffcc00",
						"font-size": '24px',
						"data-decoration": false,
						"data-bold": 20000,
						"data-italic": true,
					},
					{
						"html":"第二段",
						"font-family": "Microsoft YaHei",
						"fill": "#00ccff",
						"font-size": '24px',
						"data-decoration": true,
						"data-bold": 20000,
						"data-italic": true,
					},
				]
			]
	}
	export default {
		name:'text-edit',
		data(){
			return{
				paragraphsCopy:[],
				textInCopy:[],
				range:{},
				compareFunc:null
			}
		},
		methods:{
			textSelect(){
				let selObj=window.getSelection()
				if(selObj.type==='Range'){
					let {anchorNode,anchorOffset,focusNode,focusOffset}=selObj
					anchorNode=getParent(anchorNode)
					focusNode=getParent(focusNode)
					let f={index:anchorNode.getAttribute('data-index')|0,offset:anchorOffset|0}
					let t={index:focusNode.getAttribute('data-index')|0,offset:focusOffset|0}
					if(f.index>t.index){
						let temp=f
						f=t
						t=temp
					}
					this.range={f,t}
				}
			},
			enterDown(){
				let selObj=window.getSelection()
				if(selObj.type==='Caret'){
					let node=selObj.focusNode
					let offset=selObj.focusOffset
					console.log(offset)
					this.setTextInTextArr()
//          node=getParent(node)
//          let index=node.getAttribute('data-index')|0
//          let textObj=this.paragraphsCopy[index]
//          let text1=textObj.text.substring(0,offset)
//          let text2=textObj.text.substring(offset)
//          switch (true){
//            case offset===0:
//              this.paragraphsCopy.splice(index-1,0,{text:'\n'})
//            	break
//            case offset===textObj.text.length:
//	            this.paragraphsCopy.splice(index+1,0,{text:'\n'})
//            	break
//            case offset>0&&offset<textObj.text.length:
//	            this.paragraphsCopy.splice(index,1,{...textObj,text:text1},{text:'\n'},{...textObj,text:text2})
//            	break
//          }
//          console.log(selObj)
//	        this.setTextInTextArr()
				}
			},
			deleteDown(event){
				let selObj=window.getSelection()
				if(selObj.type==='Caret'){
					let node=selObj.focusNode
					let offset=selObj.focusOffset
				}
			},
			keyDown(){
				let selObj=window.getSelection()
				if(selObj.type==='Caret'){
					let node=selObj.focusNode
					let offset=selObj.focusOffset
					console.log(offset)
				}
			},
			blurFunc(){
				this.setTextInTextArr()
			},
			textChange(e){
				let paragraphs=Array.from(e.target.childNodes),paragraphsCopy=[]
				paragraphs.forEach((dom,i)=>{
					let spans=[]
					let paragraph=Array.from(dom.childNodes)
					paragraph.forEach((span,j)=>{
						spans.push({
							...(JSON.parse(span.getAttribute('data-object'))),
							text:span.innerText
						})
					})
					paragraphsCopy.push(spans)
				})
				this.paragraphsCopy=paragraphsCopy
			},
			setTextInTextArr(){
				let textArr = []
				this.paragraphsCopy.forEach(paragraph=> {
					let arr=[]
					paragraph.forEach(t=>{
						arr.push(t.text)
					})
					textArr.push(arr)
				})
				this.textInCopy = textArr
			},
			setRangeText(change={}){
				let arr=[],{f,t}=JSON.parse(JSON.stringify(this.range))
				// 清除选中
				let selection = window.getSelection()
				selection.removeAllRanges()
				this.paragraphsCopy.forEach((text,index)=>{
					let text1=text.text.substring(0,f.offset)
					let text2=text.text.substring(f.offset,t.offset)
					let text3=text.text.substring(t.offset)
					switch (f.index===t.index){
						case true:
							if(f.index===index){
								if(text1!=='')
									arr.push({...text,text:text1})
								if(text2!=='')
									arr.push({...text,text:text2,...change})
								if(text3!=='')
									arr.push({...text,text:text3})
							}else {
								arr.push(text)
							}
							break
						case false:
							if(f.index===index){
								let text1=text.text.substring(0,f.offset)
								let text2=text.text.substring(f.offset)
								if(text1!=='')
									arr.push({...text,text:text1})
								if(text2!=='')
									arr.push({...text,text:text2,...change})
							}else if(t.index===index){
								let text1=text.text.substring(0,t.offset)
								let text2=text.text.substring(t.offset)
								if(text1!=='')
									arr.push({...text,text:text1,...change})
								if(text2!=='')
									arr.push({...text,text:text2})
							}else if(f.index<index&&index<t.index){
								arr.push({...text,...change})
							}else{
								arr.push(text)
							}
							break
					}
				})
				arr=testTexts(arr)
				this.paragraphsCopy=arr
				this.setTextInTextArr()
			}
		},
		props:{

		},
		computed:{
			paragraphs(){
				let arr=[],textArr=[]
				testJson.paragraphs.forEach(paragraph=>{
					let spans=[]
					paragraph.forEach(span=>{
						spans.push({
							text:span["html"],
							fontFamily:span["font-family"],
							fontSize:span["font-size"],
							color:span["fill"],
							italic:span["data-italic"], //斜体
							underLine:span["data-decoration"], //下划线
							fontWeight:span["data-bold"]
						})
					})
					arr.push(spans)
				})
				this.paragraphsCopy=arr
//				this.setTextInTextArr()
				return arr
			},
			style(){
				return {
					textAlign:testJson['data-align'],
					wordBreak: 'break-all',
					width:testJson['width']+'px',
					height:testJson['height']+'px',
					letterSpacing: parseFloat(testJson.wspace) / 1000 + 'em',
					lineHeight: 1 + parseFloat(testJson.vspace) / 1000,
				}
			},

		},
		watch:{
			range(){
//				this.setRangeText({color:'#00ccff'})
			},
			paragraphsCopy: {
				deep:true,
				handler(){
//					let textArr = []
//					this.paragraphsCopy.forEach(t => {
//						textArr.push(t.text)
//					})
//					this.textInCopy = textArr
				},
			}
		},
		beforeUpdate(){
			if(typeof this.compareFunc === 'function')
				this.compareFunc(JSON.stringify(this.paragraphsCopy),value=>{
//					this.setTextInTextArr()
					console.log('更新',value)
				})
		},
		mounted(){
			this.paragraphsCopy=this.paragraphs
			this.setTextInTextArr()
			this.compareFunc=compare()
		}
	}

	function compare(value=null) {
		let oldValue=value

		return (value,func)=>{
			console.log(oldValue==value)
			if(value!==oldValue){
				func(value)
				oldValue=value
			}
		}
	}

	function getParent(node) {
		node=node.parentNode
		if(node.classList.contains('text-edit-span')){
			return node
		}else {
			return getParent(node)
		}
	}

	/**
	 * 整理数组，将样式相同的文字合并
	 * @param texts
	 * @return {Array}
	 */
	function testTexts(texts) {
		let keys=['fontFamily','fontSize','color','italic','underLine','fontWeight'],
			arr=[],obj={}

		texts.forEach(text=>{
			let j=JSON.parse(JSON.stringify(text))
			let flag=true
			keys.forEach(k=>{
				if(obj[k]===undefined||obj[k]!==j[k]){
					flag=false
				}
			})
			if(flag){
				let txt=(obj.text!==undefined?obj.text:'')+text.text
				console.log(obj.text,text.text,txt)
				obj={...text,text:txt}
				arr.pop()
				arr.push(obj)
			}else {
				obj=JSON.parse(JSON.stringify(text))
				arr.push(text)
			}
		})
		return arr
	}
</script>
<style lang="less" >
  .text-edit{
    &:focus{
      outline: 1px dashed rgb(155, 155, 155);
    }
  }
</style>
