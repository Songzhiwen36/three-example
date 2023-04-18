<template>
  <div class="container" ref="containerRef">
    <div class="slider" ref="sliderRef"></div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted, ref } from 'vue'

const route = useRoute()
document.title = route.meta.title

let camera, renderer, controls
let sceneL, sceneR

let sliderPos = window.innerWidth / 2

const containerRef = ref(null)
const sliderRef = ref(null)


sceneL = new THREE.Scene()
sceneL.background = new THREE.Color('#BCD48F')
console.log('sceneL', sceneL)

sceneR = new THREE.Scene()
sceneR.background = new THREE.Color('#8FBCD4')
console.log('sceneR', sceneR)

camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 6

const light = new THREE.HemisphereLight('#ffffff', '#444444', 1) // soft white light
light.position.set(-2, 2, 2)
sceneL.add(light.clone())
sceneR.add(light.clone())

renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setScissorTest(true) // enable scissor test
renderer.setAnimationLoop(render)

function render() {
  renderer.setScissor(0, 0, sliderPos, window.innerHeight)
  renderer.render(sceneL, camera)

  renderer.setScissor(sliderPos, 0, window.innerWidth, window.innerHeight)
  renderer.render(sceneR, camera)
}

function initMeshed() {
  const geometry = new THREE.IcosahedronGeometry(1, 3)
  const meshL = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial())
  sceneL.add(meshL)
  const meshR = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ wireframe: true }))
  sceneR.add(meshR)
}


function initSlider() {
  function onPointerDown() {
    console.log('event', event)
    if (event.isPrimary === false) return
    controls.enabled = false
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  function onPointerUp() {
    controls.enabled = true
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  function onPointerMove(e) {
    if (event.isPrimary === false) return
    sliderPos = Math.max(0, Math.min(window.innerWidth, e.pageX))
    sliderRef.value.style.left = sliderPos - (sliderRef.value.offsetWidth / 2) + 'px'
  }

  sliderRef.value.touchAction = 'none'
  sliderRef.value.addEventListener('pointerdown', onPointerDown)

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function init() {
  if (containerRef.value) {
    initMeshed()
    initSlider()
    controls = new OrbitControls(camera, containerRef.value)
    containerRef.value.appendChild(renderer.domElement)
  }
  window.addEventListener('resize', onWindowResize)
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.slider {
  position: absolute;
  cursor: ew-resize;

  width: 40px;
  height: 40px;
  background-color: #F32196;
  opacity: 0.7;
  border-radius: 50%;

  top: calc(50% - 20px);
  left: calc(50% - 20px);
}
</style>


