import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth*0.8, window.innerHeight*0.8 );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 20, 20, 80 );
camera.lookAt( 0, 0, 0 );

const sun_g = new THREE.SphereGeometry( 0.2, 32, 16, 0, 2*Math.PI, 0, Math.PI ); 
const sun_m = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const sun = new THREE.Mesh( sun_g, sun_m );
scene.add( sun );

const planets_g = new THREE.SphereGeometry( 0.1, 32, 16, 0, 2*Math.PI, 0, Math.PI );
const planets_m = [];
const planets_p = [
    [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593], 
    [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255], 
    [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0], 
    [1.52371034, 0.09339410, 1.84969142,  -4.55343205, -23.94362959, 49.55953891], 
    [5.20288700, 0.04838624, 1.30439695,  34.39644051, 14.72847983, 100.47390909], 
    [9.53667594, 0.05386179, 2.48599187,  49.95424423, 92.59887831, 113.66242448], 
    [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503], 
    [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574], 
];
const planets = [];
planets_m[0] = new THREE.MeshBasicMaterial( { color: 0xa0a0a0 } );
planets_m[1] = new THREE.MeshBasicMaterial( { color: 0xf0d020 } );
planets_m[2] = new THREE.MeshBasicMaterial( { color: 0x20b020 } );
planets_m[3] = new THREE.MeshBasicMaterial( { color: 0xf06040 } );
planets_m[4] = new THREE.MeshBasicMaterial( { color: 0xf0b020 } );
planets_m[5] = new THREE.MeshBasicMaterial( { color: 0xd09020 } );
planets_m[6] = new THREE.MeshBasicMaterial( { color: 0x20f0f0 } );
planets_m[7] = new THREE.MeshBasicMaterial( { color: 0x5070d0 } );
const orbit_g = [];
const orbit = [];
for(var i=0;i<8;i++){
    planets[i] = new THREE.Mesh( planets_g, planets_m[i] );
    scene.add( planets[i] );
    for(var j=0;j<150*i+150;j++){
        orbit_g[i*(i+1)*75+j] = new THREE.SphereGeometry( 0.0001*(150*i+150-j), 8, 4, 0, 2*Math.PI, 0, Math.PI );
        orbit[i*(i+1)*75+j] = new THREE.Mesh( orbit_g[i*(i+1)*75+j], planets_m[i] );
        scene.add( orbit[i*(i+1)*75+j] );
    }
}

const stars_g = new THREE.SphereGeometry( 0.5+Math.random(), 8, 4, 0, 2*Math.PI, 0, Math.PI );
const stars_m = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const stars = [];
var theta, phi;
for(var i=0;i<500;i++){
    stars[i] = new THREE.Mesh( stars_g, stars_m );
    scene.add( stars[i] );
    theta = Math.random()*Math.PI*2;
    phi = Math.random()*Math.PI;
    stars[i].position.x = 500*Math.cos(theta)*Math.sin(phi);
    stars[i].position.y = 500*Math.cos(phi);
    stars[i].position.z = 500*Math.sin(theta)*Math.sin(phi);
}
var t=0;
var cursorX, cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

var currentZoom = 40; 
var minZoom = 1; 
var maxZoom = 50; 
var stepSize = 1;

document.body.addEventListener('wheel', function (e) { 
    // Zoom in or out based on the scroll direction 
    var direction = e.deltaY > 0 ? 1 : -1; 
    zoomImage(direction); 
});
function zoomImage(direction) { 
    var newZoom = currentZoom + direction * stepSize; 
    // Limit the zoom level to the minimum and maximum values 
    if (newZoom < minZoom || newZoom > maxZoom) { 
        return; 
    } 
    currentZoom = newZoom; 
}

