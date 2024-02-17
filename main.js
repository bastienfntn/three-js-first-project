import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { GLTFLoader } from "three/addons";

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: "#00ff83"
});

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

const pointLight1 = new THREE.PointLight(0xffffff, 300);
const pointLight2 = new THREE.PointLight(0xffffff, 300);
pointLight1.position.set(10, 15, 15);
pointLight2.position.set(-10, -10, -15);
scene.add(pointLight1, pointLight2);

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 100;
scene.add(camera);

const loader = new GLTFLoader();

loader.load('assets/beer_bottle_3d_model/scene.gltf', function (gltf) {
    const box = new THREE.Box3().setFromObject( gltf.scene );
    const size = box.getSize(new THREE.Vector3());
    camera.position.set(0, 0, 100);

    gltf.scene.position.y = -size.y / 2;

    scene.add(gltf.scene);

}, undefined, function (error) {
    console.error(error);
})


const canvas = document.querySelector('.webgl');

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
});

const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();

const tl = gsap.timeline({defaults: {duration: 1}});
tl.fromTo(mesh.scale, {x:0, y:0, z:0}, {x:1, y:1, z:1});
tl.fromTo('nav', { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

