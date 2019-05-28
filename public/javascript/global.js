$(document).ready(() => {
    console.log("Global scripted loaded");

    $("form").click(function (event) {
        //event.preventDefault();
    });

    if (window.location.pathname !== '/' && window.location.pathname !== '/register' && window.location.pathname !== '/login'){
        console.log("Smooth Check Authenticated");
        let decoded;
        try {
            let stillAlive = true;

            decoded = parseJwt(getAuthToken());
            console.log(decoded);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                console.log("Expired")
                removeAuthToken();
                stillAlive = false;
            }
            if (stillAlive) {
                //check if user still exist on database
                $.ajax
                    ({
                        type: "get",
                        url: "/api/user/current",
                        async: true,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", getAuthToken());
                        },
                        success: function (res) {
                            console.log(res);
                            $("#profileNavbar").attr("src", res.profilePicture);
                            $(".se-pre-con").fadeOut("slow");;
                        },
                        error: function (err) {
                            console.log(err.status)
                            if (err.status === 401) {
                                removeAuthToken();
                                window.location.href = "/"
                            }
                        }
                    });
            }
            else{
                window.location.href = "/"
            }
        }
        catch (err) {
            console.log("not valid token")
            window.location.href = "/"
        }
    }else{
        let decoded;
        try {
            let stillAlive = true;

            decoded = parseJwt(getAuthToken());
            console.log(decoded);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                console.log("Expired")
                removeAuthToken();
                stillAlive = false;
            }
            if (stillAlive) {
                //check if user still exist on database
                $.ajax
                    ({
                        type: "get",
                        url: "/api/user/current",
                        async: true,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", getAuthToken());
                        },
                        success: function (res) {
                            console.log(res);
                            window.location.href = "/home";
                        },
                        error: function (err) {
                            console.log(err.status)
                            if (err.status === 401) {
                                removeAuthToken();
                                //window.location.href = "/"
                            }
                            $(".se-pre-con").fadeOut("slow");;
                        }
                    });
            }
        }
        catch (err) {
            console.log("not valid token")
            $(".se-pre-con").fadeOut("slow");;
        }        
    }

    //$(".se-pre-con").fadeOut("slow");;
})

const goToPage = (page) => {
    window.location.href = page;
}

//Authentication
const setAuthToken = (token) => {
    localStorage.setItem('token', token);
}

const getAuthToken = () => {
    return localStorage.getItem('token');
}

const removeAuthToken = () => {
    localStorage.removeItem('token');
    location.reload();
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
};