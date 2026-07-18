const API_KEY = "2efc84e6ddb63a972b5156001674a445";
const USERNAME = "crewsackan";

function urlencode(obj) {
    var str = [];
    for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}

$(document).ready(function () {
    function displayMusic() {
        $("#music").show()
    }

    function lastfmRequest(method, params) {
        params['api_key'] = API_KEY;
        params['format'] = "json";

        return fetch("https://ws.audioscrobbler.com/2.0/?method=" + method + "&" + urlencode(params))
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            });
    }

    function extractFirstValidImage(images) {
        for (var i = images.length - 1; i >= 0; i--) {
            var txt = images[i]["#text"];
            if (txt && txt.length > 0) return txt;
        }
        return "";
    }

    function getImage(trackinfo) {
        return lastfmRequest("track.getInfo", { autocorrect: 1, track: trackinfo["name"], artist: trackinfo["artist"]["name"] })
            .then((data) => {
                try {
                    var img = extractFirstValidImage(data.track.album.image);
                    console.log("track.getInfo album image for", trackinfo["name"], img);
                    if (img) return img;
                    throw new Error("No album image");
                } catch(e) {
                    throw new Error(e);
                }
            })
            .catch((err) => {
                console.log("track.getInfo failed for", trackinfo["name"], "- trying artist fallback");
                return lastfmRequest("artist.getInfo", { autocorrect: 1, artist: trackinfo["artist"]["name"] })
                    .then((data) => {
                        try {
                            var img = extractFirstValidImage(data.artist.image);
                            console.log("artist.getInfo image for", trackinfo["artist"]["name"], img);
                            if (img) return img;
                            return "";
                        } catch(e) {
                            return "";
                        }
                    })
                    .catch(() => {
                        console.log("artist.getInfo also failed for", trackinfo["artist"]["name"]);
                        return "";
                    });
            });
    }

    lastfmRequest("user.gettoptracks", { user: USERNAME, limit: "3", period: "7day" }).then((data) => {
        var html = '<h3 class="colorchanger">Top 3 Tracks This Week</h2>';
        $.each(data.toptracks.track, function (i, item) {
            const itemid = item.mbid || ("track-" + i);
            var initialSrc = extractFirstValidImage(item.image);
            if (!initialSrc) initialSrc = item.image[1]["#text"];

            html += '<div class="music-row">';
            html += '<img id="' + itemid + '" src="' + initialSrc + '">';
            html += '<div><a href="' + item.url + '" target="_blank">' + item.name + '</a> - ' + item.artist['name'] + '</div></div>';

            getImage(item).then((img) => {
                console.log("getImage resolved for top track", itemid, item.name, img);
                if (img && img.length > 0) {
                    $("#" + itemid).attr("src", img);
                }
            }).catch((err) => {
                console.log("getImage rejected for top track", itemid, item.name, err);
            });
        });
        displayMusic();
        $('#listening-to').append(html);
    });

    lastfmRequest("user.getrecenttracks", { user: USERNAME, limit: 1 }).then((data) => {
        console.log(data);

        var item = data.recenttracks.track[0];
        if (!item["@attr"] || !item["@attr"].nowplaying) {
            return;
        }

        let html = '<h3 class="colorchanger">Now Playing</h2>';

        const itemid = item.mbid || "now-playing";
        var initialSrc = extractFirstValidImage(item.image);
        if (!initialSrc) initialSrc = item.image[1]["#text"];

        html += '<div class="music-row">';
        html += '<img id="' + itemid + '" src="' + initialSrc + '">';
        html += '<div><a href="' + item.url + '" target="_blank">' + item.name + '</a> - ' + item.artist['#text'] + '</div></div>';

        getImage({ name: item["name"], artist: { name: item["artist"]["#text"] } }).then((img) => {
            console.log("getImage resolved for now-playing", img);
            if (img && img.length > 0) {
                $("#" + itemid).attr("src", img);
            }
        }).catch((err) => {
            console.log("getImage rejected for now-playing", err);
        });

        displayMusic();
        $('#currently-playing').append(html);

    });
});