$(document).ready(() => {
    console.log("Login scripted loaded");
})

const loginUser = () => {
    hideAllErrors();
    /*console.log("try to register")
    console.log($("#inputEmail").val())
    console.log($("#inputPassword").val())
    console.log($("#inputFirstName").val())
    console.log($("#inputLastName").val())
    console.log($("#RadioMale:checked").val())
    console.log($("#RadioFemale:checked").val())*/

    let email = $("#InputEmail").val();
    let password = $("#InputPassword").val();
    $.ajax
        ({
            type: "post",
            url: "/api/user/login",
            dataType: 'json',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify({
                "email": email,
                "password": password,
            }),
            success: function (res) {
                console.log(res);
                setAuthToken(res.token);
                window.location.href = "/home"
            },
            error: function (err) {
                /*setTimeout(() => {
                    let keys = Object.keys(err.responseJSON)
                    for (const key of keys) {
                        $(`#${key}Error`).removeAttr('hidden');
                        //console.log(key)
                    }                   
                }, 2000);*/
                let keys = Object.entries(err.responseJSON);
                for (const [objectName, data] of keys) {
                    $(`#${objectName}Error`).removeAttr('hidden');
                    $(`#${objectName}Error`).text(data);
                    //console.log(`There are ${data} ${fruit}`)
                }
                console.log(err.responseJSON);
            }
        });
    //$("$inputEmail").val();
}

const hideAllErrors = () => {
    console.log("try to hide");
    $("#emailError").attr("hidden", "true");
    $("#passwordError").attr("hidden", "true");
}