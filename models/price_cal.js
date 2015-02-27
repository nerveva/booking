
module.exports = function(policy, startTime, datetime) {
    cJson = JSON.parse(policy);
    return cJson.base_price;
}
