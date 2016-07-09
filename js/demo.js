$(function() {

    facebook.init({
        appId: '1730652670538195', //your app id
        cookie: true, //boolean
        xfbml: true, //boolean
        version: 'v2.2', //version
        scope: 'public_profile, email, user_friends' //your scopes with comma
    }, function(response) {
        if (response.status) {
            showFacebook(response);
        }
    });

    $('.facebook_btn').on('click', function() {
        facebook.login(function(response) {
            showFacebook(response);
        });
    });

});


function showFacebook(response) {
    $('.page_login').hide();
    $('.page_google').hide();
    $.get('facebook.html', function(html) {
        html = html.replace(/{{id}}/gi, response.user.id);
        html = html.replace(/{{accessToken}}/gi, response.auth.authResponse.accessToken);
        html = html.replace(/{{name}}/gi, response.user.name);
        html = html.replace(/{{gender}}/gi, response.user.gender);
        html = html.replace(/{{link}}/gi, response.user.link);
        $('.page_facebook').html(html).show();
        $('.facebook_logout').on('click', function() {
            facebook.logout(function(response) {
                $('.page_facebook').hide();
                $('.page_login').show();
            });
        });
    });
}
