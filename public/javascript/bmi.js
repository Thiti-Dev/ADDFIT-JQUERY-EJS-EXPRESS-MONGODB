$(document).ready(() => {
    console.log("Bmi Scripted Loaded");
})

function calculateBMI() {
    var weight = $("#inputWeight").val();
    var height = $("#inputHeight").val();
    if (weight > 0 && height > 0) {
        var finalBmi = weight / (height / 100 * height / 100)
        console.log("BMI: " + finalBmi)

        updataBMI(finalBmi,height,weight,finalBmi);

        //window.location.href = `/bmiResult/${height}/${weight}/${finalBmi}`
        if (finalBmi < 18.5) {
            //document.bmiForm.meaning.value = "น้ำหนักน้อย / ผอม"
        }
        if (finalBmi > 18.5 && finalBmi < 25) {
            //document.bmiForm.meaning.value = "ปกติ (สุขภาพดี)"
        }
        if (finalBmi > 25) {
            //document.bmiForm.meaning.value = "น้ำหนักเกิน / อ้วน"
        }
    }
    else {
        alert("กรุณากรอกข้อมูลให้ครบ")
    }
}

const updataBMI = (value,h,w,bmi) => {
    $.ajax
        ({
            type: "post",
            url: "/api/user/updateBMI",
            dataType: 'json',
            async: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", getAuthToken());
            },
            data: JSON.stringify({
                "bmi": value,
                "height": h,
                "weight": w
            }),
            success: function (res) {
                console.log(res);
                window.location.href = `/bmiResult/${h}/${w}/${bmi}`
            },
            error: function (err) {
                console.log(err.responseJSON);
            }
        });
}