import * as THREE from 'three';
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import laminate2 from '../img/gray-parquet.jpg';
import { VRButton } from './VRButton';
import { DragControls } from './controls/DragControls.js';
import * as CANNON from 'cannon-es';

const assetLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader()
const gui = new dat.GUI();

// setup world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.NaiveBroadphase()
world.solver.iterations = 10
world.allowSleep = true

// assets
const diningRoomUrl = new URL('../assets/modern_dining_room.glb', import.meta.url);
const armchairUrl = new URL('../assets/high_poly_sofa.glb', import.meta.url);
const sofaUrl = new URL('../assets/chesterfield-sofa.glb', import.meta.url);
const windowUrl = new URL('../assets/wooden_window.glb', import.meta.url);
const tableUrl = new URL('../assets/table.glb', import.meta.url);
const sofa3Url = new URL('../assets/victorian_lounge_sofa.glb', import.meta.url);
const televisionunitUrl = new URL('../assets/14835_tv_stand_inlay_version.glb', import.meta.url);
const victorianDeskUrl = new URL('../assets/victorian_desk_with_props.glb', import.meta.url);

// let draggableModel;
// let clickMouse = new THREE.Vector2();
// let moveMouse = new THREE.Vector2();
let objects = [];

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

let victorianDeskShape;
let vicorianDeskBody;
let victorianDesk;

assetLoader.load(victorianDeskUrl.href, function (gltf) {
    victorianDesk = gltf.scene;
    victorianDesk.scale.x = 2
    victorianDesk.scale.y = 2
    victorianDesk.scale.z = 2
    victorianDesk.position.set(-9, 1, 9);
    victorianDesk.isDraggable = true;
    scene.add(victorianDesk);
    
    console.log(victorianDesk);

    victorianDeskShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    vicorianDeskBody = new CANNON.Body({ mass: 1 })
    vicorianDeskBody.addShape(victorianDeskShape)
    vicorianDeskBody.position.x = victorianDesk.position.x
    vicorianDeskBody.position.y = victorianDesk.position.y
    vicorianDeskBody.position.z = victorianDesk.position.z
    world.addBody(vicorianDeskBody)

    victorianDesk.children[0].draggable = true;

    objects.push(victorianDesk);

    mixer = new THREE.AnimationMixer(victorianDesk);
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

const texture = textureLoader.load(laminate2)

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.x = 10;
texture.repeat.y = 10;

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.rotation.x = -0.5 * Math.PI;
planeMesh.receiveShadow = true
scene.add(planeMesh)

const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

const plane2Geometry = new THREE.PlaneGeometry(30, 15, 30, 15);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xcfbc91,
    side: THREE.DoubleSide
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
plane2.position.set(0, 5, 15);
scene.add(plane2);

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
        armchairs[0].rotation.y = -1
        scene.add(armchairs[0])
    } else if (e === '1') {
        scene.remove(armchairs[1]);
        scene.remove(armchairs[0]);
        armchairs[1].position.set(-3, 1, -3);
        armchairs[1].rotation.y = -1
        scene.add(armchairs[1])
    }
});

const controls = new DragControls(objects, camera, renderer.domElement);
controls.deactivate();
controls.activate();

window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const physicsFolder = gui.addFolder('Physics')
physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
physicsFolder.open()

const clock = new THREE.Clock()
let delta;

function animate() {
    requestAnimationFrame(animate)

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;

    rayCaster.setFromCamera(mousePosition, camera);

    delta = clock.getDelta()
    delta = Math.min(delta, 0.1)
    world.step(delta)

    if(victorianDesk && victorianDesk.position && victorianDesk.quaternion)
    {
        victorianDesk.position.set(
            vicorianDeskBody.position.x,
            vicorianDeskBody.position.y,
            vicorianDeskBody.position.z
        );
    
        victorianDesk.quaternion.set(
            vicorianDeskBody.quaternion.x,
            vicorianDeskBody.quaternion.y,
            vicorianDeskBody.quaternion.z,
            vicorianDeskBody.quaternion.w
        );
    }

    render();
}

function render() {
    renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/*
function dragModel() {
    // If 'holding' an model, move the model
    if (draggableModel) {
      rayCaster.setFromCamera(moveMouse, camera);
      const found = rayCaster.intersectObjects(scene.children);
      if (found.length > 0) {
        for (let obj3d of found) {
          if (!obj3d.object.isDraggablee) {
            draggableModel.position.x = obj3d.point.x;
            draggableModel.position.z = obj3d.point.z;
            break;
          }
        }
      }
    }
  }
  
  // Allows user to pick up and drop models on-click events
  window.addEventListener("click", (event) => {
    // If 'holding' model on-click, set container to <undefined> to 'drop' the model.
    if (draggableModel) {
      draggableModel = undefined;
      return;
    }
  
    // If NOT 'holding' model on-click, set container to <object> to 'pickup' the model.
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(clickMouse, camera);
    const found = rayCaster.intersectObjects(scene.children, true);
    if (found.length) {
      // Cycle upwards through every parent until it reaches the topmost layer
      // This top layer is the group created by the GLTFLoader function
      let current = found[0].object;
      while (current.parent.parent !== null) {
        current = current.parent;
      }
      if (current.isDraggable) {
        draggableModel = current;
      }
    }
  });
  
  // Constantly updates the mouse location for use in `dragModel()`
  window.addEventListener("mousemove", (event) => {
    dragModel(); // Updates the model's postion everytime the mouse moves
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  */