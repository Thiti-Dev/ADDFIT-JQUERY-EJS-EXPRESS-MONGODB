$(document).ready(() => {
    console.log("Profile script loaded");
    //Check if token is valid
    let decoded;
    try{
        decoded = parseJwt(getAuthToken());
        console.log(decoded);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.log("Expired");
            removeAuthToken();
        }
        $.ajax
            ({
                type: "get",
                url: "/api/user/getProfileData",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", getAuthToken());
                },
                success: function (res) {
                    console.log(res);
                    $("#outputFirstName").val(res.firstName);
                    $("#outputLastName").val(res.lastName);
                    $("#outputSex").val(res.gender);
                    $("#outputPhoneNumber").val(res.phone);
                    $("#outputHeight").val(res.height);
                    $("#outputWeight").val(res.weight);
                    $("#profilePic").attr("src", res.profilePicture);
                },
                error: function (err) {
                    console.log(err.status)
                    if (err.status === 401){
                        removeAuthToken();
                        window.location.href = "/"
                    }
                }
            });
    }
    catch(err){
        console.log("not valid token")
    }
    //console.log(decoded);
    /*const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        console.log("Expired")
    }*/

    $('#uploadBtn').on('click', function () {
        $.ajax({
            // Your server script to process the upload
            url: '/upload',
            type: 'POST',

            // Form data
            data: new FormData($('form')[0]),

            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,

            // Custom XMLHttpRequest
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", getAuthToken());
            },
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            $(`progress`).removeAttr('hidden');
                            $('progress').attr({
                                value: e.loaded,
                                max: e.total,
                            });
                        }
                    }, false);
                }
                return myXhr;
            },
            success: function (res) {
                console.log(res)

                setTimeout(() => {
                    $("progress").attr("hidden", "true");
                    $("progress").attr("value", "0");
                    $("#profilePic").attr("src", res.pathFixed);
                    $("#profileNavbar").attr("src", res.pathFixed);
                }, 1000);
            },
            error: function (err) {
                console.log(err.responseJSON);
            }
        });
        console.log("tryna upload")
    });
})