function animate() {
	requestAnimationFrame( animate );
    t++;
    for(var i=0;i<8;i++){
        var a = planets_p[i][0];
        var E = t/Math.pow(a, 3/2)/100;
        var e = planets_p[i][1];
        var I = planets_p[i][2]/180*Math.PI;
        var L = planets_p[i][3]/180*Math.PI;
        var wb = planets_p[i][4]/180*Math.PI;
        var o = planets_p[i][5]/180*Math.PI;
        var w = wb-o;
        var xp = a*(Math.cos(E)-e);
        var yp = a*(Math.sqrt(1-e*e))*Math.sin(E);
        var x = (Math.cos(w)*Math.cos(o)-Math.sin(w)*Math.sin(o)*Math.cos(I))*xp+(-Math.sin(w)*Math.cos(o)-Math.cos(w)*Math.sin(o)*Math.cos(I))*yp;
        var y = (Math.cos(w)*Math.sin(o)+Math.sin(w)*Math.cos(o)*Math.cos(I))*xp+(-Math.sin(w)*Math.sin(o)+Math.cos(w)*Math.cos(o)*Math.cos(I))*yp;
        var z = (Math.sin(w)*Math.sin(I))*xp+(Math.cos(w)*Math.sin(I))*yp;
        planets[i].position.x = x;
        planets[i].position.z = y;
        planets[i].position.y = z;
        for(var j=0;j<150*i+150;j++){
            E = (t-j*(planets_p[i][0]))/Math.pow(a, 3/2)/100;
            var xp = a*(Math.cos(E)-e);
            var yp = a*(Math.sqrt(1-e*e))*Math.sin(E);
            var x = (Math.cos(w)*Math.cos(o)-Math.sin(w)*Math.sin(o)*Math.cos(I))*xp+(-Math.sin(w)*Math.cos(o)-Math.cos(w)*Math.sin(o)*Math.cos(I))*yp;
            var y = (Math.cos(w)*Math.sin(o)+Math.sin(w)*Math.cos(o)*Math.cos(I))*xp+(-Math.sin(w)*Math.sin(o)+Math.cos(w)*Math.cos(o)*Math.cos(I))*yp;
            var z = (Math.sin(w)*Math.sin(I))*xp+(Math.cos(w)*Math.sin(I))*yp;
            orbit[i*(i+1)*75+j].position.x = x;
            orbit[i*(i+1)*75+j].position.z = y;
            orbit[i*(i+1)*75+j].position.y = z;
        }
    }
    theta = cursorX/100;
    phi = cursorY/window.innerHeight*Math.PI;
    camera.position.x = currentZoom*Math.cos(theta)*Math.sin(phi);
    camera.position.y = currentZoom*Math.cos(phi);
    camera.position.z = currentZoom*Math.sin(theta)*Math.sin(phi);
    camera.lookAt( 0, 0, 0 );
    console.log(cursorX, cursorY)
	renderer.render( scene, camera );
}

animate();

//xyz
/*const x_axis_points = [];
x_axis_points.push( new THREE.Vector3( -100000, 0, 0 ) );
x_axis_points.push( new THREE.Vector3( 100000, 0, 0 ) );
const x_axis_g = new THREE.BufferGeometry().setFromPoints( x_axis_points );
const x_axis_m = new THREE.LineBasicMaterial( { color: 0x0000ff } );
const x_axis = new THREE.Line( x_axis_g, x_axis_m );
scene.add( x_axis );
const y_axis_points = [];
y_axis_points.push( new THREE.Vector3( 0, 0, -100000 ) );
y_axis_points.push( new THREE.Vector3( 0, 0, 100000 ) );
const y_axis_g = new THREE.BufferGeometry().setFromPoints( y_axis_points );
const y_axis_m = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
const y_axis = new THREE.Line( y_axis_g, y_axis_m );
scene.add( y_axis );
const z_axis_points = [];
z_axis_points.push( new THREE.Vector3( 0, -100000, 0 ) );
z_axis_points.push( new THREE.Vector3( 0, 100000, 0 ) );
const z_axis_g = new THREE.BufferGeometry().setFromPoints( z_axis_points );
const z_axis_m = new THREE.LineBasicMaterial( { color: 0xff0000 } );
const z_axis = new THREE.Line( z_axis_g, z_axis_m );
scene.add( z_axis );*/

