var facebook = {}
var facebookData = {
    appId: '',
    cookie: true,
    xfbml: true,
    version: 'v2.2',
    scope: 'public_profile, email, user_friends'
}

facebook.init = function(facebookData, callback) {

    var chain = Q.fcall(function() {});

    chain = chain.then(function() {
        var defer = Q.defer();
        var verification_url = 'http://graph.facebook.com/' + facebookData.appId;
        $.get({
            url: verification_url,
            success: function(data) {
                defer.resolve();
            },
            error: function(err) {
                console.log('This app id is not found or some thing is wrong');
            }
        });
        return defer.promise;
    });

    chain = chain.then(function() {
        window.fbAsyncInit = function() {
            FB.init({
                appId: facebookData.appId,
                cookie: facebookData.cookie,
                xfbml: facebookData.xfbml,
                version: facebookData.version
            });
            facebook.checkLoginState(function(response) {
                callback(response);
            });
        }
    });

    chain = chain.then(function() {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/zh_TW/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });

}

facebook.login = function(callback) {
    FB.login(function(response) {
        facebook.checkLoginState(function(response) {
            callback(response);
        });
    }, {
        scope: facebookData.scope,
        return_scopes: true
    });
}

facebook.logout = function signOut(callback) {
    FB.logout(function(response) {
        callback(response);
    });
}

facebook.checkLoginState = function(callback) {
    FB.getLoginStatus(function(response) {
        facebook.statusChangeCallback(response, function(userData) {
            userData.auth = response;
            callback(userData);
        });
    });
}

facebook.statusChangeCallback = function(response, callback) {

    var chain = Q.fcall(function() {});

    chain = chain.then(function() {
        var userData = {};

        var defer = Q.defer();
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            facebook.userInfo(function(response) {
                userData = {
                    status: true,
                    user: response,
                    msg: 'connected'
                }
                defer.resolve(userData);
            });
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            userData = {
                status: false,
                user: response,
                msg: 'Please log into this app'
            }
            defer.resolve(userData);
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            userData = {
                status: false,
                user: response,
                msg: 'Please log into this Facebook'
            }
            defer.resolve(userData);
        }
        return defer.promise;
    });

    chain = chain.then(function(userData) {
        callback(userData);
    });

}

facebook.userInfo = function(callback) {
    console.log('Fetching your information.... ');
    FB.api('/me', {
        fields: 'id, name, first_name, last_name, age_range, link, gender, locale, picture, timezone, updated_time, verified'
    }, function(response) {
        if (response.error) {
            console.log('Please login your facebook');
        } else {
            console.log('Successful login for: ' + response.name);
        }
        callback(response);
    });
}

facebook.getFriends = function(callback) {
    console.log('Scraching your friends.... ');
    FB.api('/me/friends', function(response) {
        callback(response);
    });
}

// facebook.cognitoFBLogin = function(response, callback) {
//     if (response.authResponse) {
//
//         console.log('You are now logged in.');
//
//         // Add the Facebook access token to the Cognito credentials login map.
//         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//             IdentityPoolId: 'IdentityPoolId',
//             Logins: {
//                 'graph.facebook.com': response.authResponse.accessToken
//             }
//         });
//
//         // Obtain AWS credentials
//         AWS.config.credentials.get(function(err) {
//             // Access AWS resources here.
//             console.log('Obtain AWS credentials');
//             console.log(err);
//             callback(err);
//         });
//
//     } else {
//         console.log('There was a problem logging you in.');
//     }
// }
