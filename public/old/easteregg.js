$(function() {
	
	var step = 5,
        pi = Math.PI,
        W = 100,
        H = 48,
        r = new Raphael(document.getElementById('old-logo'), 0, 0, W * step * 2.65, H * step * 3.8),
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
        d = r.path();

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
    }, 1000);
	
});
