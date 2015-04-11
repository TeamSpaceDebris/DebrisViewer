var viewer = new Cesium.Viewer('cesiumContainer');

var debris_obj = './models/CesiumMilkTruck.gltf';

var debris_data = './data/all.txt';

//var debris_data = './data/small.txt';

var test = {
    name: "VANGUARD 1",
    first_line: "1 00005U 58002B   13081.36130368  .00000449  00000-0  57004-3 0   653",
    second_line: "2 00005 034.2463 090.9145 1849181 337.7719 015.1860 10.84242277918248"
};



var make_loc = function(viewer, tle) {
    var satellite = new Orb.Satellite(tle);
    var time = new Orb.Time();
    var loc = satellite.position.rectangular(time);
    if (!loc.x || !loc.y || !loc.z) {
        return;
    }

    var scene = viewer.scene;
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        new Cesium.Cartesian3(loc.x * 1000, loc.y * 1000, loc.z * 1000));
    var model = scene.primitives.add(Cesium.Model.fromGltf({
        url : debris_obj,
        modelMatrix : modelMatrix,
        scale : 20000.0
    }));
};

var loadDebrisText = function(viewer, url) {
    Cesium.loadText(url, {
    }).then(function(text) {
        var lines = text.split('\n');
        for(var i = 0; i < lines.length; i += 3) {
            var tle = {
                name: lines[i],
                first_line: lines[i + 1],
                second_line: lines[i + 2]
            };
            make_loc(viewer, tle);
        }
    }).otherwise(function(error) {
    });
    
};

//make_loc(viewer, test);
loadDebrisText(viewer, debris_data);
