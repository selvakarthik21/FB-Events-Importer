function showLocationPopup(a) {
    var b = "";
    b += '<div class="modal fade" aria-hidden="true" role="dialog" id="goToLocation">', b += '<div class="modal-dialog">', b += '\t<div class="modal-content">', b += '    <div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>', b += "        <h3>Go to Location</h3></div>", b += '    <div class="modal-body"><input type="text" id="geolocate-location" style="width:500px" placeholder="Type a city, address, etc."></div>', b += '    <div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button></div>', b += "</div>", b += "</div>", b += "</div>", 0 == $("#goToLocation").length ? $(b).appendTo($("body")) : $("#goToLocation").replaceWith(b), $("#geolocate-location").keyup(function(a) {
        13 == a.keyCode && $(".locate-button").click()
    });
    var c = $('<button class="btn locate-button">Go to location</button>').click(function() {
        var b = new google.maps.Geocoder,
            c = $("#geolocate-location").val() || "";
        c = $.trim(c), b.geocode({
            address: c
        }, function(b, c) {
            if (c === google.maps.GeocoderStatus.OK) {
                var d = document.getElementById("map-canvas");
                a = new google.maps.Map(d, {
                    center: b[0].geometry.location,
                    zoomControl: !0,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_TOP
                    },
                    zoom: 16
                }), enableAddBtns(a), a.setCenter(b[0].geometry.location)
            } else alert("Could not find that location from Google Maps");
            $("#goToLocation").modal("hide")
        })
    });
    $(c).appendTo($("#goToLocation .modal-footer")), $("#goToLocation").modal("show")
}

function enableAddBtns(a) {
    var b = document.createElement("div");
    b.index = 0, a.controls[google.maps.ControlPosition.TOP_LEFT].push(b);
    var c = '<button class="btn map-button locateMe bg-white" style="z-index: 0; position: absolute; left: 106px; top: 10px; height: 31px;">';
    c += '\t<i class="fa fa-location-arrow"></i> ', c += "Locate Me", c += "</button>", $(c).click(function() {
        navigator.geolocation && navigator.geolocation.getCurrentPosition(function(b) {
            var c = document.getElementById("map-canvas");
            if (null != b && null != b.coords) {
                var d = {
                    lat: b.coords.latitude,
                    lng: b.coords.longitude
                };
                a = new google.maps.Map(c, {
                    center: d,
                    zoomControl: !0,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_TOP
                    },
                    zoom: 12
                }), enableAddBtns(a)
            }
        })
    }).appendTo(b);
    var d = '<button class=" btn map-button  goToLocation bg-white" style="z-index: 0; position: absolute; left: 215px; top: 10px; height: 31px;">';
    d += '\t<i class="fa fa-map-marker"></i> ', d += "\tGo to location", d += "</button>", $(d).click(function() {
        showLocationPopup(a)
    }).appendTo(b)
}

function initialize_map(a) {
    if (0 == $("#map-canvas").length) return !1;
    var b = document.getElementById("map-canvas"),
        c = new google.maps.Geocoder,
        d = $('input[name="selectType"]:checked').val();
    if (null != a && null != a.coords) {
        var e = {
            lat: a.coords.latitude,
            lng: a.coords.longitude
        };
        map = new google.maps.Map(b, {
            center: e,
            zoomControl: !0,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            zoom: 12
        })
    } else map = new google.maps.Map(b, {
        zoomControl: !0,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoom: 12
    }), geocodeAddress(defaultLocation, d, c, b);
    enableAddBtns(map)
}

