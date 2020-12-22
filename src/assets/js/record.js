const record = function () {
    function recordScreen() {
        var buffer; // 用于存储录制数据（数组）
        this.mediaStream ;
        this.url = '';
        this.file = null;
        var mediaRecoder;
        // 下载事件
        this.downloadRecord = function () {
            var blob = new Blob(buffer,{type:'video/mp4'});
            // 根据缓存数据生成url
            var url = window.URL.createObjectURL(blob);
            // 创建一个a标签，通过a标签指向url来下载
            var a = document.createElement('a');
            a.href = url;
            a.style.display = 'none'; // 不显示a标签
            a.download = 'test.mp4'; // 下载的文件名
            a.click(); // 调用a标签的点击事件进行下载
        };

        // this.playRecord = function() {
        //     var blob = new Blob(buffer,{type:'video/webm'});
        //     // 根据缓存数据生成url
        //     var url = window.URL.createObjectURL(blob);
        //     this.url = url;
        // }

        // 开始录制
        this.startRecord = function (isvideo){ //参数控制是否录制视频
            // start(isvideo)
            // var types = ["video/webm", 
            //  "audio/webm", 
            //  "video/webm\;codecs=vp8", 
            //  "video/webm\;codecs=daala", 
            //  "video/webm\;codecs=h264", 
            //  "audio/webm\;codecs=opus", 
            //  "video/mpeg",
            //  "audio/mpeg"];

            // for (var i in types) { 
            // ( "Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Maybe!" : "Nope :("));
            // }
            // var options = {mimeType:'video/webm;codecs=vp8'};
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isFirfox = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            if (isFirfox) { // 兼容火狐
              var options = {mimeType:'video/webm'};
            } else {
              var options = {mimeType:'video/webm;codecs=vp8'};
            }
            if(!MediaRecorder.isTypeSupported(options.mimeType)){
                return;
            }
            try{
                buffer = [];
                mediaRecoder = new MediaRecorder(this.mediaStream,options);
            }catch(e){
                return;
            }
            mediaRecoder.ondataavailable = handleDataAvailable;
            // 开始录制，设置录制时间片为10ms(每10s触发一次ondataavilable事件)
            mediaRecoder.start(1000);
        }

        // 停止录制
        this.stopRecord = function (){
            mediaRecoder.stop();
            var blobmp3 = new Blob(buffer,{type:'video/mpeg'});
            // 根据缓存数据生成url
            var url = window.URL.createObjectURL(blobmp3);
            this.url = url;
            this.file = blobmp3;
        }

        // 触发ondataavilable事件的回调函数
        function handleDataAvailable(e){
            if (e && e.data && e.data.size>0) {
                buffer.push(e.data);
            }
        }

        // function start(isvideo){
        //     if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        //         ('不支采集音视频数据！');
        //     }else{
        //         // 采集音频数据
        //         var constrants = {
        //             video: isvideo,
        //             audio:true
        //         };
        //         navigator.mediaDevices.getDisplayMedia(constrants).then(gotMediaStream).catch(handleError);
        //     }
        // }


        // 采集音频数据成功时调用的方法
        // function gotMediaStream(stream){
        //     mediaStream = stream;
        //     // player.srcObject = stream;
        // }

        // // 采集音频数据失败时调用的方法
        // function handleError(err){
        //     (err.name+':'+err.message);
        // }
    }
    return new recordScreen();
}

export default record;