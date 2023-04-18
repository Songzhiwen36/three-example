<template>
  <div ref="containerRef" class="container"></div>
</template>

<script setup>
import * as THREE from 'three'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const route = useRoute()
document.title = route.meta.title

const containerRef = ref(null)
const SCREEN_WIDTH = window.innerWidth // 屏幕宽度
const SCREEN_HEIGHT = window.innerHeight // 屏幕高度

let camera, scene, scene2, renderer
let mouseX = 0, mouseY = 0

const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

function init() {
    camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 2000)
    camera.position.z = 1500

    scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')
    scene.fog = new THREE.Fog('#000000', 1500, 4000)

    scene2 = new THREE.Scene()
    scene2.background = new THREE.Color('#000000')
    scene2.fog = new THREE.Fog('#000000', 1500, 4000)

    // 地板
    const imageCanvas = document.createElement('canvas')
    const context = imageCanvas.getContext('2d')

    imageCanvas.width = imageCanvas.height = 128

    context.fillStyle = '#444444'
    context.fillRect(0, 0, 128, 128)

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 64, 64)
    context.fillRect(64, 64, 64, 64)

    const textureCanvas = new THREE.CanvasTexture(imageCanvas)
    textureCanvas.repeat.set(1000, 1000)
    textureCanvas.wrapS = THREE.RepeatWrapping
    textureCanvas.wrapT = THREE.RepeatWrapping

    const textureCanvas2 = textureCanvas.clone()
    textureCanvas2.magFilter = THREE.NearestFilter
    textureCanvas2.minFilter = THREE.NearestFilter


}

onMounted(() => {
    init()
})

</script>

<style scoped>
.lbl { color:#fff; 
  font-size:16px; 
  font-weight:bold; 
  position: absolute; 
  bottom:0px; 
  z-index:100; 
  text-shadow:#000 1px 1px 1px; 
  background-color:rgba(0,0,0,0.85); 
  padding:1em 
}

#lbl_left { text-align:left; left:0px }
#lbl_right { text-align:left; right:0px }

.g { color:#aaa }
.c { color:#fa0 }
</style>