function geocodeAddress(a, b, c, d) {
    a = a || defaultLocation, document.getElementById("search").value = a, c.geocode({
        address: a
    }, function(c, e) {
        if (e === google.maps.GeocoderStatus.OK && (map = new google.maps.Map(d, {
                center: c[0].geometry.location,
                zoomControl: !0,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                zoom: 16
            }), enableAddBtns(map), map.setCenter(c[0].geometry.location)), "place" == b) searchPlaces(a);
        else if (lastSavedSearch != a || 0 == cachedResponse.length) getEventsByLocation(a);
        else {
            var f = getDates(),
                g = f.startTime,
                h = f.endTime;
            processAllData(cachedResponse, g, h)
        }
        lastSavedSearch = a
    })
}

function addPlaces(a) {
    a = a || {};
    var b = a.data || [];
    console.log(a);
    var c = document.getElementById("map-canvas"),
        d = a.paging || {};
    if (null != d.next) {
        var e = '<button class="btn btn-success btnNext">Next <span class="glyphicon glyphicon-arrow-right"></span> </button>';
        $("#NavTab").append(e), $(".btnNext").click(function() {
            paginateItems(d.next)
        })
    }
    if (null != d.previous) {
        var e = '<button class="btn btn-success btnPrevious" style="margin-right: 10px;"> <span class="glyphicon glyphicon-arrow-left"></span> Previous</button>';
        $("#NavTab").append(e), $(".btnPrevious").click(function() {
            paginateItems(d.previous)
        })
    }
    if ($(".event-list").html(""), 0 != b.length && $.isArray(b)) {
        var f = [],
            h = [],
            i = "",
            j = $("#suggestions").val();
        "attending" == j ? i = "checkins" : "score" == j && (i = "fan_count"), b = b.sort(function(a, b) {
            return b[i] > a[i] ? 1 : b[i] < a[i] ? -1 : 0
        });
        var k = {
            lat: b[0].location.latitude,
            lng: b[0].location.longitude
        };
        map = new google.maps.Map(c, {
            center: k,
            zoomControl: !0,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            zoom: 16
        }), map.setCenter(k), $.each(b, function(a, c) {
            var d = new google.maps.LatLng(b[a].location.latitude, b[a].location.longitude),
                e = getHtmlPopup(c);
            h[a] = new google.maps.InfoWindow({
                content: '<span class="marker">' + e + "</span>"
            });
            var g = c.picture || {},
                i = g.data || {},
                j = i.url || image,
                k = new google.maps.MarkerImage(j, null, null, null, new google.maps.Size(40, 40));
            f[a] = new google.maps.Marker({
                position: d,
                icon: k,
                map: map
            }), f[a].index = a, google.maps.event.addListener(f[a], "mouseover", function() {
                $(".event-list div .info").removeClass("bg-white"), $.each(h, function() {
                    this.close()
                }), h[this.index].open(map, f[this.index]), $(".event-list div:eq(" + this.index + ") .info").addClass("bg-white"), map.panTo(f[this.index].getPosition())
            });
            var l = $('<div class="col-xs-12 card-info">' + e + "</div>").hover(function() {
                $(".event-list div .info.bg-white").removeClass("bg-white"), $.each(h, function() {
                    this.close()
                }), h[a].open(map, f[a])
            }).appendTo($(".event-list"));
            l.find(".info a").click(function() {
                var a = $(this).closest("div.card-info"),
                    b = $(a).find(".expand");
                0 < b.length ? $(b).toggle("slow") : getSeletedItemDetails(a, c.id)
            }), google.maps.event.addListener(f[a], "click", function() {
                var b = $(l).find(".expand");
                0 < b.length ? $(b).show("slow") : getSeletedItemDetails(l, c.id);
                var d = l[0].offsetTop;
                $(".main-panel-wrapper")[0].scrollTop = d - 10, h[a].open(map, f[this.index])
            })
        });
        for (var l = new google.maps.LatLngBounds, m = 0; m < f.length; m++) l.extend(f[m].getPosition());
        map.fitBounds(l)
    } else map = new google.maps.Map(c, {
        zoomControl: !0,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoom: 16
    }), $("#loader").html(noDataAvailable()).removeAttr("id");
    enableAddBtns(map)
}

