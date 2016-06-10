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
    var settings_div = document.getElementById('settings_div');
    var update_news_div = document.getElementById('update_news_div');
    var change_password_div = document.getElementById('change_password_div');
    var change_email_div = document.getElementById('change_email_div');
    var update_menu_div = document.getElementById('update_menu_div');
    var update_news_div = document.getElementById('update_news_div');
    var change_relevance_div = document.getElementById('change_relevance_div');
    var allDivs = [startDiv, signUpDiv, signInDiv, buttonsDiv, newMessageDiv, searchDiv, search_by_time_div, search_last_10, search_by_time_div_answer, search_by_geoposition_div, about_programm_div, about_authors_div, update_news_div, settings_div, change_password_div, change_email_div, update_menu_div, update_news_div, change_relevance_div];
   
    var situations = document.getElementById('situations');
    var relevance = document.getElementById('relevance');
    var relevance_update = document.getElementById('relevance_update');
    var user;
    var coordinates;
    var place;
    var session_key;
    var tempCheckBox;
    var tempInput;
    var tempDataList;

    function onDeviceReady() {
        answerDiv.innerHTML = '';
        coordinates = null;
        user = null;
        session_key = 0;
        showDiv(startDiv);
        document.getElementById('btn_sign_in').addEventListener('click', signInClick, false);
        document.getElementById('btn_sign_up').addEventListener('click', signUpClick, false);
        document.getElementById('btn_about_programm').addEventListener('click', aboutProgrammClick, false);
        document.getElementById('btn_about_authors').addEventListener('click', aboutAuthorsClick, false);
    };

    function addressPredict() {
        var input = document.getElementById(tempInput).value;
        var xmlhttp = getXmlHttp();
        var request = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + input +
            '&types=address&language=en&key=AIzaSyA5u_V-AjoMQPWLoRE3lNQXcb-AWDxGUf4';
        xmlhttp.open('GET', request, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    var mas = obj.predictions;
                    var str = '';
                    for (var i = 0; i < mas.length; i++) {
                        str += '<option value="' + mas[i].description + '" />';
                    }
                    document.getElementById(tempDataList).innerHTML = str;
                }
            }
        };
        xmlhttp.send(null);
    };

    function messagePost() {
        answerDiv.innerHTML = '';
        showDiv(newMessageDiv);
        tempCheckBox = 'check_box_GPS';
        tempInput = 'addressInputText';
        tempDataList = 'addressInput';

        document.getElementById('addressInputText').addEventListener('input', addressPredict, false);
        document.getElementById('check_box_GPS').addEventListener('change', selectGpsOrAddress, false);
        document.getElementById('check_box_GPS').addEventListener('change', getPosition, false);
        document.getElementById('btn_submit').addEventListener('click', sendMessage, false);
        document.getElementById('btn_back_from_new_message').addEventListener('click', mainWindow, false);
    };

    function selectGpsOrAddress() {
        if (document.getElementById(tempCheckBox).checked == true) {
            document.getElementById(tempInput).disabled = true;
        }
        else {
            document.getElementById(tempInput).disabled = false;
        }
    };

    function locationByAddress() {
        coordinates = [];
        var xmlhttp = getXmlHttp();
        var address = document.getElementById(tempInput).value;
        var str = address.replace(/ /g, "");
        var request = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + str +
            '&key=AIzaSyA5u_V-AjoMQPWLoRE3lNQXcb-AWDxGUf4';
        xmlhttp.open('GET', request, false);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    coordinates = [obj.results[0].geometry.location.lat, obj.results[0].geometry.location.lng];
                }
            }
        };
        xmlhttp.send(null);
    };
    
    function addressByLocation() {
        var xmlhttp = getXmlHttp();
        var request = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordinates[0] + ',' + coordinates[1] + '&key=AIzaSyA5u_V-AjoMQPWLoRE3lNQXcb-AWDxGUf4';
        xmlhttp.open('GET', request, false);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    if (obj.results[0].formatted_address == null) {
                        place = '';
                    } else place = obj.results[0].formatted_address;
                }
            }
        };
        xmlhttp.send(null);
    };

    function sendMessage() {
        if (!document.getElementById(tempCheckBox).checked && document.getElementById(tempInput).value != null) {
            place = document.getElementById(tempInput).value;
            locationByAddress();
        }
        else if (document.getElementById(tempCheckBox).checked) {
            addressByLocation();
        };

        var relation;
        if (document.getElementById('rad_like').checked) {
            relation = 1;
        } else if (document.getElementById('rad_dislike').checked) {
            relation = 2;
        }
        if (coordinates.length == 2 && place != null && document.getElementById('radius').value != null &&
            document.getElementById('date').value != "" && relation != null) {

            var temp = document.getElementById('situations');
            var request = 'http://localhost:56989/Ecology.svc/addwork/' + session_key;
            send(request, 'POST', JSON.stringify({
                Description: document.getElementById('description').value,
                SituationId: situations.selectedIndex,
                Longitude: coordinates[1],
                Latitude: coordinates[0],
                PlaceName: place,
                Accident_Date: document.getElementById('date').value,
                Radius: document.getElementById('radius').value,
                Relation: relation,
                ActualStatus: relevance.selectedIndex
            }), function (x) {
                var obj = JSON.parse(x);
                if (obj.NewMessageResult > 0) {
                    showDiv(buttonsDiv);
                    answerDiv.innerHTML = 'Thank you for your message!';
                }
                else if (obj.NewMessageResult < 0) {
                    answerDiv.innerHTML = 'Sorry, your message was not added correctly. Please, try again.';
                } else {
                    answerDiv.innerHTML = 'Error.';
                }
            })
        }
        else {
            answerDiv.innerHTML = 'Please, check your input.';
        }
    };

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
    };

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
    };

    function getPosition(callback) {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(function (position) {
            if (document.getElementById(tempCheckBox).checked) {
                coordinates = [position.coords.latitude, position.coords.longitude];
            }
            else {
                coordinates = [];
            }
            callback(coordinates);
        });
    };

    function signInClick() {
        showDiv(signInDiv);

        document.getElementById('btn_submit_sign_in').addEventListener('click', signIn, false);
        document.getElementById('btn_back_from_sign_in').addEventListener('click', onDeviceReady, false);
    };

    function signIn() {
        send('http://localhost:56989/Ecology.svc/login', 'POST', JSON.stringify({
            Login: document.getElementById('login').value,
            Password: document.getElementById('password').value
        }), function (x) {
            var temp = JSON.parse(x);
            session_key = temp.LoginUserResult;

            if (session_key == "Wrong login or password!")
                answerDiv.innerHTML = "Wrong login or password!";
            else if ((session_key== "Error!") || (session_key == null))
                answerDiv.innerHTML = "Error!";
            else
            {
                user = document.getElementById('login').value;
                answerDiv.innerHTML = 'Welcome, ' + user;
                showDiv(buttonsDiv);
                document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
                document.getElementById('btn_update_menu').addEventListener('click', updateNewsClick, false);
                document.getElementById('btn_search').addEventListener('click', search, false);
                document.getElementById('btn_settings').addEventListener('click', settingsClick, false);
                document.getElementById('btn_back_from_menu').addEventListener('click', onDeviceReady, false);       
            }
        })
    };

    function signUpClick() {
        showDiv(signUpDiv);
        document.getElementById('btn_submit_sign_up').addEventListener('click', signUp, false);
        document.getElementById('btn_back_from_sign_up').addEventListener('click', onDeviceReady, false);
    };

    function signUp() {
        if (document.getElementById('login_new').value != '' && document.getElementById('password_new').value != '' &&
            document.getElementById('email_new').value != '') {
            send('http://localhost:56989/Ecology.svc/create', 'POST', JSON.stringify({
                Login: document.getElementById('login_new').value,
                Password: document.getElementById('password_new').value,
                Email: document.getElementById('email_new').value
            }), function (x) {
                var temp = JSON.parse(x);
                var result = temp.CreateNewUserResult;
                if (result == 2)
                {
                    answerDiv.innerHTML = 'Sorry, this login already exists.';
                }
                else if (result == 1)
                {
                    showDiv(signInDiv);
                    answerDiv.innerHTML = 'Registered, now you need to sign in.';
                    document.getElementById('btn_submit_sign_in').addEventListener('click', signIn, false);
                    document.getElementById('btn_back_from_sign_in').addEventListener('click', onDeviceReady, false);
                }
                else 
                {
                    answerDiv.innerHTML = 'Error!';
                }
            })
        }
        else answerDiv.innerHTML = 'Please, fill in all fields.';
    };

    function showDiv(visibleDivName) {
        visibleDivName.hidden = false;
        for (var i = 0; i < allDivs.length; i++) {
            if (visibleDivName != allDivs[i]) {
                allDivs[i].hidden = true;
            }
        }
    };
    
    function search() {
        answerDiv.innerHTML = '';
        showDiv(searchDiv);
        document.getElementById('btn_search_by_time_click').addEventListener('click', search_by_time_click, false);
        document.getElementById('btn_search_by_geoposition_click').addEventListener('click', search_by_geoposition_click, false);
        document.getElementById('btn_search_last_ten_click').addEventListener('click', search_last_ten_click, false);
        document.getElementById('btn_back_from_search').addEventListener('click', mainWindow, false);
    };

    function search_last_ten_click() {
        send('http://localhost:56989/Ecology.svc/searchlast10/' + session_key,
            'GET', null, function (_x) {
                var obj = JSON.parse(_x);
                var list = [];
                for (var i = 0; i < obj.Search10Result.length; i++) {
                    list.push(obj.Search10Result[i]);
                    list.push('<br>');
                }
                search_last_10.innerHTML = list.reduce(function (s, x) {
                    return s + x;
                }, "");

            });

        showDiv(search_last_10);
        answerDiv.innerHTML = '<button id="back_from_search10">Back</button>';
        document.getElementById('back_from_search10').addEventListener('click', search, false);
    };

    function search_by_time_click() {
        showDiv(search_by_time_div);
        document.getElementById('btn_search_by_time').addEventListener('click', search_by_time, false);
        document.getElementById('back_from_search_by_time').addEventListener('click', search, false);
    }

    function search_by_time() {
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
        answerDiv = '';
        showDiv(search_by_time_div_answer);
    };

    function search_by_geoposition_click() {
        showDiv(search_by_geoposition_div);
        tempCheckBox = 'check_box_GPS2';
        tempInput = 'address_search_input';
        tempDataList = 'address_search';

        document.getElementById('btn_search_by_geoposition').addEventListener('click', search_by_geoposition, false);
        document.getElementById('btn_back_from_search_geo').addEventListener('click', search, false);
        document.getElementById(tempInput).addEventListener('input', addressPredict, false);
        document.getElementById(tempCheckBox).addEventListener('change', selectGpsOrAddress, false);
        document.getElementById(tempCheckBox).addEventListener('change', getPosition, false);
    };

    function search_by_geoposition() {
        if (!document.getElementById(tempCheckBox).checked && document.getElementById(tempInput).value != null) {
            place = document.getElementById(tempInput).value;
            locationByAddress();
        } else if (document.getElementById(tempCheckBox).checked) {
            addressByLocation();
        };
        if (coordinates.length == 2 && place != null) {
            var request = 'http://localhost:56989/Ecology.svc/searchgeo';
            send(request, 'POST', JSON.stringify({
                Position_Lat: coordinates[0],
                Position_Long: coordinates[1],
                Address: place,
                Radius: 1
            }), function (_x) {
                var obj = JSON.parse(_x);
                if (obj.SearchGeoResult != null) {
                    var list = [];
                    for (var i = 0; i < obj.SearchGeoResult.length; i++) {
                        list.push(obj.SearchGeoResult[i]);
                        list.push('<br>');
                    }
                    answerDiv.innerHTML = list.reduce(function (s, x) {
                        return s + x;
                    }, "");
                    showDiv('none');
                } else {
                    answerDiv.innerHTML = 'Sorry, there are no accidents there.';
                }
            });
        } else {
            answerDiv.innerHTML = 'Error';
        }
    };

    function aboutProgrammClick() {
        showDiv(about_programm_div);
        document.getElementById('btn_back_from_about_programm').addEventListener('click', onDeviceReady, false);
    };

    function aboutAuthorsClick() {
        showDiv(about_authors_div);
        document.getElementById('btn_back_from_about_authors').addEventListener('click', onDeviceReady, false);
    };

    function updateNewsClick() {
        answerDiv.innerHTML = '';
        showDiv(update_menu_div);
        document.getElementById('btn_update_news').addEventListener('click', updateClick, false);
        document.getElementById('btn_change_relevance_click').addEventListener('click', changeRelevanceClick, false);
        document.getElementById('btn_back_from_change_relevance_click').addEventListener('click', mainWindow, false);
    };

    function updateClick() {
        answerDiv.innerHTML = '';
        showDiv(update_news_div);
        document.getElementById('btn_update').addEventListener('click', update, false);
        document.getElementById('btn_back_from_update').addEventListener('click', mainWindow, false);
    };

    function update() {
        var acc_id = document.getElementById('accident_id_input_update').value;
        var rad = document.getElementById('radius_update').value;
        var desc = document.getElementById('description_update').value;
        var dat = document.getElementById('date_update').value;
        var rel;
        if (document.getElementById('rad_like_update').checked) {
            rel = 1;
        } else if (document.getElementById('rad_dislike_update').checked) {
            rel = 2;
        }
        var request = 'http://localhost:56989//Ecology.svc/addnews';
        send(request, 'POST', JSON.stringify({
            Accident_Id: acc_id,
            Radius: rad,
            Description: desc,
            Accident_Date: dat,
            Relation: rel
        }), function (x) {
            var temp = JSON.parse(x);
            var result = temp.AddNewsResult;
            if (result == 1)
            {
                answerDiv.innerHTML = 'Thank you for update!';
            }
            else if (result == 2) {
                answerDiv.innerHTML = 'Such accident does not exist in the database!';
            }
            else {
                answerDiv.innerHTML = 'Error!';
            }
        })
    };

    function settingsClick() {
        answerDiv.innerHTML = '';
        showDiv(settings_div);
        document.getElementById('btn_change_password_click').addEventListener('click', changePasswordClick, false);
        document.getElementById('btn_change_email_click').addEventListener('click', changeEmailClick, false);
        document.getElementById('btn_back_from_settings').addEventListener('click', mainWindow, false);
    };

    function changePasswordClick() {
        showDiv(change_password_div);
        document.getElementById('btn_update_password').addEventListener('click', changePassword, false);
        document.getElementById('btn_back_from_upd_password').addEventListener('click', settingsClick, false);
    };

    function changePassword() {
        var request = 'http://localhost:56989/Ecology.svc/newpassword/' + session_key;
        send(request, 'POST', JSON.stringify({
            OldPassword: document.getElementById('old_password_input').value,
            NewPassword: document.getElementById('new_password_input').value,
            ConfirmedPassword: document.getElementById('new_password_confirm_input').value
        }), function (x) {
            var temp = JSON.parse(x);
            var result = temp.ChangePasswordResult;
            if (result == 1) {
                answerDiv.innerHTML = "Your password has been changed!";
            }
            else if (result == 2) {
                answerDiv.innerHTML = "Passwords do not match!";
            }
            else if (result == 3) {
                answerDiv.innerHTML = "Wrong password!";
            }
            else
                answerDiv = "Error!";
            document.getElementById('btn_back_from_everywhere').addEventListener('click', mainWindow, false);
        })
    };

    function changeEmailClick() {
        showDiv(change_email_div);
        document.getElementById('btn_update_email').addEventListener('click', changeEmail, false);
        document.getElementById('btn_back_from_upd_email').addEventListener('click', settingsClick, false);
    };

    function changeEmail() {
        var request = 'http://localhost:56989/Ecology.svc/newemail/' + session_key;
        send(request, 'POST', JSON.stringify({
            NewEmail: document.getElementById('new_email_input').value
        }), function (x) {
            var temp = JSON.parse(x);
            var result = temp.ChangeEmailResult;
            if (result == 1)
                answerDiv.innerHTML = "Your email has been changed!";
            else
                answerDiv = "Error!";
        })
    };

    function changeRelevanceClick() {
        showDiv(change_relevance_div);
        document.getElementById('btn_update_relevance').addEventListener('click', changeRelevance, false);
        document.getElementById('btn_back_from_relevance').addEventListener('click', mainWindow, false);
    }

    function changeRelevance() {
        var request = 'http://localhost:56989/Ecology.svc/newrelevance/' + session_key;
        send(request, 'POST', JSON.stringify({
            AccidentId: document.getElementById('relevance_accident_id_input').value,
            Relevance: document.getElementById('relevance_update').value
        }), function (x) {
            var temp = JSON.parse(x);
            var result = temp.ChangeRelevanceResult;
            if (result == 1)
                answerDiv.innerHTML = "Relevance has been changed!";
            else
                answerDiv = "Error!";
        })
    }

    function mainWindow() {
        answerDiv.innerHTML = 'Welcome, ' + user;
        showDiv(buttonsDiv);
        document.getElementById('btn_post_message').addEventListener('click', messagePost, false);
        document.getElementById('btn_update_menu').addEventListener('click', updateMenuClick, false);
        document.getElementById('btn_search').addEventListener('click', search, false);
        document.getElementById('btn_settings').addEventListener('click', settingsClick, false);
        document.getElementById('btn_back_from_menu').addEventListener('click', onDeviceReady, false);
    }
} )();