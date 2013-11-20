window.onload = function () {
    var step = 5,
        pi = Math.PI,
        W = 100,
        H = 48,
        r = Raphael(0, 0, W * step * 2.65, H * step * 3.8),
        dots = [
          [[17,8],[11,8],[8,11],[8,13],[11,16],[15,16],[18,18],[18,21],[16,24],[8,24]],
          [[22,8],[26,18],[26,24],[26,18],[30,8]],
          [[35,8],[41,8],[44,11],[44,21],[41,24],[35,24],[35,8]],
          [[55,8],[55,26],[53,29],[48,29],[46,27]],
          [[71,8],[65,8],[62,11],[62,13],[65,16],[69,16],[72,18],[72,21],[70,24],[62,24]]
        ],
        $ = function (id) {
          return document.getElementById(id);
        },
        museo = r.getFont("museosans"),
        when = "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM16,27.533C9.639,27.533,4.466,22.359,4.466,16C4.466,9.64,9.639,4.466,16,4.466c6.361,0,11.533,5.173,11.533,11.534C27.533,22.361,22.359,27.533,16,27.533zM15.999,5.125c-0.553,0-0.999,0.448-0.999,1v9.221L8.954,17.99c-0.506,0.222-0.736,0.812-0.514,1.318c0.164,0.375,0.53,0.599,0.915,0.599c0.134,0,0.271-0.027,0.401-0.085l6.626-2.898c0.005-0.002,0.009-0.004,0.013-0.006l0.004-0.002c0.015-0.006,0.023-0.02,0.037-0.025c0.104-0.052,0.201-0.113,0.279-0.195c0.034-0.034,0.053-0.078,0.079-0.117c0.048-0.064,0.101-0.127,0.13-0.204c0.024-0.06,0.026-0.125,0.038-0.189C16.975,16.121,17,16.064,17,15.999V6.124C17,5.573,16.552,5.125,15.999,5.125z",
        who = "M21.053,20.8c-1.132-0.453-1.584-1.698-1.584-1.698s-0.51,0.282-0.51-0.51s0.51,0.51,1.02-2.548c0,0,1.414-0.397,1.132-3.68h-0.34c0,0,0.849-3.51,0-4.699c-0.85-1.189-1.189-1.981-3.058-2.548s-1.188-0.454-2.547-0.396c-1.359,0.057-2.492,0.792-2.492,1.188c0,0-0.849,0.057-1.188,0.397c-0.34,0.34-0.906,1.924-0.906,2.321s0.283,3.058,0.566,3.624l-0.337,0.113c-0.283,3.283,1.132,3.68,1.132,3.68c0.509,3.058,1.019,1.756,1.019,2.548s-0.51,0.51-0.51,0.51s-0.452,1.245-1.584,1.698c-1.132,0.452-7.416,2.886-7.927,3.396c-0.511,0.511-0.453,2.888-0.453,2.888h26.947c0,0,0.059-2.377-0.452-2.888C28.469,23.686,22.185,21.252,21.053,20.8zM8.583,20.628c-0.099-0.18-0.148-0.31-0.148-0.31s-0.432,0.239-0.432-0.432s0.432,0.432,0.864-2.159c0,0,1.199-0.336,0.959-3.119H9.538c0,0,0.143-0.591,0.237-1.334c-0.004-0.308,0.006-0.636,0.037-0.996l0.038-0.426c-0.021-0.492-0.107-0.939-0.312-1.226C8.818,9.619,8.53,8.947,6.947,8.467c-1.583-0.48-1.008-0.385-2.159-0.336C3.636,8.179,2.676,8.802,2.676,9.139c0,0-0.72,0.048-1.008,0.336c-0.271,0.271-0.705,1.462-0.757,1.885v0.281c0.047,0.653,0.258,2.449,0.469,2.872l-0.286,0.096c-0.239,2.783,0.959,3.119,0.959,3.119c0.432,2.591,0.864,1.488,0.864,2.159s-0.432,0.432-0.432,0.432s-0.383,1.057-1.343,1.439c-0.061,0.024-0.139,0.056-0.232,0.092v5.234h0.575c-0.029-1.278,0.077-2.927,0.746-3.594C2.587,23.135,3.754,22.551,8.583,20.628zM30.913,11.572c-0.04-0.378-0.127-0.715-0.292-0.946c-0.719-1.008-1.008-1.679-2.59-2.159c-1.584-0.48-1.008-0.385-2.16-0.336C24.72,8.179,23.76,8.802,23.76,9.139c0,0-0.719,0.048-1.008,0.336c-0.271,0.272-0.709,1.472-0.758,1.891h0.033l0.08,0.913c0.02,0.231,0.022,0.436,0.027,0.645c0.09,0.666,0.21,1.35,0.33,1.589l-0.286,0.096c-0.239,2.783,0.96,3.119,0.96,3.119c0.432,2.591,0.863,1.488,0.863,2.159s-0.432,0.432-0.432,0.432s-0.053,0.142-0.163,0.338c4.77,1.9,5.927,2.48,6.279,2.834c0.67,0.667,0.775,2.315,0.746,3.594h0.48v-5.306c-0.016-0.006-0.038-0.015-0.052-0.021c-0.959-0.383-1.343-1.439-1.343-1.439s-0.433,0.239-0.433-0.432s0.433,0.432,0.864-2.159c0,0,0.804-0.229,0.963-1.841v-1.227c-0.001-0.018-0.001-0.033-0.003-0.051h-0.289c0,0,0.215-0.89,0.292-1.861V11.572z",
        where = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
        register = "M28.952,12.795c-0.956,1.062-5.073,2.409-5.604,2.409h-4.513c-0.749,0-1.877,0.147-2.408,0.484c0.061,0.054,0.122,0.108,0.181,0.163c0.408,0.379,1.362,0.913,2.206,0.913c0.397,0,0.723-0.115,1-0.354c1.178-1.007,1.79-1.125,2.145-1.125c0.421,0,0.783,0.193,0.996,0.531c0.4,0.626,0.106,1.445-0.194,2.087c-0.718,1.524-3.058,3.171-5.595,3.171c-0.002,0-0.002,0-0.004,0c-0.354,0-0.701-0.033-1.033-0.099v3.251c0,0.742,1.033,2.533,4.167,2.533s3.955-3.701,3.955-4.338v-4.512c2.23-1.169,4.512-1.805,5.604-3.895C30.882,12.05,29.907,11.733,28.952,12.795zM21.942,17.521c0.796-1.699-0.053-1.699-1.54-0.425s-3.665,0.105-4.408-0.585c-0.743-0.689-1.486-1.22-2.814-1.167c-1.328,0.053-4.46-0.161-6.267-0.585c-1.805-0.425-4.895-3-5.15-2.335c-0.266,0.69,0.211,1.168,1.168,2.335c0.955,1.169,5.075,2.778,5.075,2.778s0,3.453,0,4.886c0,1.435,2.973,3.61,4.512,3.61s2.708-1.062,2.708-1.806v-4.512C17.775,21.045,21.146,19.221,21.942,17.521zM20.342,13.73c1.744,0,3.159-1.414,3.159-3.158c0-1.745-1.415-3.159-3.159-3.159s-3.158,1.414-3.158,3.159C17.184,12.316,18.598,13.73,20.342,13.73zM12.019,13.73c1.744,0,3.158-1.414,3.158-3.158c0-1.745-1.414-3.159-3.158-3.159c-1.745,0-3.159,1.414-3.159,3.159C8.86,12.316,10.273,13.73,12.019,13.73z",
        twitter = "M23.295,22.567h-7.213c-2.125,0-4.103-2.215-4.103-4.736v-1.829h11.232c1.817,0,3.291-1.469,3.291-3.281c0-1.813-1.474-3.282-3.291-3.282H11.979V6.198c0-1.835-1.375-3.323-3.192-3.323c-1.816,0-3.29,1.488-3.29,3.323v11.633c0,6.23,4.685,11.274,10.476,11.274h7.211c1.818,0,3.318-1.463,3.318-3.298S25.112,22.567,23.295,22.567z",
        join = "M28.516,7.167H3.482l12.517,7.108L28.516,7.167zM16.74,17.303C16.51,17.434,16.255,17.5,16,17.5s-0.51-0.066-0.741-0.197L2.5,10.06v14.773h27V10.06L16.74,17.303z",
        archive = "M15.985,5.972c-7.563,0-13.695,4.077-13.695,9.106c0,2.877,2.013,5.44,5.147,7.108c-0.446,1.479-1.336,3.117-3.056,4.566c0,0,4.015-0.266,6.851-3.143c0.163,0.04,0.332,0.07,0.497,0.107c-0.155-0.462-0.246-0.943-0.246-1.443c0-3.393,3.776-6.05,8.599-6.05c3.464,0,6.379,1.376,7.751,3.406c1.168-1.34,1.847-2.892,1.847-4.552C29.68,10.049,23.548,5.972,15.985,5.972zM27.68,22.274c0-2.79-3.401-5.053-7.599-5.053c-4.196,0-7.599,2.263-7.599,5.053c0,2.791,3.403,5.053,7.599,5.053c0.929,0,1.814-0.116,2.637-0.319c1.573,1.597,3.801,1.744,3.801,1.744c-0.954-0.804-1.447-1.713-1.695-2.534C26.562,25.293,27.68,23.871,27.68,22.274z",
        mentor = "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM13.704,19.47l-2.338,2.336l-6.43-6.431l6.429-6.432l2.339,2.341l-4.091,4.091L13.704,19.47zM20.775,21.803l-2.337-2.339l4.092-4.09l-4.092-4.092l2.337-2.339l6.43,6.426L20.775,21.803z"
        d = r.path(),
        tixi = {};

    if(Raphael.type === ''){
        document.body.className = document.body.className.replace(/\braphael\b/, 'no-raphael');
    }

    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y, value) {
        value = value || 4;
        var l = Math.min(Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2)) / value, Math.sqrt(Math.pow(p3x - p2x, 2) + Math.pow(p3y - p2y, 2)) / value),
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y)),
            pi = Math.PI;
        a = p1y < p2y ? pi - a : a;
        b = p3y < p2y ? pi - b : b;
        var alpha = pi / 2 - ((a + b) % (pi * 2)) / 2;
        alpha > pi / 2 && (alpha -= pi);
        var dx1 = l * Math.sin(alpha + a),
            dy1 = l * Math.cos(alpha + a),
            dx2 = l * Math.sin(alpha + b),
            dy2 = l * Math.cos(alpha + b),
            out = {
                x1: p2x - dx1,
                y1: p2y + dy1,
                x2: p2x + dx2,
                y2: p2y + dy2
            };
        r.circle(p2x, p2y, 4).attr({stroke: "#fff", opacity: .5});
        r.circle(out.x1, out.y1, 2).attr({stroke: "none", fill: "#fff", opacity: .5});
        r.circle(out.x2, out.y2, 2).attr({stroke: "none", fill: "#fff", opacity: .5});
        r.path("M" + [out.x1, out.y1, out.x2, out.y2]).attr({stroke: "#fff", opacity: .5, "stroke-dasharray": "- "});
        return out;
    }
    function smooth(originalPath, value) {
        var path = Raphael.path2curve(originalPath),
            newp = [path[0]],
            x = path[0][1],
            y = path[0][2],
            j,
            beg = 1,
            mx = x,
            my = y,
            cx = 0,
            cy = 0;
        for (var i = 1, ii = path.length; i < ii; i++) {
            var pathi = path[i],
                pathil = pathi.length,
                pathim = path[i - 1],
                pathiml = pathim.length,
                pathip = path[i + 1],
                pathipl = pathip && pathip.length,
                points;
            if (pathi[0] == "M") {
                mx = pathi[1];
                my = pathi[2];
                j = i + 1;
                while (path[j][0] != "C") j++;
                cx = path[j][5];
                cy = path[j][6];
                newp.push(["M", mx, my]);
                beg = newp.length;
                x = mx;
                y = my;
                continue;
            }
            if (pathi[pathil - 2] == mx && pathi[pathil - 1] == my && (!pathip || pathip[0] == "M")) {
                var begl = newp[beg].length;
                points = getAnchors(pathim[pathiml - 2], pathim[pathiml - 1], mx, my, newp[beg][begl - 2], newp[beg][begl - 1], value);
                newp[beg][1] = points.x2;
                newp[beg][2] = points.y2;
            } else if (!pathip || pathip[0] == "M") {
                points = {
                    x1: pathi[pathil - 2],
                    y1: pathi[pathil - 1]
                };
            } else {
                points = getAnchors(pathim[pathiml - 2], pathim[pathiml - 1], pathi[pathil - 2], pathi[pathil - 1], pathip[pathipl - 2], pathip[pathipl - 1], value);
            }
            newp.push(["C", x, y, points.x1, points.y1, pathi[pathil - 2], pathi[pathil - 1]]);
            x = points.x2;
            y = points.y2;
        }
        return newp;
    }

    tixi.xhr = null;
    tixi.getCORS = function () {
        var xhr,
            useOnload = false;
        if (window.XDomainRequest) {
            xhr = new XDomainRequest;
            useOnload = true;
        } else if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest;
            if (!('withCredentials' in xhr)) {
                xhr = null;
            }
        }
        xhr && (tixi.xhr = xhr);

        return function (method, url, callback) {
            if (!xhr) {
                return;
            }
            if (useOnload) {
                xhr.onload = callback;
                xhr.onprogress = function () {}; // Required for IE9 to work
            } else {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        callback();
                    }
                }
            }

            xhr.open(method, url, true);
            xhr.send();
        }
    }
    tixi.checkStatus = function () {
        var url = "http://tixi.com.au/sydjs?format=json",
            request = tixi.getCORS();
        request("GET", url, tixi.processData);
    }
    tixi.processData = function () {
        if (tixi.xhr.status >= 400 || !tixi.xhr.responseText) {
            return;
        }
        var data = JSON.parse(tixi.xhr.responseText),
            canRegister = false,
            date = $("when").getAttribute("title").split(" ")[0],
            text = '',
            i = 0,
            len = data.upcomingSessions.length,
            meeting, meetingDate;
        for (; i < len; i++) {
            meeting = data.upcomingSessions[i];
            // "2011-12-21T18:00:00.0000000+11:00" -> "2011-12-21"
            meetingDate = meeting.startTime.split('T')[0];
            if (meetingDate == date) {
                if (meeting.ticketsAvailable) {
                    canRegister = true;
                    text = ' (tickets available)';
                } else {
                    text = ' (sold out)';
                }
                break;
            }
        }

        if (text) {
            tixi.print(text);
        }
        if (!canRegister) {
            tixi.set.attr('opacity', .5);
        }
    }
    tixi.print = function (suffix) {
        if (tixi.textSet) {
            tixi.textSet.forEach(function (elem) {
                elem.remove();
            }).clear();
        }
        tixi.textSet = r.print(tixi.textX, tixi.textY, $("register").innerHTML + (suffix || ''), museo, 24).attr({fill: "#fff"});
        tixi.set.push(tixi.textSet);
        tixi.link && tixi.link.toFront();
    }

    var path = [];
    for (var i = 0, ii = dots.length; i < ii; i++) {
        path.push("M");
        for (var j = 0, jj = dots[i].length; j < jj; j++) {
            path.push(dots[i][j][0] * step + 100, dots[i][j][1] * step + 100);
        }
    }
    var path2 = smooth(path, .25);
    d.attr({path: path2, "stroke-width": 1, stroke: "#fff", "stroke-linecap": "round"});
    var run = function () {d.animate({path: path, "stroke-width": 4}, 9500, ">");};
    setInterval(run, 20000);
    setTimeout(function () {
        run();
        setInterval(function () {d.animate({path: path2, "stroke-width": 1}, 9500, ">");}, 20000);
    }, 10000);

    var y = 180, title, href, topicNode, speakerNode;
    if ($("next")) {
        title = $("what");
        if (title) {
            r.print(585, y - 90, title.innerHTML, museo, 30).attr({fill: "#fff"});
            y = 250;
        }
        r.path(when).attr({fill: "#fff", stroke: "none", transform: "t600," + (y - 92) + " s2"});
        r.print(670, y - 70, $("when").innerHTML, museo, 24).attr({fill: "#fff"});
        i = 1;
        while ($("speaker" + i)) {
            i == 1 && r.path(who).attr({fill: "#fff", stroke: "none", transform: "t600," + (y - 10) + " s2"});
            topicNode = $("topic" + i);
            href = topicNode.children[0].getAttribute("href");
            r.print(670, y, (topicNode.innerText || topicNode.textContent).replace('&amp;', '&'), museo, 24).attr({fill: "#fff"});
            if (href) { //Need rectangle to click on, not just text shapes
                r.rect(670, y-10, 300, 24).attr({href: href, fill: "#000", opacity: 0});
            }
            speakerNode = $("speaker" + i);
            href = speakerNode.children[0].getAttribute("href");
            r.print(670, y + 24 * 1.1, (speakerNode.innerText || speakerNode.textContent), museo, 18).attr({fill: "#fff", opacity: .6});
            if (href) {
                r.rect(670, y + 13, 300, 26).attr({href: href, fill: "#000", opacity: 0});
            }
            y += 24 * 1.3 * 2;
            i++;
        }
        r.path(where).attr({fill: "#fff", stroke: "none", transform: "t600," + (y + 24) + " s2"});
        r.print(670, y + 40, $("where").innerHTML, museo, 24).attr({fill: "#fff"});
        r.rect(600, y, 400, 64).attr({href: $("where").href, fill: "#000", opacity: 0});

        r.setStart();
        r.path(register).attr({fill: "#fff", stroke: "none", transform: "t600," + (y + 94) + " s2"});
        tixi.textX = 670;
        tixi.textY = y + 114;
        tixi.set = r.setFinish();
        tixi.print();
        tixi.link = r.rect(600, y + 84, 500, 64).attr({href: $("register").href, fill: "#000", opacity: 0});

        tixi.checkStatus();
    }

    r.path(twitter).attr({fill: "#fff", stroke: "none", transform: "t25," + (y + 172)});
    r.print(58, y +194, $("twitter").innerHTML, museo, 18).attr({fill: "#fff"});
    r.rect(25, y + 175, 120, 30).attr({href: $("twitter").href, fill: "#000", opacity: 0});

    r.path(join).attr({fill: "#fff", stroke: "none", transform: "t167," + (y + 176)});
    r.print(208, y + 194, $("join").innerHTML, museo, 18).attr({fill: "#fff"});
    r.rect(167, y + 180, 180, 26).attr({href: $("join").href, fill: "#000", opacity: 0});

    r.path(archive).attr({fill: "#fff", stroke: "none", transform: "t367," + (y + 173)});
    r.print(406, y + 194, $("archive").innerHTML, museo, 18).attr({fill: "#fff"});
    r.rect(360, y + 180, 190, 26).attr({href: $("archive").href, fill: "#000", opacity: 0});

    r.path(mentor).attr({fill: "#fff", stroke: "none", transform: "t567," + (y + 176)});
    r.print(606, y +194, $("mentoring").innerHTML, museo, 18).attr({fill: "#fff"});
    r.rect(560, y + 175, 190, 30).attr({href: $("mentoring").href, fill: "#000", opacity: 0});
};