function getHtmlPopup(a) {
    var b = a.picture || {},
        c = b.data || {},
        d = c.url || image,
        e = a.name || "No Data Available",
        f = a.location || {},
        g = f.street || "",
        h = f.city || "",
        i = a.category_list || [],
        j = [];
    $.each(i, function(a, b) {
        j.push(" " + b.name)
    });
    var k = [],
        l = a.fan_count || "";
    "" != l && k.push(l + " Likes");
    var m = a.checkins || "";
    "" != m && k.push(" " + m + " Checkins");
    var n = '<div class="col-xs-6 col-sm-6 col-md-6 image-holder"><img height="200" width="150"  class="img img-responsive" alt="' + e + '" src="' + d + '"/></div>';
    return n += '<div class="col-xs-6 col-sm-6 col-md-6 info">', n += '<h4><a type="button" href="#">' + e + "</a></h4>", n += '<p class="desc">' + g + " " + h + "<br/>", n += "" + j + "<br/>", n += "" + k + "</p>", n += "</div>"
}

function getEventStartTime(a, b) {
    var c;
    if (null != a) {
        var d = new Date(a),
            e = new Date(b),
            f = new Date;
        if (f.setHours(0, 0, 0, 0), "Invalid Date" != d && d < f && (d = f), f.setHours(23, 59, 59, 999), "Invalid Date" != d) {
            var g = d.toString().split(" ");
            if (c = g[0] + " " + g[1] + " " + g[2] + " " + d.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: !0
                }), "Invalid Date" != e && e <= f) c += " to " + e.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: !0
            });
            else if ("Invalid Date" != e && e > f) {
                var h = e.toString().split(" ");
                c += " to " + h[1] + " " + h[2] + " " + e.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: !0
                })
            }
        }
    }
    return c
}

function getEventsHtmlPopup(a) {
    var b = a.cover || {},
        c = b.source || image,
        d = a.name || "No Data Available",
        e = getEventStartTime(a.start_time, a.end_time) || "",
        f = a.place || {},
        g = f.name || "",
        h = a.attending_count;
    null != h && (h += " Attending");
    var i = '<div class="col-xs-6 col-sm-6 col-md-6 image-holder"> <img class="img img-responsive" alt="' + d + '" src="' + c + '"/></div>';
    return i += '<div class="col-xs-6 col-sm-6 col-md-6 info">', i += '<h4><a type="button" href="#">' + d + "</a></h2>", i += '<p class="desc">' + e + "<br/>", i += g + "<br/>", i += h + "</p>", i += "</div>"
}

function noDataAvailable() {
    return '<div class="more-hint alert alert-info"><button type="button" class="close" data-dismiss="alert">×</button><h3>No Results Available</h3></div>'
}

function showItemDetails(a, b) {
    if (console.log(b), b = b || {}, null != b.id) {
        var c = "",
            d = b.cover || {},
            f = (d.source || "", b.name || ""),
            g = b.link || "#";
        "#" != g && (g = 'Listed Via <a href="' + g + '" target="_blank">Facebook</a>');
        var h = b.website || "";
        h = "" != h && 0 <= h.indexOf("http") ? '<a href="' + h + '" target="_blank">' + h + "</a>" : $("<div>").text(h).html();
        var i = b.location || {},
            j = i.street || "",
            k = i.city || "";
        k = j + " " + k;
        var l = "",
            m = b.hours || {},
            n = (new Date).getDay(),
            o = m[days[n] + "_1_open"] || "",
            p = m[days[n] + "1_close"] || "";
        "" != o && "" != p && (l = "Open today " + o + " am to " + p + " am");
        var q = b.category_list || [],
            r = [];
        $.each(q, function(a, b) {
            r.push(b.name)
        });
        var s = [],
            t = b.fan_count || "";
        "" != t && s.push(t + " Likes");
        var u = b.checkins || "";
        "" != u && s.push(" " + u + " Checkins");
        var v = b.description || "";
        v = v.replace(/href=\"\//gi, 'target="_blank" href="http://www.facebook.com/'), c += '                <h4 class="modal-title">' + f + "</h4>", c += '                <p  class="desc">' + g + "</p>", c += '                <p  class="desc">' + h + "</p>", c += '                <p  class="desc">' + k + "</p>", c += '                <p  class="desc">' + l + "</p>", c += '                <p  class="desc">' + r + "</p>", c += '                <p  class="desc">' + s + "</p>", c += "                <hr/>", "" != v && (c += '\t\t\t<div id="readMore1" class="">', c += '                <h4 class="modal-title">About</h4>', c += '                <p  class="desc about comment">' + v + "</p>", c += "\t\t\t</div>"), c += '<button class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span>Close</button>', $("<div>").hide().addClass("expand col-xs-12").html("<hr/>" + c).appendTo($(a)).show("slow"), $(".comment").shorten(), $(a).find(".btn-danger").click(function() {
            $(a).find(".expand").hide("slow")
        })
    }
}

