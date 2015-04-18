var parseQueryString = function () {
    var res = null,
      query, parameters, element, name, value;
    if (1 < document.location.search.length) {
        query = document.location.search.substring(1);
        parameters = query.split('&');
        res = {};
        for (var i = 0; i < parameters.length; i++) {
            element = parameters[i].split('=');
            name = decodeURIComponent(element[0]);
            value = decodeURIComponent(element[1]);
            if (value.indexOf("/") == value.length - 1) {
                value = value.slice(0, value.length - 1);
            }
            res[name] = decodeURIComponent(value);
        }
        return res;
    }
    return null;
};

var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.OpenStreetMapImageryProvider({
      url: 'http://otile1-s.mqcdn.com/tiles/1.0.0/osm/',
      credit: new Cesium.Credit('OpenStreetMap (OSM) is a collaborative project to create a                                                                                                                                                                                                                                                                               free editable map of the world.', '', '')
    }),
    baseLayerPicker: false
  });

console.log(Cesium.JulianDate.toDate(viewer.clock.currentTime));
var debris_obj = './models/hammer.gltf';

var seki = false;
var queryString = parseQueryString();
if (queryString && queryString.seki == "true") {
    seki = true;
}

var debris_objs = {
    "hammer": {
        model: './models/hammer.gltf',
        scale: 600000.0
    },
    "glove": {
        model: './models/glove.gltf',
        scale: 600000.0
    },
    "seki": {
        model: './models/seki.gltf',
        scale: 200000.0
    },
    "payload4": {
        model: './models/payload4.gltf',
        scale: 200000.0
    },
    "astro": {
        model: './models/astro.gltf',
        scale: 200000.0
    },
    "ods": {
        model: './models/ods.gltf',
        scale: 100000.0
    },
    "srb": {
        model: './models/srb.gltf',
        scale: 200000.0
    }
}
//R/B DEB

//var debris_data = 'http://debris-ar.smellman.org/data/all.txt';
//var debris_data = 'http://debris-ar.smellman.org/data/small.txt';
var debris_data = 'http://debris-ar.smellman.org/data/check.txt';
if (queryString && queryString.data_type) {
    console.log(queryString.data_type);
    if (queryString.data_type == "check") {
        debris_data = 'http://debris-ar.smellman.org/data/check.txt';
    } else if (queryString.data_type == "small") {
        debris_data = 'http://debris-ar.smellman.org/data/small.txt';
    } else if (queryString.data_type == "all") {
        debris_data = 'http://debris-ar.smellman.org/data/all.txt';
    }
}
var show_payload = true;
if (queryString && queryString.show_payload) {
    if (queryString.show_payload == "false") {
        show_payload = false;
    }
}

var test = {
    name: "VANGUARD 1",
    first_line: "1 00005U 58002B   13081.36130368  .00000449  00000-0  57004-3 0   653",
    second_line: "2 00005 034.2463 090.9145 1849181 337.7719 015.1860 10.84242277918248"
};

var Debris = function(viewer, tle, debris_obj) {
    this.satellite = new Orb.Satellite(tle);
    this.viewer = viewer;
    this.debris_obj = debris_obj;
};

Debris.prototype.rectangular = function(clock) {
    var date;
    if (clock) {
        date = Cesium.JulianDate.toDate(clock.currentTime);
    } else {
        date = Cesium.JulianDate.toDate(this.viewer.clock.currentTime);
    }
    var time = new Orb.Time(date);
    var loc = this.satellite.position.rectangular(time);
    if (!loc.x || !loc.y || !loc.z) {
        return null;
    }
    return loc;
};

