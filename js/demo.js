$(function() {

    facebook.init({
        appId: '1730652670538195', //your app id
        cookie: true, //boolean
        xfbml: true, //boolean
        version: 'v2.2', //version
        scope: 'public_profile, email, user_friends' //your scopes with comma
    }, function(response) {
        showFacebook(response);
    });

    $('.facebook_btn').on('click', function() {
        facebook.login(function(response) {
            console.log(response);
            showFacebook(response);
        });
    });

});


function showFacebook(response) {
    if (response.status) {
        $('.page_login').hide();
        $('.page_google').hide();
        $.get('facebook.html', function(html) {

            html = html.replace(/{{id}}/gi, response.user.id);
            html = html.replace(/{{accessToken}}/gi, response.auth.authResponse.accessToken);
            html = html.replace(/{{name}}/gi, response.user.name);
            html = html.replace(/{{gender}}/gi, response.user.gender);
            html = html.replace(/{{link}}/gi, response.user.link);

            facebook.getFriends(function(friends) {
                var facebook_url = '';
                var friend_html = '';
                friends.data.forEach(function(friend) {
                    var friend_template = '<a class="link_friend" target="_blank" href="https://www.facebook.com/{{id}}">{{name}}</a>';
                    friend_template = friend_template.replace(/{{id}}/gi, friend.id);
                    friend_template = friend_template.replace(/{{name}}/gi, friend.name);
                    friend_html += friend_template;
                });
                console.log(friend_html);
                console.log(html);
                html = html.replace(/{{friends}}/gi, friend_html);
                $('.page_facebook').html(html).show();
                $('.facebook_logout').on('click', function() {
                    facebook.logout(function(response) {
                        $('.page_facebook').hide();
                        $('.page_login').show();
                    });
                });
            });

        });
    }
}
