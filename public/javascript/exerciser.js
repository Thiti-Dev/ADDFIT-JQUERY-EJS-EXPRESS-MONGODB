$(document).ready(() => {
    console.log("Exerciser Scripted loaded");
})

const inspectProfile = profileName => {
    console.log(profileName);
    window.location.href = `/profile/${profileName}`
}