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
    var searchDiv = document.getElementById('searchDiv');
    var search_by_time_div = document.getElementById('search_by_time_div');
    var search_last_10 = document.getElementById('search_last_10');
    var search_by_time_div_answer = document.getElementById('search_by_time_div_answer');
    var search_by_geoposition_div = document.getElementById('search_by_geoposition_div');
    var about_programm_div = document.getElementById('about_programm_div');
    var about_authors_div = document.getElementById('about_authors_div');
    var allDivs = [startDiv, signUpDiv, signInDiv, buttonsDiv, newMessageDiv, searchDiv, search_by_time_div, search_last_10, search_by_time_div_answer, about_programm_div, about_authors_div];
    var addressInput = document.getElementById('addressInput');
    
    var situations = document.getElementById('situations');
    var user;
    var coordinates = [55, 35];
    var session_key;

    function onDeviceReady() {

        document.getElementById('btn_sign_in').addEventListener('click', signInClick, false);
        document.getElementById('btn_sign_up').addEventListener('click', signUpClick, false);
        document.getElementById('btn_about_programm').addEventListener('click', aboutProgrammClick, false);
        document.getElementById('btn_about_authors').addEventListener('click', aboutAuthorsClick, false);
    };

    function addressPredict() {
        var input = document.getElementById('addressInputText').value;
        var xmlhttp = getXmlHttp();
        var request = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + input +
            '&types=address&language=en&key=AIzaSyA5u_V-AjoMQPWLoRE3lNQXcb-AWDxGUf4';
        xmlhttp.open('GET', request, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    var mas = obj.predictions;
                    var list = [];
                    for (var i = 0; i < obj.predictions.length; i++) {
                        list += obj.predictions[i].description;
                    }
                    document.getElementById('address')
                }
            }
        };
        xmlhttp.send(null);
    }

    function messagePost() {
        answerDiv.innerHTML = '';
        showDiv(newMessageDiv);

        document.getElementById('addressInputText').addEventListener('input', addressPredict, false);
        document.getElementById('check_box_GPS').addEventListener('CheckboxStateChange', selectGpsOrAddress, false);
        document.getElementById('btn_submit').addEventListener('click', sendMessage, false);
    }

    function selectGpsOrAddress() {
        if( document.getElementById('check_box_GPS').checked == true ) {
            document.getElementById('addressInputText').disabled = true;
        }
        else {
            document.getElementById('addressInputText').disabled = false;
        }
    }

    function locationByAddress() {       
       var xmlhttp = getXmlHttp();
       var address = 'Moscow,+Kulakova,+15';
       var request = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address +
           '&key=AIzaSyA5u_V-AjoMQPWLoRE3lNQXcb-AWDxGUf4';
       xmlhttp.open('GET', request, true);
       xmlhttp.onreadystatechange = function () {
           if (xmlhttp.readyState == 4) {
               if (xmlhttp.status == 200) {
                   var obj = JSON.parse(xmlhttp.responseText);
                   var div = document.getElementById('answerDiv');
                   div.innerHTML = 'Latitude: ' + obj.results[0].geometry.location.lat + '<br/>'
                       + 'Longitude: ' + obj.results[0].geometry.location.lng;
                   coordinates = [obj.results[0].geometry.location.lng, obj.results[0].geometry.location.lat];
               }
           }
       };
       xmlhttp.send(null);
    }
    
    function addressByLocation() {
        var xmlhttp = getXmlHttp();
        var request = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordinates[1] + ',' + coordinates[0] + '&key=AIzaSyA5u_V-AjoMQPWLoRE3lNQXcb-AWDxGUf4';
        xmlhttp.open('GET', request, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    return obj.results.formatted_address;
                }
            }
        };
        xmlhttp.send(null);
    }

    function sendMessage(){
        var place = addressByLocation();
        var temp = document.getElementById('situations');
        send('http://localhost:56989//Ecology.svc/addwork', 'POST', JSON.stringify({
            Description: document.getElementById('description').value,
            SituationId: situations.selectedIndex,
            Longitude: coordinates[0],
            Latitude: coordinates[1],
            PlaceName: place,
            Radius: document.getElementById('radius').value,
            Relation: document.getElementByName('rad_btn_relation').value
        }), function (x) {
            answerDiv.innerHTML = x;
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

  //  function messageGet() {
  //      var xmlhttp = getXmlHttp();
    //      xmlhttp.open('GET', 'http://localhost:56989/Ecology.svc/work/Hello!', true);
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
        send('http://localhost:56989/Ecology.svc/login', 'POST', JSON.stringify({
            Login: document.getElementById('login').value,
            Password: document.getElementById('password').value
        }), function (x) {
            if (x != '{"LoginUserResult":null}') {
                session_key = x;
                user = document.getElementById('login').value;
                answerDiv.innerHTML = 'Welcome, ' + user;
                showDiv(buttonsDiv);
                document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
                document.getElementById('btn_search').addEventListener('click', search, false);
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
        if (document.getElementById('login_new').value != '' && document.getElementById('password_new').value != '' &&
            document.getElementById('email_new').value != '') {
            send('http://localhost:56989/Ecology.svc/create', 'POST', JSON.stringify({
                Login: document.getElementById('login_new').value,
                Password: document.getElementById('password_new').value,
                Email: document.getElementById('email_new').value
            }), function (x) {
                if (x == '{"CreateNewUserResult":-2}') {
                    answerDiv.innerHTML = 'Sorry, this login already exists.';
                }
                else if (x != '{"CreateNewUserResult":-1}' && x != '{"CreateNewUserResult":-2}' && x != '{"CreateNewUserResult":-3}') {
                    user = document.getElementById('login_new').value;
                    answerDiv.innerHTML = 'Welcome, ' + user;
                    showDiv(buttonsDiv);
                    document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
                    //document.getElementById('btn_settings').addEventListener('click', )
                }
                else answerDiv.innerHTML = 'Sorry, some troubles occured.';
            })
        }
        else answerDiv.innerHTML = 'Please, fill in all fields.';
    }

    function showDiv(visibleDivName) {
        visibleDivName.hidden = false;
        for (var i = 0; i < allDivs.length; i++) {
            if (visibleDivName != allDivs[i]) {
                allDivs[i].hidden = true;
            }
        }
    }
    
    function search() {
        showDiv(searchDiv);
        document.getElementById('btn_search_by_time_click').addEventListener('click', search_by_time_click, false);
        document.getElementById('btn_search_by_geoposition_click').addEventListener('click', search_by_geoposition_click, false);
        document.getElementById('btn_search_last_ten_click').addEventListener('click', search_last_ten_click, false);
    }

    function search_last_ten_click() {
        searchDiv.hidden = true;
        var xmlhttp = getXmlHttp();
        xmlhttp.open('GET', 'http://localhost:56989/Ecology.svc/searchlast10', true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    search_last_10.innerHTML = xmlhttp.responseText;
                }
            }
        }; x
        xmlhttp.send(null);
        showDiv(search_last_10);
    }
    function search_by_time_click() {
        showDiv(search_by_time_div);
        document.getElementById('btn_search_by_time').addEventListener('click', search_by_time, false);
    }
    function search_by_time(){
        send('http://localhost:56989/Ecology.svc/search', 'POST', JSON.stringify({
            Accident_Date: Date(document.getElementById('search_time').value),
        }), function (x) {
            var obj = JSON.parse(x);
            var list = [];
            for (var i = 0; i < obj.SearchResult.length; i++) {
                list.push(obj.SearchResult[i]);
                list.push('<br>');
            }
            search_by_time_div_answer.innerHTML = list;
        })
        answerDiv=''
        showDiv(search_by_time_div_answer);
    }

    function search_by_geoposition_click() {
        showDiv(search_by_geoposition_div);
        document.getElementById('btn_search_by_geoposition').addEventListener('click', search_by_geoposition, false);
    }
    function search_by_geoposition() {


    }

    function aboutProgrammClick() {
        showDiv(about_programm_div)
    }
    function aboutAuthorsClick() {
        showDiv(about_authors_div)
    }

} )();