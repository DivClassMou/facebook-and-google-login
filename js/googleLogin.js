var google = {}


google.render = function render() {
    // gapi.signin.render('btn_google_login', {
    //     'callback': 'signinCallback',
    //     'clientid': '325938154683-31h35bfspicc3nsjoqrufa5mpc2mosch.apps.googleusercontent.com',
    //     'cookiepolicy': 'single_host_origin',
    //     'scope': 'https://www.googleapis.com/auth/plus.login'
    // });

    gapi.signin2.render('btn_google_login', {
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

    google.cognitoLogin(googleUser, function(err) {
        if (err) {
            alert(err);
        }
        else {
            alert('哈囉~' + profile.getName());
        }
    });

}

google.logout = function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
        AWS.config.credentials.clearCachedId();
        alert('登出成功');
    });
}

google.cognitoLogin = function cognitoLogin(googleUser, callback) {
    // Add the Google access token to the Cognito credentials login map.
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:1e694170-a34a-413a-9ed5-e6cfea1856bc',
        Logins: {
            'accounts.google.com': googleUser.getAuthResponse().id_token
        }
    });

    // Obtain AWS credentials
    AWS.config.credentials.get(function(err) {
        // Access AWS resources here.
        console.log('Obtain AWS credentials');
        console.log(err);
        callback(err);
    });
}
