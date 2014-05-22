




$(function () {
    console.log('Calling now Record RTC');
    var recorder = new RecordRTC(rtc.streams[0]); // attaching main rmeote stream
    function getVideo(video, streamid) {
        var div = document.createElement('div');
        div.className = 'video-container';

        var button = document.createElement('button');
        button.id = streamid;
        button.innerHTML = 'Start Recording';
        button.onclick = function () {
            this.disabled = true;
            if (this.innerHTML == 'Start Recording') {
                this.innerHTML = 'Stop Recording';
                connection.streams[this.id].startRecording({
                    audio: true,
                    video: true
                });
            } else {
                this.innerHTML = 'Start Recording';
                connection.streams[this.id].stopRecording(function (audioBlob, videoBlob) {
                    var h2 = document.createElement('h2');
                    h2.innerHTML = '<a href="' + URL.createObjectURL(audioBlob) + '" target="_blank">Open recorded ' + audioBlob.type + '</a>';
                    div.appendChild(h2);

                    h2 = document.createElement('h2');
                    h2.innerHTML = '<a href="' + URL.createObjectURL(videoBlob) + '" target="_blank">Open recorded ' + videoBlob.type + '</a>';
                    div.appendChild(h2);
                });
            }
            setTimeout(function () {
                button.disabled = false;
            }, 3000);
        };
        div.appendChild(button);
        div.appendChild(video);
        return div;
    }



    // remote stream

    function record(recorder) {
        console.log(recorder);
        recorder.startRecording({ // puthere
            audio: true,
            video: true
        });





    }

    function stopRecording(recorder) {
        recorder.stopRecording(function (audioBlob, videoBlob) {
            var div = document.createElement('div');
            var h2 = document.createElement('h2');
            h2.innerHTML = '<a href="' + URL.createObjectURL(audioBlob) + '" target="_blank">Open recorded ' + audioBlob.type + '</a>';
            div.appendChild(h2);

            h2 = document.createElement('h2');
            h2.innerHTML = '<a href="' + URL.createObjectURL(videoBlob) + '" target="_blank">Open recorded ' + videoBlob.type + '</a>';
            div.appendChild(h2);
            $('body').append(div.innerHTML); // just in case
        });

    }
    $('#btnRecord').click(function () {
        console.log('Recording?????.....');
        record(recorder);
    });
    $('#btnStopRecord').click(function () {
        console.log('Stopiing Recording?????.....');
        stopRecording(recorder);
    });

});