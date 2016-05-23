﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    var buttonsDiv;
    var loginDiv;
    var newUserDiv;
    var description;
    var situations;
    var newMessageDiv;
    var btn_get_coords;
    var address;

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind( this ), false );
        document.getElementById('btn_get_coords').addEventListener('click', replyClick, false);
        document.getElementById('btn_get_message').addEventListener('click', messageGet, false);
        document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
        document.getElementById('btn_login').addEventListener('click', loginUser, false);

    };

    //function pageChange() {
    //    window.location = 'NewMessage.html';
    //  //  window.focus = 'NewMessage.html';
    //    var list = ['Fire', 'Flood', 'Smoke'];
    //    var select = document.getElementById('situations');
    //    var options = select.options;

    //    for (var i = 0; i < list.length; i++) {
    //        var opt = document.createElement('option');
    //        opt.value = list[i];
    //        opt.innerHTML = list[i];
    //        select.appendChild(opt);
    //    }
    //}

    function messagePost() {

        newMessageDiv = document.getElementById('newMessageDiv');
        buttonsDiv = document.getElementById('buttonsDiv');
        newMessageDiv.hidden = false;
        buttonsDiv.hidden = true;

        document.getElementByValue('GPS').addEventListener('check', locationByAddress, false);
        document.getElementById('btn_send_ready_message').addEventListener('click', sendMessage, false);
    }

    function locationByAddress() {
       address = document.getElementById('address');
       address.setEnabled(true);
       btn_get_coords = document.getElementById('btn_get_coords');
       btn_get_coords.setEnabled(false);
    }

    function sendMessage(){
        

        send('http://localhost:56989/Ecology.svc/addwork', 'POST', JSON.stringify({
            Description: document.getElementById('description').value,
            SituationId: document.getElementById('situations').value,
            Longitude: "55",
            Latitude: "35",
            PlaceName: "Moscow"
        }), function (x) {
            var div = document.getElementById('answerDiv');
            div.innerHTML = x;
        })
    }

    function send(url, method, data, callback) {
        var xmlHttp = getXmlHttp();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                var obj = xmlHttp.responseText;
                if (obj == null || obj == "") {
                    callback(null);
                }
                else {
                    try {
                        var result = eval("(" + obj + ")");
                        callback(JSON.stringify(result));
                    }
                    catch (EX) {
                        return (null);
                    }
                }
            }
        }
        xmlHttp.open(method, url, true);
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send(data);
    }

    function messageGet() {
        var xmlhttp = getXmlHttp();
        xmlhttp.open('GET', 'http://localhost:56989/Ecology.svc/work/Hello!', true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var div = document.getElementById('answerDiv');
                    div.innerHTML = xmlhttp.responseText;
                }
            }
        };
        xmlhttp.send(null);
    }

    function getXmlHttp() {
        var xmlHttp;
        try { xmlHttp = new XMLHttpRequest(); }
        catch (e) {
            try { xmlHttp = new ActiveXObject("Msxml2.XMLHTTP"); }
            catch (e) {
                try { xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); }
                catch (e) { alert("This application only works in browsers with AJAX support"); }
            }
        }
        return xmlHttp;
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function replyClick() {
        navigator.geolocation.getCurrentPosition(onSuccess);
    }

    function onSuccess(position) {
        var div = document.getElementById('answerDiv');
        div.innerHTML = 'Latitude: ' + position.coords.latitude + '<br/>' + 'Longitude: ' + position.coords.longitude;
    }

    function loginUser() {

        buttonsDiv = document.getElementById('buttonsDiv');
        loginDiv = document.getElementById('loginDiv');
        buttonsDiv.hidden = true;
        loginDiv.hidden = false;

        document.getElementById('btn_sign_up').addEventListener('click', signUp, false);
        document.getElementById('btn_create_new_user').addEventListener('click', createNewUser, false);
        document.getElementById('btn_back').addEventListener('click', goBack, false);
    }

    function signUp() {

        send('http://localhost:56989/Ecology.svc/login', 'POST', JSON.stringify({
            Login: document.getElementById('login').value,
            Password_Hash: document.getElementById('password').value
        }), function (x) {
            var div = document.getElementById('answerDiv');
            div.innerHTML = x;
        })
    }

    function createNewUser()
    {
        loginDiv = document.getElementById('loginDiv');
        newUserDiv = document.getElementById('newUserDiv');
        loginDiv.hidden = true;
        newUserDiv.hidden = false;

        document.getElementById('btn_sign_up_new').addEventListener('click', signNewUser, false);
        document.getElementById('btn_back').addEventListener('click', goBack, false);

    }

    function signNewUser() {

        send('http://localhost:56989/Ecology.svc/create', 'POST', JSON.stringify({
            Login: document.getElementById('login_new').value,
            Password_Hash: document.getElementById('password_new').value,
            Email: document.getElementById('email_new').value
        }), function (x) {
            var div = document.getElementById('answerDiv');
            div.innerHTML = x;
        })
    }

    function goBack(){
        buttonsDiv = document.getElementById('buttonsDiv');
        buttonsDiv.hidden = false;
    }
    
} )();