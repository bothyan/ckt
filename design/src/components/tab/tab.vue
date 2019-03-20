<template>
    <div class="tabs-content" v-if='flag'>
        <div class="top">
            <div class="title">{{navtitle}}</div>
            <ul class="nav nav-tabs">
                <li v-for='(nav,navindex) in navdata' class="nav-li"  @click='keyShowFun(navindex)' :key="nav.list">
                  <!--   <p v-bind:style="tabStyle" :class='{active:nav.showFlag>=0}'>{{ nav.list }}</p> -->
                  <p :class='{designcopy:isTwo,othersum:!isTwo,active:nav.showFlag>=0}'>{{ nav.list }}</p>
                </li>
            </ul>
        </div>
        <div class="v-tabs-item">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        flag: {
            type: Boolean,
            required: true,
            twoWay: true
        },
        navtitle: {
            type: String,
            default: ''
        },
        navdata: {
            type: Array,
            required: true
        },
    },
    components: {

    },
    mounted: function () {
        console.log(this.navdata)
    },
    methods: {
        keyShowFun: function (index) {
            let _this = this;
            _this.navdata.forEach(function (item) {
                item.showFlag = -1;
            });
            _this.navdata[index].showFlag = 1;
            this.$emit('choseindex', _this.navdata[index])
        }
    },
    data() {
        return {
           
        }
    },
    computed:{

      isTwo() {
        if(this.navdata.length == 2){
            return false
        }else{
            return true
        }
      }  
    }
}
</script>
<style lang="less" scoped>
    .nav-tabs{
        overflow:hidden;
        li{
            float:left;
            &:nth-child(2){
            margin:0 25px;
        	} 
        }
        .active{
            background: rgba(32, 124, 229, 1);
            background: linear-gradient(to right, rgba(32, 124, 229, 1) 0%, rgba(0, 218, 255, 1) 59%, rgba(0, 218, 255, 1) 60%);
            color:#fff!important;
            border:none;
        }
    }
    .designcopy{
			width:150px;
			height: 38px;
			display: inline-block;
			line-height: 38px;
			text-align: center;
			color: #626262;
			font-size: 14px;
			border: 1px solid #D8D8D8;
			cursor: pointer;
    }   
    .othersum{
			width:236px;
			height: 38px;
			display: inline-block;
			line-height: 38px;
			text-align: center;
			color: #626262;
			font-size: 14px;
			border: 1px solid #D8D8D8;
			cursor: pointer;
    }
  
</style>