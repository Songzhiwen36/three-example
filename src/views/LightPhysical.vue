<template>
  <div id="container" ref="containerRef"></div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { onMounted, ref } from 'vue'

const route = useRoute()
document.title = route.meta.title

const containerRef = ref(null)

let camera, scene, renderer, bulbLight, bulbMat, hemiLight, stats
let ballMat, cubeMat, floorMat

let previousShadowMap = false

const bulbLuminousPowers = {
  '110000 lm (1000W)': 110000,
  '3500 lm (300W)': 3500,
  '1700 lm (100W)': 1700,
  '800 lm (60W)': 800,
  '400 lm (40W)': 400,
  '180 lm (25W)': 180,
  '20 lm (4W)': 20,
  'Off': 0
}

const hemiLuminousIrradiances = {
  '0.0001 lx (Moonless Night)': 0.0001,
  '0.002 lx (Night Airglow)': 0.002,
  '0.5 lx (Full Moon)': 0.5,
  '3.4 lx (City Twilight)': 3.4,
  '50 lx (Living Room)': 50,
  '100 lx (Very Overcast)': 100,
  '350 lx (Office Room)': 350,
  '400 lx (Sunrise/Sunset)': 400,
  '1000 lx (Overcast)': 1000,
  '18000 lx (Daylight)': 18000,
  '50000 lx (Direct Sun)': 50000
}

const params = {
  shadows: true,
  exposure: 0.68,
  bulbPower: Object.keys(bulbLuminousPowers)[4],
  hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
}

stats = new Stats()

camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(-4, 2, 4)

scene = new THREE.Scene()

const bulbGeometry = new THREE.SphereBufferGeometry(0.02, 16, 8)
bulbLight = new THREE.PointLight('#ffee88', 1, 100, 2) // color, intensity, distance, decay

bulbMat = new THREE.MeshStandardMaterial({
  emissive: '#ffffee',
  emissiveIntensity: 1,
  color: '#000000'
}) 
bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat)) // 灯泡集合体添加到灯光中
bulbLight.position.set(0, 2, 0)
bulbLight.castShadow = true
scene.add(bulbLight)

hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02)
scene.add(hemiLight)

floorMat = new THREE.MeshStandardMaterial({
  roughness: 0.8,
  color: '#ffffff',
  metalness: 0.2, // 金属度
  bumpScale: 0.0005 // 凹凸贴图
})
const textureLoader = new THREE.TextureLoader()
// 加载地板贴图
textureLoader.load('/textures/hardwood2_diffuse.jpg', (map) => {
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.anisotropy = 4 // 各向异性过滤
  map.repeat.set(10, 24) // 重复10次，24次
  map.encoding = THREE.sRGBEncoding // sRGB编码
  floorMat.map = map
  floorMat.needsUpdate = true
})
// 加载地板凹凸贴图
textureLoader.load('/textures/hardwood2_bump.jpg', (map) => {
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.anisotropy = 4
  map.repeat.set(10, 24)
  floorMat.bumpMap = map
  floorMat.needsUpdate = true
})
// 加载地板粗糙贴图
textureLoader.load('/textures/hardwood2_roughness.jpg', (map) => {
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.anisotropy = 4
  map.repeat.set(10, 24)
  floorMat.roughnessMap = map
  floorMat.needsUpdate = true
})

cubeMat = new THREE.MeshStandardMaterial({
  roughness: 0.7,
  color: '#ffffff',
  metalness: 0.2,
  bumpScale: 0.002
})
// 加载立方体贴图
textureLoader.load('/textures/brick_diffuse.jpg', (map) => {
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.anisotropy = 4
  map.repeat.set(1, 1)
  map.encoding = THREE.sRGBEncoding
  cubeMat.map = map
  cubeMat.needsUpdate = true
})
// 加载立方体凹凸贴图
textureLoader.load('/textures/brick_bump.jpg', (map) => {
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.anisotropy = 4
  map.repeat.set(1, 1)
  cubeMat.bumpMap = map
  cubeMat.needsUpdate = true
})

ballMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.5,
  metalness: 1.0, // 金属度
})
textureLoader.load('/textures/planets/earth_atmos_2048.jpg', (map) => {
  map.anisotropy = 4
  map.encoding = THREE.sRGBEncoding
  ballMat.map = map
  ballMat.needsUpdate = true
})
textureLoader.load('/textures/planets/earth_specular_2048.jpg', (map) => {
  map.anisotropy = 4
  map.encoding = THREE.sRGBEncoding
  ballMat.metalnessMap = map
  ballMat.needsUpdate = true
})

const floorGeometry = new THREE.PlaneBufferGeometry(20, 20)
const floorMesh = new THREE.Mesh(floorGeometry, floorMat)
floorMesh.receiveShadow = true // 接收阴影
floorMesh.rotation.x = -Math.PI / 2.0 // 旋转90度
scene.add(floorMesh)

const ballGeometry = new THREE.SphereBufferGeometry(0.5, 32, 32) // 半径，水平分段，垂直分段
const ballMesh = new THREE.Mesh(ballGeometry, ballMat)
ballMesh.position.set(1, 0.5, 1)
ballMesh.rotation.y = Math.PI // 旋转180度
ballMesh.castShadow = true // 投射阴影
scene.add(ballMesh)

const boxGeometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5)
const boxMesh = new THREE.Mesh(boxGeometry, cubeMat)
boxMesh.position.set(-0.5, 0.25, -1)
boxMesh.castShadow = true
scene.add(boxMesh)

const boxMesh2 = new THREE.Mesh(boxGeometry, cubeMat)
boxMesh2.position.set(0, 0.25, -5)
boxMesh2.castShadow = true
scene.add(boxMesh2)

const boxMesh3 = new THREE.Mesh(boxGeometry, cubeMat)
boxMesh3.position.set(7, 0.25, 0)
boxMesh3.castShadow = true
scene.add(boxMesh3)

renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding // sRGB编码
renderer.shadowMap.enabled = true // 开启阴影
renderer.toneMapping = THREE.ReinhardToneMapping // 色调映射
renderer.setPixelRatio(window.devicePixelRatio) // 设置像素比
renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染器大小

const controls = new OrbitControls(camera, renderer.domElement) // 创建控制器
controls.minDistance = 1 // 最小距离
controls.maxDistance = 20 // 最大距离

const gui = new GUI()
gui.add(params, 'hemiIrradiance', Object.keys(hemiLuminousIrradiances))
gui.add(params, 'bulbPower', Object.keys(bulbLuminousPowers))
gui.add(params, 'exposure', 0, 1)
gui.add(params, 'shadows')
gui.open()


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function init() {
  if (containerRef.value) {
    containerRef.value.appendChild(stats.dom)
    containerRef.value.appendChild(renderer.domElement)
  }
  window.addEventListener('resize', onWindowResize)
}

function render() {
  renderer.toneMappingExposure = Math.pow(params.exposure, 5.0) // 色调映射曝光度
  renderer.shadowMap.enabled = params.shadows // 开启阴影
  bulbLight.castShadow = params.shadows // 开启灯光投射阴影

  if (params.shadows !== previousShadowMap) {
    ballMat.needsUpdate = true
    cubeMat.needsUpdate = true
    floorMat.needsUpdate = true
    previousShadowMap = params.shadows
  }

  bulbLight.power = bulbLuminousPowers[params.bulbPower] // 灯光亮度
  bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0) // 从强度转换到灯泡表面的辐照度

  hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance] // 半球光亮度
  const time = Date.now() * 0.0005

  bulbLight.position.y = Math.cos(time) * 0.75 + 1.25 // 灯光位置
  renderer.render(scene, camera)
  stats.update()
}

function animate() {
  requestAnimationFrame(animate)
  render()
}

onMounted(() => {
  init()
  animate()
})

</script>