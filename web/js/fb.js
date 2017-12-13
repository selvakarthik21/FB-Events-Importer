function changeProfilePicture(a) {
    if (a = a || {}, null != a.name) {
        var b = a.picture || {},
            c = b.data || {},
            d = c.url || "",
            e = '<div class="dropdown-toggle" data-toggle="dropdown"><img src="' + d + '" alt="' + a.name + '" class="img-responsive img-circle"><span class="profileName">' + a.name + '</span>\t<i class="glyphicon glyphicon-chevron-down"></i></div><ul class="dropdown-menu">\t <li><a href="javascript:void(0);" class="logout-button dropdown"> Sign Out </a></li> </ul>';
        $(".fbSignInBtn").html(e)
    }
}

function loginToFB(a) {
    FB.login(function(b) {
        FB.api("/me", "GET", {
            fields: "name,picture"
        }, changeProfilePicture), a = a || {}, a.caption && postEventInFB(a)
    })
}

function logoutFromFB() {
    FB.logout(function(a) {
        console.log(a);
        var b = '<a href="#"><i class="fa fa-facebook" aria-hidden="true"></i> Login</a>';
        $(".fbSignInBtn").html(b)
    })
}

function statusChangeCallback(a) {
    console.log("statusChangeCallback"), console.log(a);
    var b = document.getElementById("search").value || defaultLocation,
        c = document.getElementById("map-canvas"),
        d = new google.maps.Geocoder,
        e = $('input[name="selectType"]:checked').val();
    "unknown" === a.status ? FB.api("/me", "GET", {
        fields: "name,picture"
    }, changeProfilePicture) : devMod || loginToFB(), geocodeAddress(b, e, d, c)
}

function checkLoginState() {
    $(".event-list").html('<div id="loader"></div>'), $("#NavTab").empty(), devMod ? statusChangeCallback({}) : FB.getLoginStatus(function(a) {
        statusChangeCallback(a)
    })
}

function searchPlaces(a) {
    a = a || defaultLocation;
    try {
        console.log(FB)
    } catch (a) {
        wait(5e3)
    }
    var b = $('input[name="selectType"]:checked').val();
    if (null != FB.getAccessToken()) FB.api("/search", "GET", {
        q: a,
        type: b,
        fields: "id,name,fan_count, picture, location, likes,checkins,category_list",
        limit: resultsLimit
    }, function(b) {
        document.getElementById("search").value = a, addPlaces(b)
    });
    else {
        var c = "";
        $.when(getAccessToken()).done(function(d) {
            if (null != d) {
                c = d.replace("access_token=", "");
                var e = placesUrlConstant.replace("--access_token--", c);
                e = e.replace("--selectType--", b), $.ajax({
                    url: e + a,
                    success: addPlaces,
                    complete: function() {
                        $("#loader").html(noDataAvailable()).removeAttr("id")
                    }
                })
            }
        })
    }
}

function paginateItems(a) {
    $(".event-list").html('<div id="loader"></div>'), $("#NavTab").empty(), $.ajax({
        url: a,
        success: addPlaces,
        complete: function() {
            $("#loader").html(noDataAvailable()).removeAttr("id")
        }
    })
}

function getAccessToken() {
    return $.ajax({
        url: "https://graph.facebook.com/oauth/access_token?client_id=1653877898269397&client_secret=f7edfc0bf06215fbf43fc1bba90a2942&grant_type=client_credentials"
    })
}

function wait(a) {
    for (var b = (new Date).getTime(), c = b; c < b + a;) c = (new Date).getTime()
}

function getSeletedItemDetails(a, b) {
    if (null != FB.getAccessToken()) FB.api("/" + b, "GET", {
        fields: "id,name,checkins,category_list,description,location,business,hours,website,link,cover"
    }, function(b) {
        showItemDetails(a, b)
    });
    else {
        var c = "";
        $.when(getAccessToken()).done(function(d) {
            if (null != d) {
                c = d.replace("access_token=", ""), console.log(c);
                var e = itemDetailConstant.replace("--access_token--", c);
                e = e.replace("--id--", b), $.ajax({
                    url: e,
                    success: function(b) {
                        showItemDetails(a, b)
                    }
                })
            }
        })
    }
}

function getEventsByLocation(a) {
    var b = new google.maps.Geocoder;
    b.geocode({
        address: a
    }, function(b, c) {
        if (c === google.maps.GeocoderStatus.OK) {
            var d = getDates();
            if (d.searchValue = a, console.log(b[0], d), null != FB.getAccessToken()) d.access_token = FB.getAccessToken(), getEvents(d);
            else {
                var e = "";
                $.when(getAccessToken()).done(function(a) {
                    null != a && (e = a.replace("access_token=", ""), d.access_token = e, getEvents(d))
                })
            }
        }
    })
}