function showSeletedEventDetails(a, b) {
    var c = "",
        d = b.cover || {},
        e = d.source || "",
        f = b.id,
        g = b.name,
        h = b.owner || {},
        i = h.name,
        j = h.id,
        k = "",
        l = "http://www.facebook.com/" + f;
    null != i && null != j && (j = "http://www.facebook.com/" + j, k = 'Listed by  <a href="' + j + '" target="_blank">' + i + '</a> Via <a href="' + l + '" target="_blank">Facebook</a>');
    var m = getEventStartTime(b.start_time, b.end_time) || "",
        n = b.place || {},
        o = n.name || "",
        p = n.location || {},
        q = p.street || "",
        r = p.city || "";
    r = q + " " + r;
    var s = b.attending_count;
    null != s && (s += " Attending");
    var t = b.ticket_uri || "",
        u = g + "%0A" + m + "%0A" + o + "%0A%0A" + l,
        v = "https://twitter.com/intent/tweet?url=" + l + "&text=" + g + "&original_referer=&via=karthik21[at]live.in&hashtags=events",
        w = b.description || "";
    w = w.replace(/href=\"\//gi, 'target="_blank" href="http://www.facebook.com/'), c += '                <h4 class="modal-title">' + g + "</h4>", c += '                <p  class="desc">' + k + "</p>", c += '                <p  class="desc">' + m + "</p>", c += '                <p  class="desc">' + o + "</p>", c += '                <p  class="desc">' + r + "</p>", c += '                <p  class="desc">' + s + "</p>", c += "                <hr/>", "" != w && (c += '\t\t\t<div id="readMore1" class="collapse">', c += '                <h4 class="modal-title">About</h4>', c += '                <p  class="desc about comment">' + w + "</p>", c += "\t\t\t</div>"), c += '<span class="tickets"></span> &nbsp;', c += '<a href="#share_' + f + '" class="btn btn-default" data-toggle="collapse"><i class="fa fa-share-alt" aria-hidden="true"></i> Share options</a>', c += '<div id="share_' + f + '" class="collapse share-colapse">', c += "\t<br>", c += "\t\t<br>", c += "\t\t\t<a href=\"#\" class='share-facebook'>", c += '\t\t\t\t<i class="fa fa-facebook fa-3x" aria-hidden="true"></i>', c += "\t\t\t</a>", c += "\t\t\t<a href=\"#\" class='share-twitter'>", c += '\t\t\t\t<i class="fa fa-twitter fa-3x" aria-hidden="true"></i>', c += "\t\t\t</a>", c += "\t\t\t<a href=\"#\" class='share-mail'>", c += '\t\t\t\t<i class="fa fa-envelope-o fa-3x" aria-hidden="true"></i>', c += "\t\t\t</a>", c += "\t\t</div>", c += "\t</div>", c += '<button class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span>Close</button>', $("<div>").hide().addClass("expand col-xs-12").html("<hr/>" + c).appendTo($(a)).show("slow"), $(".comment").shorten(), $(a).find(".btn-message, .share-mail").click(function() {
        var a = $('<a style="display:none;">').attr("href", "mailto:?subject=" + g + "&body=" + u).appendTo($("body"));
        a[0].click(), $(a).remove()
    }), $(a).find(".btn-danger").click(function() {
        $(a).find(".expand").hide("slow")
    }), $(a).find(".share-facebook").click(function() {
        var a = {};
        a.message = "An intresting event that i would like to share", a.name = g, a.description = w, a.link = l, a.picture = e, a.caption = "New Event in " + o, postEventInFB(a)
    }), $(a).find(".share-twitter").click(function() {
        var a = $('<a style="display:none;">').attr("target", "_blank").attr("href", v).appendTo($("body"));
        a[0].click(), $(a).remove()
    }), "" != t && $('<a href="#">').addClass("btn btn-default").html("Tickets").appendTo($(a).find(".tickets")).click(function() {
        var a = $('<a style="display:none;">').attr("target", "_blank").attr("href", t).appendTo($("body"));
        a[0].click(), $(a).remove()
    })
}

