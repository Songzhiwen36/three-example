<template>
  <div id="container" ref="containerRef"></div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { ref, onMounted } from 'vue'

const route = useRoute()
document.title = route.meta.title

let mixer
const clock = new THREE.Clock()
const containerRef = ref(null)
const stats = new Stats()

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding

const pmremGenerator = new THREE.PMREMGenerator(renderer)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfe3dd)
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture

const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 100)
camera.position.set(5, 2, 8)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.5, 0)
controls.update()
controls.enablePan = false
controls.enableDamping = true

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/gltf/')

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load(
  '/models/LittlestTokyo.glb', 
  function (gltf) {
    const model = gltf.scene
    console.log('gltf: ', gltf)
    model.position.set(1, 1, 0)
    model.scale.set(0.01, 0.01, 0.01)
    console.log('模型: ', model)
    scene.add(model)

    // 创建一个新的动画混合器, 用于管理模型的所有动画
    mixer = new THREE.AnimationMixer(model)
    // 创建一个新的动画剪辑对象并播放该动画剪辑
    // 如果模型有多个动画剪辑, 需要为每个剪辑创建新的AnimationAction对象, 
    // 并使用AnimationMixer对象控制它们的播放
    mixer.clipAction(gltf.animations[0]).play()

    animate()
  },
  undefined,
  (e) => { console.error(e) }
)

function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  mixer.update(delta)
  controls.update()
  stats.update()
  renderer.render(scene, camera)
}




onMounted(() => {
  if (containerRef.value) {
    containerRef.value.appendChild(stats.dom)
    containerRef.value.appendChild(renderer.domElement)
  }
  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }
})

</script>

<style scoped>
body {
  background-color: #bfe3dd;
	color: #000;
}
a {
  color: #2983ff;
}
#container {
  height: 100vh;
}
</style>
