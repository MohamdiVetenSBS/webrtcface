
var videos = [];
var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;

function getNumPerRow() {
  var len = videos.length;
  var biggest;

  // Ensure length is even for better division.
  if(len % 2 === 1) {
    len++;
  }

  biggest = Math.ceil(Math.sqrt(len));
  while(len % biggest !== 0) {
    biggest++;
  }
  return biggest;
}

function subdivideVideos() {
  var perRow = getNumPerRow();
  var numInRow = 0;
  for(var i = 0, len = videos.length; i < len; i++) {
    var video = videos[i];
    setWH(video, i);
    numInRow = (numInRow + 1) % perRow;
  }
}

function setWH(video, i) {
  var perRow = getNumPerRow();
  var perColumn = Math.ceil(videos.length / perRow);
  var width = Math.floor((window.innerWidth) / perRow);
  var height = Math.floor((window.innerHeight - 190) / perColumn);
  video.width = width;
  video.height = height;
  //video.style.position = "absolute";
  video.style.left = (i % perRow) * width + "px";
  video.style.top = Math.floor(i / perRow) * height + "px";
}

function cloneVideo(domId, socketId) {
  var video = document.getElementById(domId);
  var clone = video.cloneNode(false);
  clone.id = "remote" + socketId;
  document.getElementById('videos').appendChild(clone);
  videos.push(clone);
  return clone;
}

function removeVideo(socketId) {
  var video = document.getElementById('remote' + socketId);
  if(video) {
    videos.splice(videos.indexOf(video), 1);
    video.parentNode.removeChild(video);
  }
  // Trigger Modal for Disconnection;
  var bootstrapButton = $.fn.button.noConflict() // return $.fn.button to previously assigned value
  $.fn.bootstrapBtn = bootstrapButton;
  var htmlModalDisc = '<div id="disconnectModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">'+
  '<div class="modal-dialog modal-sm"> <div class="modal-content"> ' + 
  '    ... ' + 
 '   </div> ' + 
 ' </div> ' +
'</div>';

  $('body').append(htmlModalDisc);
  $('#disconnectModal').modal();

}

function addToChat(msg, classWho) {
    /*
    <div class="messages">
        <p>yeah, they do early flights cause they connect with big airports.  they wanna get u to your connection</p>
        <time datetime="2009-11-13T20:00">(Mins Ago)</time>
      </div>
    
    */
    var msgPrep = '<li class="' + classWho + '"><div class="avatar"><img src="/avatarpic.jpg" /></div> <div class="messages">';
    var timestamp = new Date().getTime().toString();
    var msgApp= '<p> <time datetime="'+ timestamp + '"> </time> </p> </div> </li>';
  var discussion = $('#messages');
  msg = sanitize(msg);


  msg = '<p>' + msg + '</p>';
    var MsWhole = msgPrep + msg + msgApp;
  console.log(MsWhole);
  console.log(discussion);
  discussion.append(MsWhole);
 
}

function sanitize(msg) {
  return msg.replace(/</g, '&lt;');
}

function initFullScreen() {
  var button = $('#fullScreenBtn');
   button.click(function(event) {
   var elem =  $('video');
   console.log(elem);
    //show full screen
    elem.webkitRequestFullScreen();
  });
}

function initNewRoom() {
   /*
  var button = document.getElementById("newRoom");

  button.addEventListener('click', function(event) {

    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for(var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }

    window.location.hash = randomstring;
    location.reload();
  })
    */

}

var websocketChat = {
  send: function(message) {
    rtc._socket.send(message);
  },
  recv: function(message) {
    return message;
  },
  event: 'receive_chat_msg'
};

var dataChannelChat = {
  send: function(message) {
    for(var connection in rtc.dataChannels) {
      var channel = rtc.dataChannels[connection];
      channel.send(message);
    }
  },
  recv: function(channel, message) {
    return JSON.parse(message).data;
  },
  event: 'data stream data'
};

function initChat() {
  var chat;

  if(rtc.dataChannelSupport) {
    console.log('initializing data channel chat');
    chat = dataChannelChat;
  } else {
    console.log('initializing websocket chat');
    chat = websocketChat;
  }

  var input = document.getElementById("chatinput");
  
//  var toggleHideShow = document.getElementById("hideShowMessages");
  var room = window.location.hash.slice(1);
  var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
  /*
  toggleHideShow.addEventListener('click', function() {
    var element = document.getElementById("messages");

    if(element.style.display === "block") {
      element.style.display = "none";
    }
    else {
      element.style.display = "block";
    }
    

  });
  */

  input.addEventListener('keydown', function(event) {
    var key = event.which || event.keyCode;
    if(key === 13) {
      chat.send(JSON.stringify({
        "eventName": "chat_msg",
        "data": {
          "messages": input.value,
          "room": room,
          "color": color
        }
      }));
      addToChat(input.value, 'self');
      input.value = "";
    }
  }, false);
  rtc.on(chat.event, function() {
    var data = chat.recv.apply(this, arguments);
    console.log(data.color);
    addToChat(data.messages, 'other');
  });
}


function init() {
  if(PeerConnection) {
    rtc.createStream({
      "video": {"mandatory": {}, "optional": []},
      "audio": true
    }, function(stream) {
      //document.getElementById('you').src = URL.createObjectURL(stream);
      //document.getElementById('you').play();
      //videos.push(document.getElementById('you'));
      //rtc.attachStream(stream, 'you');
      //subdivideVideos();
    });
  } else {
    alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
  }


  var room = window.location.hash.slice(1);

  rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);

  rtc.on('add remote stream', function(stream, socketId) {
    console.log("ADDING REMOTE STREAM...");
    //var clone = cloneVideo('', socketId);
   // document.getElementById(clone.id).setAttribute("class", "");
    rtc.attachStream(stream, "her");
    subdivideVideos();
  });
  rtc.on('disconnect stream', function(data) { // removing Stream
    console.log('remove ' + data);
    removeVideo(data);

  });
  //initFullScreen();
  initNewRoom();
  initChat();
}

window.onresize = function(event) {
  subdivideVideos();
};
$(function(){
    initFullScreen();
   
    
});