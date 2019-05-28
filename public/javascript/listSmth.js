$(document).ready(() => {
    console.log("Everything is fine");

})

const onBuyCar = element => {
    //console.log(`Car name : ${carname}`);
    console.log(element.getAttribute('idOfThis'));
    console.log(element.getAttribute("whichCar"));
    $(element).parent().parent().remove();
};