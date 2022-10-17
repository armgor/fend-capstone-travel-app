/**
 * Function to validate date formats and values
 */
function isDateValid(tripDate='') {
    var res = tripDate.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (res === null)
        return false;
    else
        return true;
}

function isDateInPast(startDate=new Date('2022-01-01'), endDate=new Date()) {
    if (startDate - endDate < 0)
        return true;
    else
        return false;
}

function daysBetweenDates(startDate=new Date('2022-01-01'), endDate=new Date('2022-01-01')) {
    return Math.round((endDate-startDate)/(1000*60*60*24));
}



export { isDateInPast, isDateValid, daysBetweenDates}