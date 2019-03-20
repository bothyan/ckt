

class TextEdit{
	constructor(dom){
		this.$dom=dom
		this._paragraphsCopy=[]
		this._range=null
		this.$edit=null
	}

	render(paragraphs){
		let $frag=document.createDocumentFragment()
		paragraphs.forEach((paragraph,pi)=>{
			let $paragraph=document.createElement('div')
			$paragraph.classList.add('text-edit-line')
			paragraph.forEach((span,si)=>{
				let $span=document.createElement('span')
				$span.classList.add('text-edit-span')
				if(span.hasOwnProperty('add')) $span.classList.add('text-edit-span-new'+span.add)
				$span.setAttribute('data-object',JSON.stringify(span))
				$span.setAttribute('data-index',JSON.stringify({pi,si}))
				let keys=['fontFamily','fontSize','color','italic','underLine','fontWeight']
				keys.forEach(k=>{
					$span.style[k]=span[k]
				})
				switch (true){
					case span.italic&&span.underLine:
						$span.innerHTML=`<em class="text-edit-inner"><u class="text-edit-inner"></u></em>`
						break
					case span.italic:
						$span.innerHTML=`<em class="text-edit-inner"></em>`
						break
					case span.underLine:
						$span.innerHTML=`<u class="text-edit-inner"></u>`
						break
					default:
						$span.innerHTML=`<span class="text-edit-inner"></span>`
						break
				}
				if(/^(&#).*(;$)/.test(span.text)){
					let temp=document.createElement('div')
					temp.innerHTML=span.text
					getChild($span).innerText=temp.innerText
				}else {
					getChild($span).innerText=span.text
				}
				$paragraph.appendChild($span)
			})
			$frag.appendChild($paragraph)
		})
		let nodeList=Array.from(this.$edit.children)
		nodeList.forEach(node=>{
			this.$edit.removeChild(node)
		})
		this.$edit.appendChild($frag)
	}

	initEdit(){
		let {$dom,bindEvent} = this
		let $edit=document.createElement('div')
		$edit.classList.add('text-edit')
		$edit.setAttribute('contenteditable','true')
		$edit.setAttribute('autocorrect','off')
		$edit.setAttribute('autocomplete','off')
		$edit.setAttribute('spellcheck','off')
		bindEvent($edit,this)
		$dom.append($edit)
		this.$edit=$edit
	}

	bindEvent(dom,_this={}) {
		if (!dom.nodeType || dom.nodeType !== 1) return
		dom.addEventListener('input',_this.traversal.bind(_this))
		dom.addEventListener('mouseup',_this.getRange.bind(_this))
		dom.addEventListener('drag',e=>{e.preventDefault()})
	}

	traversal(event){
		let paragraphs=Array.from(event.target.childNodes),paragraphsCopy=[]
		// let reloadFlag=false
		paragraphs.forEach((dom,i)=>{
			let spans=[]
			let paragraph=Array.from(dom.childNodes)
			paragraph.forEach((span,j)=>{
				let text=span.innerText
				if(text!=='&#8203;'&&text.indexOf('&#8203;')>-1){
					text=text.substring(7)
				}
				let json={
					...(JSON.parse(span.getAttribute('data-object'))),
					text
				}
				delete json.add
				spans.push(json)
			})
			paragraphsCopy.push(spans)
		})
		this._paragraphsCopy=paragraphsCopy
		console.log(paragraphsCopy)
	}

	getRange(){
		let selObj=window.getSelection()
		// console.log(selObj)
		if(selObj.type==='Range'){
			let {anchorNode,anchorOffset,focusNode,focusOffset}=selObj
			anchorNode=getParent(anchorNode)
			focusNode=getParent(focusNode)
			let f={
				index:{
					p:getParagraphIndex(anchorNode),
					s:getSpanIndex(anchorNode)
				},
				offset:anchorOffset|0
			}
			let t={
				index:{
					p:getParagraphIndex(focusNode),
					s:getSpanIndex(focusNode)
				},
				offset:focusOffset|0
			}
			let temp=f
			switch (true){
				case f.index.p>t.index.p:
					f=t
					t=temp
					break
				case f.index.p<=t.index.p:
					if(f.index.s>t.index.s){
						f=t
						t=temp
					}
					break
			}
			this._range={f,t}
		}else if(selObj.type==='Caret'){
			let {focusNode,focusOffset,extentNode}=selObj
			if(extentNode.nodeType===3||extentNode.classList.contains('text-edit-inner')){
				extentNode=getParent(extentNode)
				this._range={
					s:{
						index:{
							p:getParagraphIndex(extentNode),
							s:getSpanIndex(extentNode)
						},
						offset:focusOffset|0
					}
				}
			}else {
				this._range = null
			}
		}
	}

	setParagraphStyle(change={}){
		Object.keys(change).forEach(k=>{
			this.$edit.style[k]=change[k]
		})
	}

	setFontStyle(change={}){
		if(this._range===null) return
		if(this._range.hasOwnProperty('s')) {
			this.getRange()
			if(this._range)
				this._setCaretStyle(change,this._range)
		}else {
			this._setRangeStyle(change,this._range)
			this._range=null
		}
	}

	_setCaretStyle(change,range){
		let {s}=range
		let paragraphs=[]
		let time=Date.now()
		this._paragraphsCopy.forEach((paragraph,pi)=>{
			let spans=[]
			if(s.index.p===pi){
				paragraph.forEach((span,si)=>{
					if(s.index.s===si&&span.text==='\n'){
						spans.push({...span,...change,add:time})
					}else if(s.index.s===si&&span.text==='&#8203;'){
						spans.push({...span,...change,add:time})
					}else if(s.index.s===si&&s.offset>0){
						let text1=span.text.substring(0,s.offset)
						let text2=span.text.substring(s.offset)
						if(text2!=='&#8203;'){
							spans.push(
								{...span,text:text1},
								{...span,text:'&#8203;',...change,add:time},
								{...span,text:text2}
							)
						}else {
							spans.push(
								{...span,text:text1},
								{...span,text:'&#8203;',...change,add:time}
							)
						}
					}else if(s.index.s-1===si&&s.offset===0){
						spans.push(
							span,
							{...span,text:'&#8203;',...change,add:time}
						)
					}else {
						spans.push(span)
					}
				})
			}else {
				spans.push(...paragraph)
			}
			paragraphs.push(spans)
		})
		this._paragraphsCopy=paragraphs
		console.log(this._paragraphsCopy)
		this.render(paragraphs)
		let selObj=window.getSelection()
		let r=document.createRange()
		let p=this.$edit.querySelector('.text-edit-span-new'+time)
		r.selectNode(p)
		// r.setStart(getChild(p),0)
		// r.setEnd(getChild(p),1)
		r.collapse()
		console.log(r)
		selObj.removeAllRanges()
		selObj.addRange(r)
		// selObj.selectAllChildren(p)
		// selObj.collapse(p,0)
		p.classList.remove('text-edit-span-new'+time)
	}

	_setRangeStyle(change,range){
		let {f,t}=range
		let paragraphs=[]
		this._paragraphsCopy.forEach((paragraph,pi)=>{
			let spans=[]
			switch (f.index.p<=pi&&t.index.p>=pi){
				case true:
					switch (true){
						//选中的在同一行
						case f.index.p===t.index.p:
							paragraph.forEach((span,si)=>{
								if(f.index.s===t.index.s){
									if(f.index.s===si){
										let text1=span.text.substring(0,f.offset)
										let text2=span.text.substring(f.offset,t.offset)
										let text3=span.text.substring(t.offset)
										if(text1!=='')
											spans.push({...span,text:text1})
										if(text2!=='')
											spans.push({...span,text:text2,...change})
										if(text3!=='')
											spans.push({...span,text:text3})
									}else{
										spans.push(span)
									}
								}else if(t.index.s>f.index.s){
									if(f.index.s===si){
										let text1=span.text.substring(0,f.offset)
										let text2=span.text.substring(f.offset)
										if(text1!=='')
											spans.push({...span,text:text1})
										if(text2!=='')
											spans.push({...span,text:text2,...change})
									}else if(t.index.s===si){
										let text1=span.text.substring(0,t.offset)
										let text2=span.text.substring(t.offset)
										if(text1!=='')
											spans.push({...span,text:text1,...change})
										if(text2!=='')
											spans.push({...span,text:text2})
									}else if(f.index.s<si&&si<t.index.s){
										spans.push({...span,...change})
									}else {
										spans.push(span)
									}
								}
							})
							break
						//选中的不在同一行
						case t.index.p>f.index.p:
							if(f.index.p===pi){
								paragraph.forEach((span,si)=>{
									if(f.index.s===si){
										let text1=span.text.substring(0,f.offset)
										let text2=span.text.substring(f.offset)
										if(text1!=='')
											spans.push({...span,text:text1})
										if(text2!=='')
											spans.push({...span,text:text2,...change})
									}else if(si<f.index.s){
										spans.push(span)
									}else if(si>f.index.s){
										spans.push({...span,...change})
									}
								})
							}else if(t.index.p===pi){
								paragraph.forEach((span,si)=>{
									if(t.index.s===si){
										let text1=span.text.substring(0,t.offset)
										let text2=span.text.substring(t.offset)
										if(text1!=='')
											spans.push({...span,text:text1,...change})
										if(text2!=='')
											spans.push({...span,text:text2})
									}else if(si<t.index.s){
										spans.push({...span,...change})
									}else if(si>t.index.s){
										spans.push(span)
									}
								})
							}else if(f.index.p<pi&&pi<t.index.p){
								paragraph.forEach((span,si)=>{
									spans.push({...span,...change})
								})
							}else {
								spans.push(...paragraph)
							}
							break
					}
					break
				case false:
					spans.push(...paragraph)
					break
			}
			paragraphs.push(spans)
		})
		this._paragraphsCopy=paragraphs
		this.render(paragraphs)
	}


	_setData(data){

	}

	setData(data){
		let paragraphs=[]
		data.paragraphs.forEach(paragraph=>{
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
			paragraphs.push(spans)
		})
		let style={
			textAlign:data['data-align'],
			wordBreak: 'break-all',
			width:data['width']+'px',
			// height:data['height']+'px',
			letterSpacing: parseFloat(data.wspace) / 1000 + 'em',
			lineHeight: 1 + parseFloat(data.vspace) / 1000,
		}
		this._paragraphsCopy=paragraphs
		this.render(paragraphs)
		Object.keys(style).forEach(k=>{
			this.$edit.style[k]=style[k]
		})
	}

}

function getParent(node) {
	if(node.nodeType===1&&node.classList.contains('text-edit-span'))
		return node
	node=node.parentNode
	if(node.classList.contains('text-edit-span')){
		return node
	}else {
		return getParent(node)
	}
}

function getChild(node) {
	if(node.children.length>0){
		node=node.children[0]
		return getChild(node)
	}
	return node
}

function getParagraphIndex($node) {
	let $parent=$node.parentNode
	let list=$parent.parentNode.querySelectorAll('.text-edit-line')
	let index=Array.prototype.indexOf.call(list,$parent)
	return index
}

function getSpanIndex($node) {
	let list=$node.parentNode.querySelectorAll('.text-edit-span')
	let index=Array.prototype.indexOf.call(list,$node)
	return index
}

export default TextEdit