<template>
  <div id="container" ref="containerRef"></div>
</template>

<script setup>

import * as THREE from 'three'
import { onMounted, ref } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 创建一个场景
const scene = new THREE.Scene()

// 创建一个光源
const light = new THREE.PointLight(0xffffff, 1, 100)

// 设置光源的位置
light.position.set(0, 0, 10)

// 将光源添加到场景中
scene.add(light)

// 创建一个平面几何体
const planeGeometry = new THREE.PlaneGeometry(10, 10)

// 创建一个发光材质
const emissiveMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  emissive: 0xff0000,
  emissiveIntensity: 1,
  side: THREE.DoubleSide // 平面网格是双面渲染的
})

// 创建一个平面网格
const plane = new THREE.Mesh(planeGeometry, emissiveMaterial)

// 设置平面网格的位置
plane.position.set(0, 0, -5)

// 将平面网格添加到场景中
scene.add(plane)

// 创建一个平面网格的说明标签
const planeLabel = document.createElement('div')
planeLabel.innerText = '这是一个平面网格模型'
planeLabel.style.position = 'absolute'
planeLabel.style.top = '10px'
planeLabel.style.left = '10px'


// 将平面网格的说明标签添加到平面网格上
const planeLabelObject = new THREE.CSS2DObject(planeLabel)
plane.add(planeLabelObject)

// 创建一个渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })

// 设置渲染器的大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 创建一个相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 设置相机的位置
camera.position.set(0, 0, 10)

// 将相机添加到场景中
scene.add(camera)

// 创建一个控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 控制器始终正面对着我
controls.target.set(0, 0, 0)

// 在页面加载后执行
onMounted(() => {
  // 将渲染器的输出（canvas元素）添加到页面中
  document.getElementById('container').appendChild(renderer.domElement)
  document.getElementById('container').appendChild(planeLabel) // 将标签添加到页面中
  // 渲染场景
  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
})

</script>

