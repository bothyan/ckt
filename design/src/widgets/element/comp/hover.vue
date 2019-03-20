<template>
    <g id="rectBox">
        <rect :width="width" :height="height" fill="none" :stroke="stroke" :stroke-width="strokeWidth" :stroke-dasharray="strokeDasharray">
        </rect>
        <rect :width="minWidth" :height="minHeight" :transform="minTransform" fill="rgba(255,255,255,0)" v-show="showMiniRect">
        </rect>
    </g>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
     name:"rect",
    data() {
        return {
            width: 0,
            height: 0,
            stroke: 'rgba(0,0,0,0)',
            strokeWidth: 1,
            strokeDasharray: 2,
            miniTranslate:[-5.5,-5.5],
            showMiniRect:false
        }
    },
    props: {
        json: {
            type: Object,
            required: true
        },
        showHoverBox: {
            type: Boolean,
            default: false,
        },
        eleIndex: {
            type: Number,
            required: true
        },
    },
    computed: {
        ...mapGetters({
            pageScale: "getPageScale",
            focusElemIndex : 'getFocusElemIndex',
            getPageWidth : 'getPageWidth',
            getPageHeight : 'getPageHeight',
            groupFlag: 'getGroupFlag'
        }),
        minWidth() {
            if(this.width < 20) {
                this.showMiniRect = true;
                return 20 / this.pageScale;
            }
            else {
                this.showMiniRect = false;
                return this.width;
            }
        },
        minHeight() {
            if(this.height  < 20) {
                this.showMiniRect = true;
                return 20 / this.pageScale;
            }
            else  {
                this.showMiniRect = false;
                return this.height;
            }
        },
        minTransform() {
            return `translate(${(this.width - this.minWidth)/2}, ${(this.height - this.minHeight)/2})`
        }
    },
    watch: {
        json: {
            handler: function(v) {
                this.update();
            },
            deep: true
        },
        showHoverBox: function(v) {
            if (v) {
                let length = this.getPageHeight>this.getPageWidth?this.getPageWidth:this.getPageHeight; 
                 this.strokeWidth = length/50 *0.1;
                this.strokeDasharray = this.strokeWidth * 2.5;
                if(this.json['lock']=='false'||!this.json['lock']){
                     this.stroke = 'rgba(155,155,155,1)';
                }else{
                    this.stroke ='rgba(255,61,103,1)';
                }
               
            } else {
                this.stroke = 'rgba(0,0,0,0)';
            }
        },
        focusElemIndex:function(v){
            if(v==this.eleIndex){
                if(this.groupFlag) {
                    this.$parent.showHoverBox = true;
                }
                else {
                    this.$parent.showHoverBox = false;
                    this.showMiniRect = false;
                }
            } else {
                this.$parent.showHoverBox = false;
                if(this.width < 20||this.height < 20) {
                    this.showMiniRect = true;
                }
            }
        }
    },
    methods: {
        update() {

            this.width = this.json['width'];
            this.height = this.json['height'];
            
        }
    },
    created() {
        this.update();
    }
}
</script>
