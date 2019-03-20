import dataHandle from '../common/dataHandle';

function headerSaveTime(){
	let isuploading=false,uploadStatus=0,quelengthInpage=0;
	dataHandle.addIsUploadCallBack((v)=>{
		isuploading = v
	})
	dataHandle.addUploadStatusCallBack((v)=>{
		uploadStatus = v
	})
	dataHandle.addPushQueueLengthCallBack((v)=>{
		quelengthInpage = v
	})
	return function(){
		console.log(quelengthInpage+'-------'+isuploading)
		//上传完成并且队列长度为零
		if(quelengthInpage==0&&isuploading==false){
			if(dataHandle.vuexGetters().getApiInfo) {
				dataHandle.vuexActions().setMessageShow[0]({placeHolder:'成功保存设计',kind:'success',hideTime:'4000'})
			} else {
				dataHandle.vuexActions().setMessageShow[0]({placeHolder:'成功保存设计到<a href="/designmanage" style="color:#07aefc;">设计管理</a>',kind:'success',hideTime:'4000'})
			}
			setTimeout(()=>{
				let time = new Date();
				let minutes = time.getMinutes();
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				dataHandle.vuexActions().setSaveTimes[0](`今天 ${time.getHours()} : ${minutes} 更新`)
			},5000)
			dataHandle.update()
		}else{
			dataHandle.vuexActions().setSaveSuccessMessageFlag[0](true)
			dataHandle.update()
		}
	}
}
export default headerSaveTime;