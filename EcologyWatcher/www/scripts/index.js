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
    var addressInput = document.getElementById('addressInput');
    var searchDiv = document.getElementById('searchDiv');
    var search_by_time_div = document.getElementById('search_by_time_div');

    var user;
    var coordinates;

    function onDeviceReady() {

        document.getElementById('btn_sign_in').addEventListener('click', signInClick, false);
        document.getElementById('btn_sign_up').addEventListener('click', signUpClick, false);
    };

    function messagePost() {
        answerDiv.innerHTML = '';
        showDiv(newMessageDiv);

        // fix radio buttons
        document.getElementByValue('GPS').addEventListener('selectionchange', selectGpsOrAddress, false);
        document.getElementByValue('address').addEventListener('selectionchange', selectGpsOrAddress, false);
        document.getElementById('btn_submit').addEventListener('click', sendMessage, false);
    }

    function selectGpsOrAddress() {
        if( document.getElementById('rad_btn_location').selectedIndex == 1 ) {
            addressInput.disabled = false;
        }
        else {
            addressInput.disabled = true;
        }
    }

    function locationByAddress(adress) {       
       var xmlhttp = getXmlHttp();
       var adress = 'Moscow,+Kulakova,+15';
       var request = 'https://maps.googleapis.com/maps/api/geocode/json?address='+adress+'&key=AIzaSyA5u_V-AjoMQPWLoRE3lNQXcb-AWDxGUf4';
       xmlhttp.open('GET', request, true);
       xmlhttp.onreadystatechange = function () {
           if (xmlhttp.readyState == 4) {
               if (xmlhttp.status == 200) {
                   var obj = JSON.parse(xmlhttp.responseText);
                   var div = document.getElementById('answerDiv');
                   div.innerHTML = 'Latitude: ' + obj.results[0].geometry.location.lat + '<br/>'
                       + 'Longitude: ' + obj.results[0].geometry.location.lng;
               }
           }
       };
       xmlhttp.send(null);
    }

    function sendMessage(){
        var place = '';
        if (true) {
    
        }
        var temp = document.getElementById('situations');
        send('https://eco.cyrilmarten.com/Ecology.svc/addwork', 'POST', JSON.stringify({
            Description: document.getElementById('description').value,
            SituationId: temp.options[temp.selectedIndex].text,
            Longitude: coordinates[0],
            Latitude: coordinates[1],
            PlaceName: place,
            Radius: 5.2
        }), function (x) {
            var div = document.getElementById('answerDiv');
            div.innerHTML = x;
        })
    }

    function send(rejectUnauthorized, url, method, data, callback) {
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

  //  function messageGet() {
  //      var xmlhttp = getXmlHttp();
  //      xmlhttp.open('GET', 'https://eco.cyrilmarten.com/Ecology.svc/work/Hello!', true);
  //      xmlhttp.onreadystatechange = function () {
  //          if (xmlhttp.readyState == 4) {
  //              if (xmlhttp.status == 200) {
  //                  answerDiv.innerHTML = xmlhttp.responseText;
  //              }
  //          }
  //      };x
  //      xmlhttp.send(null);
  //  }

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

    function getPosition() {
        navigator.geolocation.getCurrentPosition(onSuccess);
    }

    function onSuccess(position) {
        coordinates = [position.coords.latitude, position.coords.longitude];
        answerDiv.innerHTML = 'Latitude: ' + position.coords.latitude + '<br/>' + 'Longitude: ' + position.coords.longitude;
    }

    function signInClick() {
        showDiv(signInDiv);

        document.getElementById('btn_submit_sign_in').addEventListener('click', signIn, false);
        
    }

    function signIn() {
        send('https://eco.cyrilmarten.com/Ecology.svc/login', 'POST', JSON.stringify({
            Login: document.getElementById('login').value,
            Password: document.getElementById('password').value
        }), function (x) {
            if (x == '{"LoginUserResult":1}') {
                user = document.getElementById('login').value;
                answerDiv.innerHTML = 'Welcome, ' + user;
                showDiv(buttonsDiv);
                document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
                //document.getElementById('btn_about_place').addEventListener('click', ?, false);
                //document.getElementById('btn_history').addEventListener('click', ?, false);
                //document.getElementById('btn_search').addEventListener('click', search, false);
            } else {
                if (x == '{"LoginUserResult":-1}') {
                    answerDiv.innerHTML = 'Sorry, you are not registred.';
                } else {
                    answerDiv.innerHTML = 'Error.';
                }
            }
        })
    }

    function signUpClick()
    {
        showDiv(signUpDiv);
        document.getElementById('btn_submit_sign_up').addEventListener('click', signUp, false);
    }

    function signUp() {

        send(false, 'https://localhost:44369/Ecology.svc/create', 'POST', JSON.stringify({
            Login: document.getElementById('login_new').value,
            Password: document.getElementById('password_new').value,
            Email: document.getElementById('email_new').value
        }), function (x) {
            answerDiv.innerHTML = x;
        })
    }

    function showDiv(visibleDivName) {
        visibleDivName.hidden = false;
        for (var i = 0; i < allDivs.length; i++) {
            if (visibleDivName != allDivs[i]) {
                allDivs[i].hidden = true;
            }
        }
    }
    
    function search(){
        showDiv(searchDiv);
        //document.getElementById('btn_search_by_time_click').addEventListener('click', search_by_time_click, false);
        //document.getElementById('btn_search_by_geoposition_click').addEventListener('click', search_by_geoposition_click, false);
        document.getElementById('btn_search_last_ten_click').addEventListener('click', search_last_ten_click, false);
    }
    function search_last_ten_click() {
        var xmlhttp = getXmlHttp();
        xmlhttp.open('GET', 'https://eco.cyrilmarten.com/Ecology.svc/searchlast10"', true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    answerDiv.innerHTML = xmlhttp.responseText;
                }
            }
        }; x
        xmlhttp.send(null);
    }
    function search_by_time_click() {
        showDiv(search_by_time_div);
        document.getElementById('btn_search_by_time').addEventListener('click', search_by_time, false);
    }
    function search_by_time(){
        send(false, 'https://localhost:44369/Ecology.svc/search', 'POST', JSON.stringify({
            
        }), function (x) {
            answerDiv.innerHTML = x;
        })
    }
} )();