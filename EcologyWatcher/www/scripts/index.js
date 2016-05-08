// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        document.getElementById('btn_get_coords').addEventListener('click', replyClick, false);
        document.getElementById('btn_get_message').addEventListener('click', messageGet, false);
        document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
        document.getElementById('btn_change_page').addEventListener('click', pageChange, false);
    };

    function pageChange() {
        window.open('Login.html');
    }

    function messagePost(xmlHttp) {

        var xmlhttp = getXmlHttp()
        xmlhttp.open('POST', 'http://localhost:56989/Ecology.svc/addwork', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlhttp.send(JSON.stringify({
            "Description": "Everything is very bad",
            "SituationId": "1",
            "Longitude": "55",
            "Latitude": "35",
            "PlaceName": "Moscow"
        }), function (x) {
            console.log(this.responseText);
        });

   //function send(url, method, data, callback) {

   //         var xmlhttp = getXmlHttp()
   //         xmlHttp.onreadystatechange = function () {
   //             if (xmlHttp.readyState == 4) {
   //                 var obj = xmlHttp.responseText;
   //                 if (obj == null || obj == "") {
   //                     //если ничего не вернулось - ошибка
   //                     callback(null);
   //                 }
   //                 else {
   //                     //успешное завершение запроса
   //                     try {
   //                         var result = eval("(" + obj + ")");
   //                         callback(result);
   //                     }
   //                     catch (EX) {
   //                         return (null);
   //                     }
   //                 }
   //             }
   //         }
   //     }
   }

    function messageGet() {
        var xmlhttp = getXmlHttp()
        xmlhttp.open('GET', 'http://localhost:56989/Ecology.svc/work/Hello!', true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var div = document.getElementById('yourDiv');
                    div.innerHTML = xmlhttp.responseText;
                }
            }
        };
        xmlhttp.send(null);
    }

    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
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
        var div = document.getElementById('myDiv');
        div.innerHTML = 'Latitude: ' + position.coords.latitude + '<br/>' + 'Longitude: ' + position.coords.longitude;
    }
    
} )();