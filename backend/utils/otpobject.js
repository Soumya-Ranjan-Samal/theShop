let phoneOtps = {}
let emailOtps = {}

function getOtp(){
    return Math.floor(Math.random()*10) * 1000 + Math.floor(Math.random()*10) * 100 + Math.floor(Math.random()*10) * 10 + Math.floor(Math.random()*10);
}

export { phoneOtps, emailOtps, getOtp}