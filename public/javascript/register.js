$(document).ready(() => {
    console.log("Register scripted loaded");
})

const registerUser = () => {
    hideAllErrors();
    /*console.log("try to register")
    console.log($("#inputEmail").val())
    console.log($("#inputPassword").val())
    console.log($("#inputFirstName").val())
    console.log($("#inputLastName").val())
    console.log($("#RadioMale:checked").val())
    console.log($("#RadioFemale:checked").val())*/

    let email = $("#inputEmail").val();
    let password = $("#inputPassword").val();
    let firstName = $("#inputFirstName").val();
    let lastName = $("#inputLastName").val()
    let phone = $("#inputPhoneNumber").val()
    let gender = "";
    if ($("#RadioMale:checked").val()) {
        gender = "ชาย"
    }
    if ($("#RadioFemale:checked").val()) {
        gender = "หญิง"
    }
    $.ajax
        ({
            type: "post",
            url: "/api/user/register",
            dataType: 'json',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify({
                "email": email,
                "password": password,
                "firstName": firstName,
                "lastName": lastName,
                "phone": phone,
                "gender": gender
            }),
            success: function (res) {
                console.log(res)
                window.location.href = "/login"
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
    $("#genderError").attr("hidden", "true");
    $("#phoneError").attr("hidden", "true");
    $("#passwordError").attr("hidden", "true");
    $("#firstNameError").attr("hidden", "true");
    $("#lastNameError").attr("hidden", "true");
}