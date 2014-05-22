
$(function () {

    // Events



    var channelRand = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    channelRand = window.location.hash.slice(1,19);
    var channelInputAlias = $('#channel');
    var connection = new RTCMultiConnection();

    // file progress-bars container
    connection.body = document.querySelector('#file-progress');

    connection.session = {
        data: true
    };
    // connection.maxParticipantsAllowed = 1;
    connection.direction = 'one-to-one';
    var channelName = channelRand;

    function initRTC() {
        console.log('Hello from init RTC');
        connection.open(channelName);
        

    }
    function connectRTC() {

        connection.connect(channelName);
        $('#file').removeAttr('disabled');
        console.log('Recieveing.....  on ' + channelName);
        console.log(connection);
    }


    $('#file').change(function () {
        var file = this.files[0];
        connection.send(file);
    });

    connection.onopen = function () {
        $('#file').removeAttr('disabled');
        alert('Connection Succeded');
    };
    connection.onconnect = function () {

        alert('Connection OnConnect');
    };
    $('#sendFileTransfer').click(function () {
        initRTC();

    });
    $('#recieveFileTransfer').click(function () {
        connectRTC();
    });
    
    if (window.location.hash.slice(1).length <= 18) {
          console.log('Calling...');
           initRTC();
    }
    else {
      
        console.log('Rec ...')
       connectRTC();
    }
    
  //  initRTC();
   // connectRTC();

});


