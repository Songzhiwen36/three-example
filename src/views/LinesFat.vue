<template>
  <div class="container" ref="containerRef">
    
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import * as GeometryUtils from 'three/examples/jsm/utils/GeometryUtils.js'
import { onMounted, ref } from 'vue'
import strightLine from '@/components/straightLine'

const route = useRoute()
document.title = route.meta.title

const containerRef = ref(null)

let line, renderer, scene, camera, camera2, controls
let line1
let matLine, matLineBasic, matLineDashed
let stats, gpuPanel
let gui

// 内嵌显示的宽高
let insetWidth
let insetHeight

function init() {

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true }) 
  renderer.setPixelRatio(window.devicePixelRatio) 
  renderer.setClearColor(0x000000, 0.0) 
  renderer.setSize(window.innerWidth, window.innerHeight) 
  containerRef.value.appendChild(renderer.domElement) 

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(- 40, 0, 60)

  camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000)
  camera2.position.copy(camera.position)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 10
  controls.maxDistance = 500


  // Position and THREE.Color Data
  // 声明并初始化了一个positions数组和一个colors数组，用于存储曲线上的所有点的位置和颜色信息
  const positions = []
  const colors = []
  // 调用GeometryUtils.hilbert3D函数来生成一组点，用于构建三维赫尔伯特曲线
  const points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7)
  // 使用这些点初始化了一个CatmullRomCurve3对象，表示一条光滑的曲线路径
  const spline = new THREE.CatmullRomCurve3(points)
  // 计算了曲线路径的长度，并将其细分成了若干个线段
  const divisions = Math.round(12 * points.length)
  const point = new THREE.Vector3()
  const color = new THREE.Color()
  // 遍历每个线段，根据曲线路径上的参数t，计算出该线段的起点和终点，将这些点的位置信息添加到positions数组中
  for (let i = 0, l = divisions; i < l; i++) {
    // 根据参数t，计算出当前点的颜色，并将该颜色信息添加到colors数组中
    const t = i / l

    spline.getPoint(t, point)
    positions.push(point.x, point.y, point.z)

    color.setHSL(t, 1.0, 0.5)
    colors.push(color.r, color.g, color.b)

  }

  // 创建一个LineGeometry对象，并将positions数组作为其顶点位置信息，colors数组作为其顶点颜色信息
  const geometry = new LineGeometry()
  geometry.setPositions(positions)
  geometry.setColors(colors)
  // 创建一个LineMaterial对象，并指定其颜色、线宽度、是否使用顶点颜色等参数
  matLine = new LineMaterial({

    color: 0xffffff,
    linewidth: 5, // in world units with size attenuation, pixels otherwise
    vertexColors: true,

    //resolution:  // to be set by renderer, eventually
    dashed: false,
    alphaToCoverage: true,

  })
  // 使用LineGeometry和LineMaterial创建一个Line2对象，表示一条带有颜色渐变的三维曲线
  line = new Line2(geometry, matLine)
  // 计算该曲线上每个点到起点的距离，并将这些距离信息存储到Line2对象的属性中
  line.computeLineDistances()
  line.scale.set(1, 1, 1)
  scene.add(line)


  // THREE.Line ( THREE.BufferGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE_STRIP

  // 创建一个新的缓冲区几何体对象
  const geo = new THREE.BufferGeometry()
  // 将顶点位置和顶点颜色数据添加到缓冲区几何体中
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  matLineBasic = new THREE.LineBasicMaterial({ vertexColors: true })
  matLineDashed = new THREE.LineDashedMaterial({ vertexColors: true, scale: 2, dashSize: 1, gapSize: 1 })

  line1 = new THREE.Line(geo, matLineBasic)
  line1.computeLineDistances()
  line1.visible = false
  scene.add(line1)

  // =================场景中添加一条线=================
  scene.add(strightLine)



  window.addEventListener('resize', onWindowResize)
  onWindowResize()

  stats = new Stats()
  document.body.appendChild(stats.dom)

  gpuPanel = new GPUStatsPanel(renderer.getContext())
  stats.addPanel(gpuPanel)
  stats.showPanel(0)

  initGui()
}

function animate() {

  requestAnimationFrame(animate)

  stats.update()

  // main scene

  renderer.setClearColor(0x000000, 0)

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)

  // renderer will set this eventually
  matLine.resolution.set(window.innerWidth, window.innerHeight) // resolution of the viewport
  strightLine.material.resolution.set(window.innerWidth, window.innerHeight)

  gpuPanel.startQuery()
  renderer.render(scene, camera)
  gpuPanel.endQuery()

  // inset scene

  renderer.setClearColor(0x222222, 1)

  renderer.clearDepth() // important!

  renderer.setScissorTest(true)

  renderer.setScissor(20, 20, insetWidth, insetHeight)

  renderer.setViewport(20, 20, insetWidth, insetHeight)

  camera2.position.copy(camera.position)
  camera2.quaternion.copy(camera.quaternion)

  // renderer will set this eventually
  matLine.resolution.set(insetWidth, insetHeight) // resolution of the inset viewport

  renderer.render(scene, camera2)

  renderer.setScissorTest(false)

}

function onWindowResize() {
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

  insetWidth = window.innerHeight / 4 // square
  insetHeight = window.innerHeight / 4

  camera2.aspect = insetWidth / insetHeight
  camera2.updateProjectionMatrix()

}

function initGui() {
  gui = new GUI()

  const param = {
    'line type': 0,
    'world units': false,
    'width': 5,
    'alphaToCoverage': true,
    'dashed': false,
    'dash scale': 1,
    'dash / gap': 1
  }

  gui.add(param, 'line type', { 'LineGeometry': 0, 'gl.LINE': 1 }).onChange(function (val) {

    switch (val) {

    case 0:
      line.visible = true
      line1.visible = false
      break
    
    case 1:
      line.visible = false
      line1.visible = true
      break

    }

  })





}

onMounted(() => {
  init()
  animate()
})
</script>

<style scoped>

</style>


