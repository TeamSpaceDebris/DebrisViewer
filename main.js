var viewer = new Cesium.Viewer('cesiumContainer');

console.log(Cesium.JulianDate.toDate(viewer.clock.currentTime));
var debris_obj = './models/seki.gltf';

//var debris_data = './data/all.txt';

var debris_data = './data/small.txt';
//var debris_data = './data/check.txt';

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

Debris.prototype.init = function(i) {
    var loc = this.rectangular();
    if (loc) {
        var position = new Cesium.Cartesian3(loc.x * 1000, loc.y * 1000, loc.z * 1000);
        var heading = Cesium.Math.toRadians(135);
        var pitch = 0;
        var roll = 0;
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);
        this.entity = this.viewer.entities.add({
            id: "debris" + i.toString(),
            name: "debris" + i.toString(),
            position: position,
            orientation : orientation,
            model: {
                uri : this.debris_obj,
                scale: 200000.0
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
    }
};


var clockev = function(clock) {
    viewer.entities.values.forEach(function(entity) {
        entity.updateLocation(clock);
    });
    viewer.dataSourceDisplay.update(clock);
};

var loadDebrisText = function(viewer, url) {
    Cesium.loadText(url, {
    }).then(function(text) {
        var lines = text.split('\n');
        for(var i = 0; i < lines.length - 1; i += 3) {
            console.log(i, lines.length);
            var tle = {
                name: lines[i],
                first_line: lines[i + 1],
                second_line: lines[i + 2]
            };
            //make_loc(viewer, tle);
            var debris = new Debris(viewer, tle, debris_obj);
            debris.init(i);
        }
        viewer.clock.onTick.addEventListener(clockev);
    }).otherwise(function(error) {
    });
    
};

//make_loc(viewer, test);
loadDebrisText(viewer, debris_data);
//var debris = new Debris(viewer, test, debris_obj);
//debris.init();
