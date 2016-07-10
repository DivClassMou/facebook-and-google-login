var google = {}


google.init = function init(clientId) {
    var googleSignInMeta = '<meta name="google-signin-client_id" content="{{clientId}}">';
    var googlePlatformJs = '<script src="https://apis.google.com/js/platform.js?onload=signInCallback" async defer></script>';
    googleSignInMeta = googleSignInMeta.replace(/{{clientId}}/gi, clientId);
    $('head').append(googleSignInMeta).append(googlePlatformJs);
    // console.log('google sign in init success');

    // $('head').append(googlePlatformJs);
}

function signInCallback() {
    // gapi.auth2.getAuthInstance({
    //     client_id: clientId,
    //     scope: 'profile'
    // });

    gapi.signin2.render('google_btn', {
        'onsuccess': 'onSignIn',
        // 'scope': 'openid profile email'
        'scope': 'https://www.googleapis.com/auth/plus.me'
    });
}


google.render = function render() {
    // gapi.signin.render('btn_google_login', {
    //     'callback': 'signinCallback',
    //     'clientid': '325938154683-31h35bfspicc3nsjoqrufa5mpc2mosch.apps.googleusercontent.com',
    //     'cookiepolicy': 'single_host_origin',
    //     'scope': 'https://www.googleapis.com/auth/plus.login'
    // });

    gapi.signin2.render('google_btn', {
        'onsuccess': 'onSignIn',
        // 'scope': 'openid profile email'
        'scope': 'https://www.googleapis.com/auth/plus.me'
    });
}
window.onLoadCallback = function() {
    // gapi.auth2.init({
    //     client_id: 'filler_text_for_client_id.apps.googleusercontent.com'
    // });
    gapi.signin2.render('google_btn', {
        'onsuccess': 'onSignIn',
        // 'scope': 'openid profile email'
        'scope': 'https://www.googleapis.com/auth/plus.me'
    });
}

function onSignIn(googleUser) {
    console.log(googleUser);
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());

    // google.cognitoLogin(googleUser, function(err) {
    //     if (err) {
    //         alert(err);
    //     }
    //     else {
    //         alert('哈囉~' + profile.getName());
    //     }
    // });

}

google.logout = function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
        // AWS.config.credentials.clearCachedId();
        alert('登出成功');
    });
}

// google.cognitoLogin = function cognitoLogin(googleUser, callback) {
//     // Add the Google access token to the Cognito credentials login map.
//     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//         IdentityPoolId: 'us-east-1:1e694170-a34a-413a-9ed5-e6cfea1856bc',
//         Logins: {
//             'accounts.google.com': googleUser.getAuthResponse().id_token
//         }
//     });
//
//     // Obtain AWS credentials
//     AWS.config.credentials.get(function(err) {
//         // Access AWS resources here.
//         console.log('Obtain AWS credentials');
//         console.log(err);
//         callback(err);
//     });
// }
