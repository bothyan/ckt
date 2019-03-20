<template>
	<ul class="layout-animation-wrap" :style="wrapStyle" v-if="animationShow">
		<li v-for="i in animationInfo.len" class="animation-default" 
				:class="[{'animation-active': (animationInfo.len-i) === animationInfo.from}, getClass(animationInfo.len-i)]"
		></li>
	</ul>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	export default {
		data() {
			return {
				left: 0,
				top: 0,
				len: 0,
				from: 0,
				to: 0,
				timer: null
			}
		},
		computed: {
			...mapGetters({
				animationShow: 'getLayerAnimationShow',
				animationInfo: 'getLayerAnimationInfo'
			}),
			wrapStyle() {
				return {
					left : this.left + 'px',
					top: this.top + 'px'
				}
			}
 		},
 		watch: {
 			animationShow(v) {
 				if(v) {
 					Object.assign(this, this.animationInfo);
					clearTimeout(this.timer);
 					this.timer = setTimeout(() => {
 						this.setLayerAnimationShow(false);
 						clearTimeout(this.timer);
 					}, 2000)
 				}
				else {
					clearTimeout(this.timer);
				}
 			}
 		},
 		methods: {
 			...mapActions([
 				'setLayerAnimationShow'
 			]),
 			getClass(index) {
 				if(index === this.from) {
 					if(this.from > this.to ) {
 						return 'up-down'
 					} 
 					else {
 						return 'down-up'
 					}
 				}
 				else if(index === this.to) {
 					if(this.from > this.to ) {
 						return 'down-up'
 					} 
 					else {
 						return 'up-down'
 					}
 				}
 			}
 		}
	}
</script>

<style lang="less" scoped>
	@import './layerAnimation.less';
</style>
