module.exports = function iterate(obj, key){
    var result;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            // in case it is an object
            if (typeof obj[property] === "object") {
                result = iterate(obj[property], key);

                if (typeof result !== "undefined") {
                    return result;
                }
            }
            else if (property === key) {
                return obj[key]; // returns the value
            }
        }   
    }
};