function addEvents(a) {
    if (console.log(a), 0 != a.length && $.isArray(a)) {
        $(".event-list").html("");
        var b = [],
            d = [];
        $.each(a, function(a, c) {
            var e = c.place || {},
                f = e.location;
            if (null != f) {
                var g = new google.maps.LatLng(f.latitude, f.longitude),
                    h = getEventsHtmlPopup(c);
                d[a] = new google.maps.InfoWindow({
                    content: '<span class="marker">' + h + "</span>"
                });
                var i = c.cover || {},
                    j = i.source || image,
                    k = new google.maps.MarkerImage(j, null, null, null, new google.maps.Size(40, 40));
                b[a] = new google.maps.Marker({
                    position: g,
                    icon: k,
                    map: map
                }), b[a].index = a, google.maps.event.addListener(b[a], "mouseover", function() {
                    $(".event-list div .info").removeClass("bg-white"), $.each(d, function() {
                        this.close()
                    }), d[this.index].open(map, b[this.index]), $(".event-list div:eq(" + this.index + ") .info").addClass("bg-white"), map.panTo(b[this.index].getPosition())
                });
                var l = $('<div class="col-xs-12 card-info">' + h + "</div>").hover(function() {
                    $(".event-list div .info.bg-white").removeClass("bg-white"), $.each(d, function() {
                        this.close()
                    }), d[a].open(map, b[a])
                }).appendTo($(".event-list"));
                l.find(".info a").click(function() {
                    var a = $(l).find(".expand");
                    0 < a.length ? $(a).toggle("slow") : showSeletedEventDetails(l, c)
                }), google.maps.event.addListener(b[a], "click", function() {
                    var e = $(l).find(".expand");
                    0 < e.length ? $(e).show("slow") : showSeletedEventDetails(l, c);
                    var f = l[0].offsetTop;
                    $(".main-panel-wrapper")[0].scrollTop = f - 10, d[a].open(map, b[this.index])
                })
            }
        });
        for (var e = new google.maps.LatLngBounds, f = 0; f < b.length; f++) null != b[f] && e.extend(b[f].getPosition());
        map.fitBounds(e)
    } else $("#loader").html(noDataAvailable()).removeAttr("id")
}

