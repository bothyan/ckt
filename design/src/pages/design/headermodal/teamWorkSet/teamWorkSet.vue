<template>
  <div class="team-workSet">
    <div class="team-workSet-title" v-if="step===0">
      <span>协作权限设置</span>
    </div>
    <div class="team-workSet-title2" v-else @click="step=0">
      <span><返回协作权限设置</span>
    </div>
    <div class="team-workSet-content" :style="{height:step===0?'248px':'292px'}">
      <span class="team-workSet-content-text">
        {{step===0?'已有协作成员：':'点击添加协作成员'}}
      </span>
      <div class="team-workSet-item" v-for="e in step===0?cooper:teams">
        <img :src="e.hurl" alt="" class="img">
        <span class="name">{{e.nk}}</span>
        <span class="email">{{e.e}}</span>
        <div class="menu" v-if="step===0">
          <span :class="{ido:e.ido}">{{e.ido?'作者':e.type===0?'仅查看':'可编辑'}}</span>
          <ul class="operate" v-if="!e.ido">
            <!--<li class="operate-change" @click="updateDesignCooperator(e.uid,~~!e.type)">{{e.type===1?'仅查看':'可编辑'}}</li>-->
            <li class="operate-remove" @click="delDesignCooperator(e.uid)">移除</li>
          </ul>
        </div>
        <div class="menu1" v-else @click="addDesignCooperators(e.uid)">
          <span class="add">添加</span>
        </div>
      </div>
    </div>
    <div class="team-workSet-confirm" @click="step=1" v-if="step===0">
      <span>添加协作成员</span>
    </div>
  </div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex'

	export default {
		name:'head-teamWorkSet',
		data(){
			return{
				step:0,
				cooper:[],
				teams:[],
				owner:{}
			}
		},
		methods:{
			...mapActions({
				setMessageShow:"setMessageShow"
			}),
			addDesignCooperators(u){
				let i='{'+u+':1}'
				this.$http.post('/design/addDesignCooperators',{d:this.designInfo.designId,tid:this.teamId,i})
					.then(res=>{
						if(res.data.body){
							switch (res.data.body.code){
								case 1:
									this.setMessageShow({placeHolder:'添加成功',kind:'success'})
									let index = findIndexInArr(this.teams,u)
									if(index!==null){
										let item=this.teams.splice(index,1)
										this.cooper.push(...item)
									}
									break
								case -3:
									this.setMessageShow({placeHolder:'添加失败，权限不足'})
									break
								default:
									this.setMessageShow({placeHolder:'添加失败'})
							}
						}
					},err=>{
						console.log('添加失败，网络出错')
					})
			},
			delDesignCooperator(cid){
				this.$http.post('/design/delDesignCooperator',{d:this.designInfo.designId,tid:this.teamId,cid})
					.then(res=>{
						if(res.data.body){
							switch (res.data.body.code){
								case 1:
									this.setMessageShow({placeHolder:'删除成功',kind:'success'})
									let index = findIndexInArr(this.cooper,cid)
									if(index!==null){
										let item=this.cooper.splice(index,1)
										this.teams.push(...item)
									}
									break
								case -3:
									this.setMessageShow({placeHolder:'删除失败，权限不足'})
									break
								default:
									this.setMessageShow({placeHolder:'删除失败'})
							}
						}
					},err=>{
						console.log('添加失败，网络出错')
					})
			},
			updateDesignCooperator(cid,t){
				this.$http.post('/design/updateDesignCooperator',{d:this.designInfo.designId,tid:this.teamId,cid,t})
					.then(res=>{
						if(res.data.body){
							switch (res.data.body.code){
								case 1:
									this.setMessageShow({placeHolder:'更新成功',kind:'success'})
									let index = findIndexInArr(this.cooper,u)
									if(index!==null){
										this.cooper[i].type=t
									}
									break
								case -3:
									this.setMessageShow({placeHolder:'更新失败，权限不足'})
									break
								default:
									this.setMessageShow({placeHolder:'更新失败'})
							}
						}
					},err=>{
						console.log('添加失败，网络出错')
					})
			},

		},
		computed:{
			...mapGetters({
				teamId:'getTeamId',
				designInfo:'getDesignInfo',
				userInfo:'getUserInfo'
			})
		},
		beforeMount(){
			console.log(this.userInfo)
			this.owner={
				uid:this.userInfo.userId,
				e:this.userInfo.email,
				hurl:this.userInfo.userHeadImgUrl,
				nk:decodeURIComponent(this.userInfo.nickname),
				ido:true
			}
			this.cooper.push(this.owner)

			let getDesignCooperators=()=>{
				return new Promise((resolve,reject)=>{
					this.$http.post('/design/getDesignCooperators',{d:this.designInfo.designId,tid:this.teamId})
						.then(res=>{
							if(res.data.body){
								if(res.data.body.code!==undefined){
									switch (res.data.body.code){
										case -1:
											this.setMessageShow({placeHolder:'参数有误'})
											break
										case -2:
											this.setMessageShow({placeHolder:'未登录'})
											break
										case -3:
											this.setMessageShow({placeHolder:'权限不足'})
											break
									}
									return
								}
								let list=res.data.body.list
								list.forEach(e=>{
									if(e.uid!==this.owner.uid)
										this.cooper.push({...e,nk:decodeURIComponent(e.nk)})
								})
								resolve()
							}
						},err=>{
							console.log('获取协作者列表失败，网络出错')
						})
				})
			}

			let getTeamMembers=()=>{
				return new Promise((resolve,reject)=>{
					this.$http.post('/team/getTeamMembers',{tid:this.teamId})
						.then(res=>{
							if(res.data.body){
								if(res.data.body.code!==undefined){
									switch (res.data.body.code){
										case -1:
											this.setMessageShow({placeHolder:'未登录'})
											break
										case -2:
											this.setMessageShow({placeHolder:'参数有误'})
											break
										case 0:
											this.setMessageShow({placeHolder:'权限不足'})
											break
									}
									return
								}
								let list=res.data.body.mems
								list.forEach(e=>{
									this.teams.push({...e,nk:decodeURIComponent(e.nk)})
								})
								resolve()
							}
						})
				})
			}
			//删除重复的
			Promise.all([getDesignCooperators(),getTeamMembers()])
				.then(()=>{
					this.cooper.forEach(cooper=>{
						let index=null
						this.teams.forEach((u,i)=>{
							if(cooper.uid==u.uid)
								index=i
						})
						if(index!==null)
							this.teams.splice(index,1)
					})
				})
		}
	}

	function findIndexInArr(arr,uid) {
		let index=null
		arr.forEach((e,i)=>{
			if(e.uid==uid)
				index=i
		})
		return index
	}