Debris.prototype.description = function(i) {
    var id = "debris" + i.toString();
    var text = "<h2>12025A,GCOM-W1 (SHIZUKU)</h2><p><b>GCOM-W1</b> (Global Change Observation Mission-Water), a Japanese satellite, was launched from Tanegashima on 2012 May 17 at 16:39 UT by an H-2A rocket. The JAXA satellite, nicknamed <b>SHIZUKU</b>, which in Japanese means water drop, weighed 1.99 tons. It's the first satellite for the GCOM-W series which will study water circulation systems in the Earth's atmosphere. The <b>GCOM-W1</b> will track precipitation, clouds, atmospheric water vapor, sea surface temperatures, sea ice, snow cover, and soil moisture. GCOM-W1 carries the Advanced Microwave Scanning Radiometer 2 (AMSR2), a remote sensing instrument for measuring weak microwave emission from the surface and the atmosphere of the Earth. It is expected to operate in orbit for at least 5 years.</p><p>The initial orbital parameters were period = 98.75 minutes, apogee = 700.0 km, perigee = 697.9 km, inclination = 98.2° on 2012 Jun 24 at 20:32:06 UTC.</p><ul><li>Launch Date: 2012 May 17 at 16:39:00 UTC</li><li>Launch Site: <a href=\"http://maps.gsi.go.jp/#14/30.391830/130.957031\" target=\"_blank\">Tanegashima, Japan</a></li><li>Launch Vehicle: H-2A</li></ul>";
    var ret = text + "<p><a href='#' onclick=\"debris_action('" + id + "');\">action</a></p>";
    return ret;
}

Debris.prototype.init = function(i) {
    var loc = this.rectangular();
    if (loc) {
        var obj;
        if (this.satellite.orbital_elements.name.indexOf("DEB") != -1) {
            obj = debris_objs["hammer"];
        } else if (this.satellite.orbital_elements.name.indexOf("R/B") != -1) {
            obj = debris_objs["payload4"];
        } else {
            obj = debris_objs["ods"];
        }
        if (seki) {
            obj = debris_objs["seki"];
        }
        var position = new Cesium.Cartesian3(loc.x * 1000, loc.y * 1000, loc.z * 1000);
        var heading = Cesium.Math.toRadians(270);
        var pitch = 0;
        var roll = 0;
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);
        this.entity = this.viewer.entities.add({
            id: "debris" + i.toString(),
            name: "H-2A DEB",//this.satellite.orbital_elements.name,
            description: this.description(i),
            position: position,
            orientation : orientation,
            model: {
                uri : obj.model,
                scale: obj.scale
            }
        });
        var that = this;
        this.entity.updateLocation = function(clock) {
            var loc = that.rectangular(clock);
            if (loc) {
                var position = new Cesium.Cartesian3(loc.x * 1000, loc.y * 1000, loc.z * 1000);
                that.entity.position = position;
            }

        };
        this.entity.getLocation = function(clock) {
            return that.rectangular(clock);
        }
        this.entity.promiseLocation = function(clock) {
            return new Promise(function (resolve, reject) {
                var loc = that.rectangular(clock);
                if (loc) {
                    resolve(loc);
                } else {
                    reject();
                }
            });
        }
    }
};


var clockev = function(clock) {
    /* 素直な実装パターン
    viewer.entities.values.forEach(function(entity) {
        entity.updateLocation(clock);
    });
    */
    /* reduce+promise
    viewer.entities.values.reduce(function(sequence, entity) {
        return sequence.then(function() {
            return entity.getLocation(clock);
        }).then(function(loc) {
            if (loc) {
                position = new Cesium.Cartesian3(loc.x * 1000, loc.y * 1000, loc.z * 1000);
                entity.position = position;
            }
        })
    }, Promise.resolve());
*/
    /* promiseオブジェクトを返してみるパターン、一番わかりやすい */
    viewer.entities.values.forEach(function (entity) {
        entity.promiseLocation(clock).then(function (loc) {
            var position = new Cesium.Cartesian3(loc.x * 1000, loc.y * 1000, loc.z * 1000);
            entity.position = position;
        }).catch(function () {
            // do nothing
        });
    });
    viewer.dataSourceDisplay.update(clock);
};

var loadDebrisText = function(viewer, url) {
    Cesium.loadText(url, {
    }).then(function(text) {
        var lines = text.split('\n');
        for(var i = 0; i < lines.length - 1; i += 3) {
            var tle = {
                name: lines[i],
                first_line: lines[i + 1],
                second_line: lines[i + 2]
            };
            //make_loc(viewer, tle);
            if (show_payload || tle.name.indexOf("DEB") != -1 || tle.name.indexOf("R/B") != -1) {
                var debris = new Debris(viewer, tle, debris_obj);
                debris.init(i);
            }
        }
        viewer.clock.onTick.addEventListener(clockev);
    }).otherwise(function(error) {
    });

};

//make_loc(viewer, test);
loadDebrisText(viewer, debris_data);
//var debris = new Debris(viewer, test, debris_obj);
//debris.init();

var debris_action = function(debris_id) {
    //30.39096, 130.96813 tanegashima

};
