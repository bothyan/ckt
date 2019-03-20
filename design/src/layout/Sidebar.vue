<template>
	<div id="sidebar">
		<div class="sidebar-container" @click='hideNav' v-show="show">
			<div class="sidebar-overlay">
				<transition name="leftNav" mode="">
					<nav v-show='show'>
						
					</nav>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>

	export default {
		data(){
			
			return {
				
			}
		},
		computed:{
			show(){
				return this.$store.getters.leftNavState
			}
		},
		methods:{
			hideNav(){
				this.$store.dispatch('changeLeftNavState',false)
			}
		},
		created:function(){
			
		}
	
	}
</script>
<style lang="less" scoped>
	
.sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #9a9a9a;
    z-index: 501;
}
.sidebar-container .sidebar-overlay {
    background: rgba(0, 0, 0, 0.5);
    
}
    .sidebar-enter-active,.sidebar-leave-active{
        transition: all ease .8s
    }
.sidebar-container .sidebar-overlay nav {
    background: #fff;
    position: absolute;
    display: block;
    top: 50px;
    right:0;
    bottom: 0;
    width:200px;
}
#sidebar {
    transition: all ease .8s;
}
.leftNav-enter-active,.leftNav-leave-active{
    transition: right ease .8s
}
	
.leftNav-enter,.leftNav-leave-active{
    right: 0!important
}
	
</style>