function formateDate(a) {
    a = a || new Date;
    var b = "";
    try {
        var c = a.getMonth() + 1,
            d = a.getDate();
        c = 10 > c ? "0" + c : c, d = 10 > d ? "0" + d : d, b = a.getFullYear() + "-" + c + "-" + d
    } catch (a) {
        console.log(a), b = ""
    }
    return b
}

function getEvents(a) {
    var d = (((new Date).getTime() / 1e3).toFixed(), 0),
        g = "https://graph.facebook.com/v2.5/search?type=page&limit=1000&fields=id&q=" + a.searchValue + "&access_token=" + a.access_token,
        h = "https://graph.facebook.com/v2.5/search?type=place&limit=1000&fields=id&q=" + a.searchValue + "&access_token=" + a.access_token,
        i = formateDate(a.startTime),
        j = formateDate(a.endTime);
    $.when($.get(h), $.get(g)).then(function(a, b) {
        var c = a[0].data || [],
            e = b[0].data || [];
        $.merge(c, e);
        var f = [],
            h = c || [];
        return d = h.length, h.forEach(function(a, b, c) {
            f.push(a.id)
        }), f
    }).then(function(b) {
        var c = [];
        return b.forEach(function(b, d, e) {
            c.push("https://graph.facebook.com/v2.5/" + b + "/events?fields=place,owner,ticket_uri,attending_count,id,name,start_time,end_time,declined_count,interested_count,maybe_count,description,cover&since=" + i + "&untill=" + j + "&access_token=" + a.access_token)
        }), c
    }).then(function(a) {
        var b = a.length,
            c = [],
            d = 0;
        console.log(a.length);
        var e = (new Date).getTime();
        $.each(a, function(a, f) {
            $.ajax({
                url: f,
                cache: !0,
                success: function(a) {
                    a = a || {};
                    var b = a.data;
                    null != b && $.merge(c, b)
                },
                complete: function() {
                    d++, d == b && (console.log((new Date).getTime() - e), processAllData(c, e, j))
                }
            })
        })
    })
}

function processAllData(a, b, c) {
    cachedResponse = a;
    var d = new Date(b);
    d.setHours(0, 0, 0, 0);
    var e = new Date(c);
    e.setHours(23, 59, 59, 999);
    var f = d.getTime(),
        g = e.getTime(),
        h = [],
        i = [];
    $.each(a, function(a, b) {
        var c = null != b.start_time ? new Date(b.start_time) : d,
            j = null != b.end_time ? new Date(b.end_time) : e,
            l = b.place || {},
            m = l.location,
            n = i.indexOf(b.id) == -1;
        try {
            null != m && n && (c.getTime() >= f && c.getTime() <= g || c.getTime() < f && j.getTime() >= g) && (h.push(b), i.push(b.id))
        } catch (a) {}
    });
    var j = "",
        k = $("#suggestions").val();
    "attending" == k ? j = "attending_count" : "score" == k && (j = "interested_count"), h = h.sort(function(a, b) {
        return b[j] > a[j] ? 1 : b[j] < a[j] ? -1 : 0
    }), addEvents(h)
}

function postEventInFB(a) {
    FB.api("/me/feed/", "post", a, function(b) {
        b ? b.error ? 2500 == b.error.code ? loginToFB(a) : alert(b.error.message) : console.log("Published to stream") : alert("An error occured while posting the event... Please try again later")
    })
}
var resultsLimit = 30,
    placesUrlConstant = "https://graph.facebook.com/v2.5/search?fields=id,fan_count,name,picture,location,likes,checkins,category_list&limit=" + resultsLimit + "&type=--selectType--&access_token=--access_token--&q=",
    itemDetailConstant = "https://graph.facebook.com/v2.5/--id--?access_token=--access_token--&fields=id,fan_count,name,location,checkins,category_list,description,business,hours,website,link,cover",
    devMod = !1,
    lastSavedSearch, cachedResponse = [];
window.fbAsyncInit = function() {
        FB.init({
            appId: "1653877898269397",
            cookie: !0,
            xfbml: !0,
            version: "v2.5"
        }), devMod || FB.getLoginStatus(function(a) {
            statusChangeCallback(a)
        })
    },
    function(a, b, c) {
        var d, e = a.getElementsByTagName(b)[0];
        a.getElementById(c) || (d = a.createElement(b), d.id = c, d.src = "http://connect.facebook.net/en_US/sdk.js", e.parentNode.insertBefore(d, e))
    }(document, "script", "facebook-jssdk");