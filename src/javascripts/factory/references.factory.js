app.factory('refFac', [refFac]);

function refFac() {

    var obj = {}

    obj.ref = function () {
        var ref = new Firebase("https://flickering-inferno-6917.firebaseio.com");
        return ref;
    }

    obj.user_ref = function () {
        var user_ref = new Firebase("https://flickering-inferno-6917.firebaseio.com/users");
        return user_ref;
    }


    obj.restaurant_ref = function () {
        var restaurant_ref = new Firebase("https://flickering-inferno-6917.firebaseio.com/restaurants");
        return restaurant_ref;
    }

    return obj;

}
    