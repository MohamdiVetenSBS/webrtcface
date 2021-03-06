 $(function(){
     var connection = new RTCMultiConnection();

                connection.session = {
                    audio: true,
                    video: true
                };

                connection.onstream = function(e) {
                    appendVideo(e.mediaElement, e.streamid);
                };

                function appendVideo(video, streamid) {
                    video.width = 600;
                    video = getVideo(video, streamid);
                    videosContainer.insertBefore(video, videosContainer.firstChild);
                    rotateVideo(video);
                    scaleVideos();

                    document.getElementById('leave-conference').disabled = false;
                }

                function getVideo(video, streamid) {
                    var div = document.createElement('div');
                    div.className = 'video-container';

                    var button = document.createElement('button');
                    button.id = streamid;
                    button.innerHTML = 'Start Recording';
                    button.onclick = function() {
                        this.disabled = true;
                        if (this.innerHTML == 'Start Recording') {
                            this.innerHTML = 'Stop Recording';
                            connection.streams[this.id].startRecording({
                                audio: true,
                                video: true
                            });
                        } else {
                            this.innerHTML = 'Start Recording';
                            connection.streams[this.id].stopRecording(function(audioBlob, videoBlob) {
                                var h2 = document.createElement('h2');
                                h2.innerHTML = '<a href="' + URL.createObjectURL(audioBlob) + '" target="_blank">Open recorded ' + audioBlob.type + '</a>';
                                div.appendChild(h2);

                                h2 = document.createElement('h2');
                                h2.innerHTML = '<a href="' + URL.createObjectURL(videoBlob) + '" target="_blank">Open recorded ' + videoBlob.type + '</a>';
                                div.appendChild(h2);
                            });
                        }
                        setTimeout(function() {
                            button.disabled = false;
                        }, 3000);
                    };
                    div.appendChild(button);
                    div.appendChild(video);
                    return div;
                }
                JOIN
                function rotateVideo(mediaElement) {
                    mediaElement.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
                    setTimeout(function() {
                        mediaElement.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
                    }, 1000);
                }

                connection.onstreamended = function(e) {
                    var div = e.mediaElement.parentNode;
                    div.style.opacity = 0;
                    rotateVideo(div);
                    setTimeout(function() {
                        if (div.parentNode) {
                            div.parentNode.removeChild(div);
                        }
                        scaleVideos();
                    }, 1000);
                };

                var sessions = { };
                connection.onNewSession = function(session) {
                    if (sessions[session.sessionid]) return;
                    sessions[session.sessionid] = session;

                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td><strong>' + session.extra['session-name'] + '</strong> is running a conference!</td>' +
                        '<td><button class="join">Join</button></td>';
                    roomsList.insertBefore(tr, roomsList.firstChild);

                    var joinRoomButton = tr.querySelector('.join');
                    joinRoomButton.setAttribute('data-sessionid', session.sessionid);
                    joinRoomButton.onclick = function() {
                        this.disabled = true;

                        var sessionid = this.getAttribute('data-sessionid');
                        session = sessions[sessionid];

                        if (!session) throw 'No such session exists.';

                        connection.join(session);
                    };
                };

                var videosContainer = document.getElementById('videos-container') || document.body;
                var roomsList = document.getElementById('rooms-list');

                document.getElementById('setup-new-conference').onclick = function() {
                    connection.sessionid = (Math.random() * 999999999999).toString().replace('.', '');
                    this.disabled = true;
                    connection.extra = {
                        'session-name': document.getElementById('conference-name').value || 'Anonymous'
                    };
                    connection.open();
                };

                document.getElementById('leave-conference').onclick = function() {
                    this.disabled = true;
                    connection.close();
                };

                // setup signaling to search existing sessions
                connection.connect();

                (function() {
                    var uniqueToken = document.getElementById('unique-token');
                    if (uniqueToken)
                        if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
                        else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace( /\./g , '-');
                })();

                function scaleVideos() {
                    var videos = document.querySelectorAll('video'),
                        length = videos.length, video;

                    var minus = 130;
                    var windowHeight = 700;
                    var windowWidth = 600;
                    var windowAspectRatio = windowWidth / windowHeight;
                    var videoAspectRatio = 4 / 3;
                    var blockAspectRatio;
                    var tempVideoWidth = 0;
                    var maxVideoWidth = 0;

                    for (var i = length; i > 0; i--) {
                        blockAspectRatio = i * videoAspectRatio / Math.ceil(length / i);
                        if (blockAspectRatio <= windowAspectRatio) {
                            tempVideoWidth = videoAspectRatio * windowHeight / Math.ceil(length / i);
                        } else {
                            tempVideoWidth = windowWidth / i;
                        }
                        if (tempVideoWidth > maxVideoWidth)
                            maxVideoWidth = tempVideoWidth;
                    }
                    for (var i = 0; i < length; i++) {
                        video = videos[i];
                        if (video)
                            video.width = maxVideoWidth - minus;
                    }
                }

                window.onresize = scaleVideos;


 });
 
 function setupSession(sessionid)
 {
     connection.sessionid = 'ABC123';//(Math.random() * 999999999999).toString().replace('.', '');
                    //this.disabled = true;
                    connection.extra = {
                        'session-name': document.getElementById('conference-name').value || 'Anonymous'
                    };
                    connection.open();
 }


 function joinsession(sessionid)
 {
     connection.join(session);
 }