import * as THREE from 'three';
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import laminate2 from '../img/gray-parquet.jpg';
import { VRButton } from './VRButton';
import { DragControls } from './controls/DragControls';

const assetLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader()
const gui = new dat.GUI();

const diningRoomUrl = new URL('../assets/modern_dining_room.glb', import.meta.url);
const chairUrl = new URL('../assets/the_matrix_red_chesterfield_chair.glb', import.meta.url);
const armchairUrl = new URL('../assets/high_poly_sofa.glb', import.meta.url);
const sofaUrl = new URL('../assets/chesterfield-sofa.glb', import.meta.url);
const sofa2Url = new URL('../assets/victorian_style_sofa.glb', import.meta.url);
const windowUrl = new URL('../assets/wooden_window.glb', import.meta.url);
const tableUrl = new URL('../assets/table.glb', import.meta.url);
const sofa3Url = new URL('../assets/victorian_lounge_sofa.glb', import.meta.url);
const televisionunitUrl = new URL('../assets/14835_tv_stand_inlay_version.glb', import.meta.url);
const victorianDeskUrl = new URL('../assets/victorian_desk_with_props.glb', import.meta.url);
assetLoader.load(diningRoomUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.scale.x = 2
    model.scale.y = 2
    model.scale.z = 2
    model.position.set(8, 3, 0);

    mixer = new THREE.AnimationMixer(model);
}, undefined, function (error) {
    console.error(error);
});

assetLoader.load(sofa3Url.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.scale.x = 3
    model.scale.y = 3
    model.scale.z = 3
    model.position.set(-11, 1.5, 0);

    mixer = new THREE.AnimationMixer(model);
}, undefined, function (error) {
    console.error(error);
});

assetLoader.load(televisionunitUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.scale.x = 0.003
    model.scale.y = 0.003
    model.scale.z = 0.003
    model.position.set(-7, 0, -8);

    mixer = new THREE.AnimationMixer(model);
}, undefined, function (error) {
    console.error(error);
});
let victorianDeskArray = [];

assetLoader.load(victorianDeskUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.scale.x = 2
    model.scale.y = 2
    model.scale.z = 2
    model.position.set(-9, 0, 9);
    victorianDeskArray.push(model);

    mixer = new THREE.AnimationMixer(model);
}, undefined, function (error) {
    console.error(error);
});

assetLoader.load(windowUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    //model.rotation.y = -1 ;
    model.position.set(0, 2, 15);

    mixer = new THREE.AnimationMixer(model);
}, undefined, function (error) {
    console.error(error);
});
assetLoader.load(tableUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    //model.rotation.y = -1 ;
    model.position.set(-8, 0, 0);
    model.scale.x = 0.50
    model.scale.y = 0.50
    model.scale.z = 0.50

    mixer = new THREE.AnimationMixer(model);
}, undefined, function (error) {
    console.error(error);
});

let armchairUrls = [armchairUrl, sofaUrl];

let armchairs = [];

for (let armchairUrl of armchairUrls) {
    assetLoader.load(armchairUrl.href, function (gltf) {
        const model = gltf.scene;
        model.scale.x = 2
        model.scale.y = 2
        model.scale.z = 2
        model.position.set(-5, 0, -4);
        armchairs.push(model);

        mixer = new THREE.AnimationMixer(model);
    }, undefined, function (error) {
        console.error(error);
    });
}

const renderer = new THREE.WebGL1Renderer();
renderer.xr.enabled = true;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
camera.position.set(0, -10, 5);

orbit.update();

const planeGeometry = new THREE.PlaneGeometry(30, 30);

const texture = textureLoader.load(laminate2)

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.x = 10;
texture.repeat.y = 10;

const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const plane2Geometry = new THREE.PlaneGeometry(30, 15, 30, 15);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xcfbc91,
    side: THREE.DoubleSide
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(0, 5, 15);
scene.add(plane);

const plane3Geometry = new THREE.PlaneGeometry(30, 15, 30, 15);
const plane3Material = new THREE.MeshBasicMaterial({
    color: 0xcfbc91,
    side: THREE.DoubleSide
});
const plane3 = new THREE.Mesh(plane3Geometry, plane3Material);
plane3.position.set(0, 5, -15);
scene.add(plane3);

const plane4Geometry = new THREE.PlaneGeometry(30, 15, 30, 15);
const plane4Material = new THREE.MeshBasicMaterial({
    color: 0xcfbc91,
    side: THREE.DoubleSide
});
const plane4 = new THREE.Mesh(plane4Geometry, plane4Material);
plane4.rotation.y = -0.5 * Math.PI;
plane4.position.set(-15, 5, 0);
scene.add(plane4);

const plane5Geometry = new THREE.PlaneGeometry(30, 15, 30, 15);
const plane5Material = new THREE.MeshBasicMaterial({
    color: 0xcfbc91,
    side: THREE.DoubleSide
});
const plane5 = new THREE.Mesh(plane5Geometry, plane5Material);
plane5.rotation.y = -0.5 * Math.PI;
plane5.position.set(15, 5, 0);
scene.add(plane5);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(10, 10, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
scene.add(dLightHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(30, 30, 30);
spotLight.castShadow = true;
spotLight.angle = 0.2;
const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

const light = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
scene.add(light);

const options = {
    armchairChange: 1,
    plane2Color: '#ffea00',
    plane3Color: '#ffea00',
    plane4Color: '#ffea00',
    plane5Color: '#ffea00',
    wireframe: false,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
}

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1)

const mousePosition = new THREE.Vector2();

gui.addColor(options, 'plane2Color').onChange(function (e) {
    plane2.material.color.set(e);
});

gui.addColor(options, 'plane3Color').onChange(function (e) {
    plane3.material.color.set(e);
});
gui.addColor(options, 'plane4Color').onChange(function (e) {
    plane4.material.color.set(e);
});

gui.addColor(options, 'plane5Color').onChange(function (e) {
    plane5.material.color.set(e);
});

gui.add(options, 'armchairChange', [0, 1]).onChange(function (e) {

    if (e == '0') {
        scene.remove(armchairs[1]);
        scene.remove(armchairs[0]);
        armchairs[0].position.set(-3, 0, -3);
        armchairs[0].rotation.y=-1
        scene.add(armchairs[0])
    } else if (e === '1') {
        scene.remove(armchairs[1]);
        scene.remove(armchairs[0]);
        armchairs[1].position.set(-3, 1, -3);
        armchairs[1].rotation.y=-1
        scene.add(armchairs[1])
    }
});

const controls = new DragControls(victorianDeskArray, camera, renderer.domElement);
controls.deactivate();
controls.activate();

window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

function animate(time) {
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;

    rayCaster.setFromCamera(mousePosition, camera);

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});