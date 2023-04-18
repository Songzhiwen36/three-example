<template>
  <div ref="containerRef" class="container"></div>
</template>

<script setup>
import * as THREE from 'three'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { render } from 'ejs'

const route = useRoute()
document.title = route.meta.title

const containerRef = ref(null)

let camera, scene, renderer, startTime, object, stats



function init() {

    scene = new THREE.Scene()

    const helper = new THREE.AxesHelper(3)
    scene.add(helper)

    camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.25, 16)
    camera.position.set(0, 6, 6.5)

    // light
    scene.add(new THREE.AmbientLight('#505050'))
    const spotLight = new THREE.SpotLight('#ffffff')
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.position.set(2, 3, 3)
    // spotLight.castShadow = true
    // spotLight.shadow.camera.near = 3
    // spotLight.shadow.camera.far = 10
    // spotLight.shadow.mapSize.width = 1024
    // spotLight.shadow.mapSize.height = 1024
    scene.add(spotLight)

    const dirLight = new THREE.DirectionalLight('#55505a', 1)
    dirLight.position.set(0, 3, 0)
    // dirLight.castShadow = true
    // dirLight.shadow.camera.near = 1
    // dirLight.shadow.camera.far = 10
    // dirLight.shadow.camera.right = 1
    // dirLight.shadow.camera.left = -1
    // dirLight.shadow.camera.top = 1
    // dirLight.shadow.camera.bottom = -1
    // dirLight.shadow.mapSize.width = 1024
    // dirLight.shadow.mapSize.height = 1024
    scene.add(spotLight)

    // 裁剪平面
    const localPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.2)
    const globalPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1)

    // 集合体
    const material = new THREE.MeshPhongMaterial({
        color: '#80ee10',
        shininess: 100,
        side: THREE.DoubleSide,

        // clipping setup (material)
        clippingPlanes: [localPlane],
        clipShadows: true
    })
    const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20)
    object = new THREE.Mesh(geometry, material)
    object.scale.setScalar(2)
    object.castShadow = true
    scene.add(object)
    
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(9, 9, 1, 1),
        new THREE.MeshPhongMaterial({
            color: '#a0adaf',
            shininess: 150
        })
    )
    ground.rotation.x = -Math.PI / 2
    // ground.receiveShadow = true
    scene.add(ground)

    // stats
    stats = new Stats()
    containerRef.value.appendChild(stats.dom)

    // renderer
    renderer = new THREE.WebGLRenderer()
    // renderer.shadowMap.enabled = true
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.value.appendChild(renderer.domElement)

    // clipping setup (renderer)
    renderer.localClippingEnabled = true

    // controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()

    // start
    // startTime = Date.now()
}

function animate() {
    // const currentTime = Date.now()
    // const time = (currentTime - startTime) / 1000

    requestAnimationFrame(animate)
    
    stats.begin()
    renderer.render(scene, camera)
    stats.end()
}

onMounted(() => {
    init()
    animate()
})

</script>

