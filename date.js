

function date() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    }

    let day = today.toLocaleDateString("bn-BD", options);
    return day;
}
module.exports = date;

//module.exports.getDay = getDay;

function getDay() {
    let today = new Date();

    let options = {
        weekday: "long",
    }

    let day = today.toLocaleDateString("bn-BD", options);
    return day;
}