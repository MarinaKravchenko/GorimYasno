// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    var startDiv = document.getElementById('startDiv');
    var signInDiv = document.getElementById('signInDiv');
    var signUpDiv = document.getElementById('signUpDiv');
    var buttonsDiv = document.getElementById('buttonsDiv');
    var newMessageDiv = document.getElementById('newMessageDiv');
    var answerDiv = document.getElementById('answerDiv');
    var allDivs = [startDiv, signUpDiv, signInDiv, buttonsDiv, newMessageDiv];
    var description;
    var situations;
    var btn_get_coords;
    var address;

    function onDeviceReady() {

        document.getElementById('btn_sign_in').addEventListener('click', signInClick, false);
        document.getElementById('btn_sign_up').addEventListener('click', signUpClick, false);

      //  document.getElementById('btn_submit').addEventListener('click', sendMessage, false);
      //  document.getElementById('btn_back1').addEventListener('click', goBack, false);
    };

    function messagePost() {
        showDiv(newMessageDiv);

      //  document.getElementByValue('GPS').addEventListener('check', locationByAddress, false);
      //  document.getElementById('btn_send_ready_message').addEventListener('click', sendMessage, false);
    }

    function locationByAddress() {
       address = document.getElementById('address');
       address.setEnabled(true);
       btn_get_coords = document.getElementById('btn_get_coords');
       btn_get_coords.setEnabled(false);
    }

    function sendMessage(){
       
        var temp = document.getElementById('situations');
        send('http://localhost:56989/Ecology.svc/addwork', 'POST', JSON.stringify({
            Description: "lala",//document.getElementById('description').value,
            SituationId: 1, //temp.options[temp.selectedIndex].text,
            Longitude: "55",
            Latitude: "35",
            PlaceName: "Moscow",
            Radius: 5.2
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

    function replyClick() {
        navigator.geolocation.getCurrentPosition(onSuccess);
    }

    function onSuccess(position) {
        var div = document.getElementById('answerDiv');
        div.innerHTML = 'Latitude: ' + position.coords.latitude + '<br/>' + 'Longitude: ' + position.coords.longitude;
    }

    function signInClick() {

        showDiv(signInDiv);

        document.getElementById('btn_submit_sign_in').addEventListener('click', signIn, false);
        document.getElementById('btn_back_from_sign_in').addEventListener('click', sendMessage, false);
    }

    function signIn() {

        send('http://localhost:56989/Ecology.svc/login', 'POST', JSON.stringify({
            Login: document.getElementById('login').value,
            Password: document.getElementById('password').value
        }), function (x) {
            answerDiv.innerHTML = x;
            alert(x);
        })
    }

    function signUpClick()
    {
        showDiv(buttonsDiv);
        document.getElementById('btn_get_coords').addEventListener('click', replyClick, false);
        document.getElementById('btn_get_message').addEventListener('click', messageGet, false);
        document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
        document.getElementById('btn_about_place').addEventListener('click', aboutPlaceClick, false);
        document.getElementById('btn_history').addEventListener('click', historyClick, false);

       // document.getElementById('btn_sign_up_new').addEventListener('click', signNewUser, false);
       // document.getElementById('btn_back').addEventListener('click', goBack, false);

    }

    function signUp() {

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
        showDiv(startDiv);
    }

    function showDiv(visibleDivName) {
        visibleDivName.hidden = false;
        for (var i = 0; i < allDivs.length; i++) {
            if (visibleDivName != allDivs[i]) {
                allDivs[i].hidden = true;
            }
        }
    }
    
} )();