</script>
<style lang="less" scoped>
  .team-workSet{
    width: 660px;
    height: 435px;
    background-color: #FFF;
    overflow: hidden;

    .team-workSet-title{
      font-size: 28px;
      line-height: 86px;
      color: #07aefc;
      text-align: center;
    }

    .team-workSet-title2{
      height: 86px;
      width: 140px;
      font-size: 14px;
      line-height: 86px;
      margin-left: 56px;
      text-align: left;
      color: #07aefc;
      cursor: pointer;
    }

    .team-workSet-content{
      width: 556px;
      height: 248px;
      padding: 30px 26px 30px 26px;
      margin: 0px auto 0px auto;
      background-color: #F4F4F4;
      overflow-x: hidden;
      overflow-y: auto;
      display: block;
      transition: height .2s ease;

      .team-workSet-content-text{
        font-size: 14px;
        line-height: 14px;
        padding-bottom: 13px;
        color: #999;
        display: block;
      }

      .team-workSet-item{
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        margin-bottom: 5px;

        .img{
          width: 20px;
          height: 20px;
          margin-top: 7px;
          border-radius: 50%;
          display: inline-block;
          float: left;
        }
        .name{
          width: 120px;
          height: 100%;
          margin-left: 8px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          float: left;
        }
        .email{
          width: 200px;
          height: 100%;
          margin-left: 28px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          float: left;
        }
        .menu,.menu1{
          width: 100px;
          height: 34px;
          margin-left: 18px;
          /*background-color: #FFF;*/
          display: inline-block;
          float: left;
          cursor: pointer;
          position: relative;
          text-align: center;
          line-height: 34px;
          font-size: 14px;

          &>span{
            background: #FFFFff;
            width: 100%;
            height: 100%;
            display: inline-block;
          }

          .ido{
            background: transparent;
          }

          .add{
            width: 80px;
            height: 30px;
            line-height: 30px;
            margin-left: 18px;
            color: #FFF;
            background-color: #07aefc;
            border-radius: 3px;
            display: inline-block;
            text-align: center;
            float: left;
            cursor: pointer;
          }

          &:hover{
            .operate{
              display: block;
            }
          }

          .operate{
            position: absolute;
            top: 34px;
            left: 0;
            width: 100%;
            display: none;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
            background-color:#fff;
            z-index: 9;

            &>li{
              width: 100%;
              height: 34px;
            }

            .operate-change:hover{
              background-color: #F4F4F4;
            }

            .operate-remove:hover{
              background-color: #EC555A;
            }
          }
        }
      }
    }

    .team-workSet-confirm{
      width: 166px;
      height: 44px;
      font-size: 16px;
      line-height: 44px;
      border-radius: 4px;
      color: #FFF;
      margin: 25px auto 0 auto;
      background-color: #07aefc;
      text-align: center;
      cursor: pointer;
    }
  }
</style>