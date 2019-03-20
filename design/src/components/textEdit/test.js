import vue from 'vue'
import texts from './textEdit.vue'
import textEdit from './textEdit'

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
					"html":"\n",
					"font-family": "Microsoft YaHei",
					"fill": "#ffcc00",
					"font-size": '24px',
					"data-decoration": false,
					"data-bold": 20000,
					"data-italic": true,
				}
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
			],
			[
				{
					"html":"第三段",
					"font-family": "Microsoft YaHei",
					"fill": "#ffcc00",
					"font-size": '24px',
					"data-decoration": false,
					"data-bold": 20000,
					"data-italic": true,
				},
				{
					"html":"第三段",
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

const app = new vue({
	el: '#app',
	components:{
		texts
	},
	template:
		`
<div style="width: 800px;height:800px;margin: 80px auto">
	<div ref="dom">
		<!--<texts></texts>-->
	</div>
	<div style="height: 40px;width:100%"></div>
	<button @click="setStyle({color:'#07aefc',fontSize:'32px'})">换颜色</button>
	<button @click="setStyle({color:'#00ffcc',fontSize:'44px'})">换颜色1</button>
	<button @click="setPStyle({textAlign:'left'})">setLeft</button>
	<button @click="setPStyle({textAlign:'center'})">setCenter</button>
	<button @click="setPStyle({textAlign:'right'})">setRight</button>
	<button @click="setPStyle({lineHeight:'40px'})">setLineHeight40</button>
	<button @click="setPStyle({lineHeight:'30px'})">setLineHeight30</button>
	<input type="number" @input="setWidth" value="600">
</div>
	`,
	mounted(){
		this.edit=new textEdit(this.$refs.dom)
		this.edit.initEdit()
		this.edit.setData(testJson)
	},
	methods:{
		setStyle(style){
			this.edit.setFontStyle(style)
		},
		setPStyle(style){
			this.edit.setParagraphStyle(style)
		},
		setWidth(e){
			let w=e.target.value+'px'
			this.edit.setParagraphStyle({width:w})
		}
	},
	data(){
		return{
			edit:null
		}
	}
})