function getDates() {
    var a = $("#selectDay").val() || "";
    a = a.toLowerCase();
    var b = {},
        c = $(".start-date ").val() || "",
        d = $(".end-date ").val() || "";
    if (c = $.trim(c), d = $.trim(d), "" != c && "" != d) c = new Date(c), "Invalid Date" == c && (c = new Date), d = new Date(d), "Invalid Date" == d && (d = new Date), b.startTime = c, b.endTime = d;
    else if ("today" == a) {
        var e = new Date;
        b.startTime = e, b.endTime = e
    } else if ("tomorrow" == a) {
        var f = new Date;
        f.setDate(f.getDate() + 1), b.startTime = f, b.endTime = f
    } else if ("this week" == a) {
        var c = new Date;
        b.startTime = c;
        var g = 7 - c.getDay();
        c.setDate(c.getDate() + g), b.endTime = c
    } else if ("this weekend" == a) {
        var c = new Date,
            h = c.getDay();
        if (0 == h) b.startTime = c, b.endTime = c;
        else if (h >= 5) {
            b.startTime = c;
            var g = 7 - c.getDay();
            c.setDate(e.getDate() + g), b.endTime = c
        } else {
            var g = 5 - c.getDay();
            c.setDate(c.getDate() + g), b.startTime = c, c.setDate(c.getDate() + 2), b.endTime = c
        }
    } else {
        var e = new Date;
        b.startTime = e, b.endTime = e
    }
    return null != b.startTime && (b.startTime = new Date(b.startTime.setHours(0, 0, 0, 0))), null != b.endTime && (b.endTime = new Date(b.endTime.setHours(23, 59, 59, 999))), b
}
var defaultLocation = "Iowa",
    map, image = "https://toworld.s3.amazonaws.com/assets/home/map-cluster-blue-bb0f9a7f136d08960886346b7fc84b77.png",
    days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    monthsShort = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
$(function() {
        navigator.geolocation ? navigator.geolocation.getCurrentPosition(initialize_map, initialize_map) : initialize_map(), $("#search-form").bind("submit", function() {
            return $(".panel-title a[href='#collapse1']").click(), checkLoginState(), !1
        }), $("#search-btn").bind("click", function() {
            return $("#search-form").submit(), !1
        }), $("#selectDay").change(function() {
            $(".start-date ").val(""), $(".end-date ").val("")
        }), $('input[name="selectType"]').click(function() {
            var a = $(this).val(),
                b = $(".btn-suggestion:eq(0)").text();
            $(".btn-suggestions span").text(b), "event" == a ? ($('option[value="attending"]').text("Most Attending"), $(".event-date-filter").show()) : ($('option[value="attending"]').text("Most Popular"), $(".event-date-filter").hide())
        }), $(document).delegate(".logout-button", "click", logoutFromFB), $(document).delegate(".fbSignInBtn", "click", loginToFB), $(".date-entry input").datepicker({
            startDate: "0d",
            setDate: new Date
        }), $(".dropdown-menu td, .dropdown-menu th, .dropdown-menu input, .dropdown-menu label").click(function(a) {
            return $("#selectDay").val(0), !1
        })
    }),
    function(a) {
        a.fn.shorten = function(b) {
            var c = {
                showChars: 100,
                ellipsesText: "...",
                moreText: "more",
                lessText: "less"
            };
            return b && a.extend(c, b), a(document).off("click", ".morelink"), a(document).on({
                click: function() {
                    var b = a(this);
                    return b.hasClass("less") ? (b.removeClass("less"), b.html(c.moreText)) : (b.addClass("less"), b.html(c.lessText)), b.parent().prev().toggle(), b.prev().toggle(), !1
                }
            }, ".morelink"), this.each(function() {
                var b = a(this);
                if (!b.hasClass("shortened")) {
                    b.addClass("shortened");
                    var d = b.html();
                    if (d.length > c.showChars) {
                        var e = d.substr(0, c.showChars),
                            f = d.substr(c.showChars, d.length - c.showChars),
                            g = e + '<span class="moreellipses">' + c.ellipsesText + ' </span><span class="morecontent"><span>' + f + '</span> <a href="#" class="morelink">' + c.moreText + "</a></span>";
                        b.html(g), a(".morecontent span").hide()
                    }
                }
            })
        }
    }(jQuery);