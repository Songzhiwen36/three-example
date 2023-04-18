import * as THREE from 'three'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'

const positions = []
const colors = []
const startPoint = new THREE.Vector3(0, 0, 0)
const endPoint = new THREE.Vector3(0, 0, -30)

// const strightLine = new THREE.LineCurve3(
//     startPoint,
//     endPoint
// )
// 将直线信息添加到positions数组中
positions.push(startPoint.x, startPoint.y, startPoint.z, endPoint.x, endPoint.y, endPoint.z)
// strightLine.getPoints(50).forEach((point) => {
//     positions.push(point.x, point.y, point.z)
// })
// 将这条线的颜色设置为绿色到白色的渐变色
colors.push(0, 1, 0, 1, 1, 1)
const geometry = new LineGeometry()
geometry.setPositions(positions)
geometry.setColors(colors)

const material = new LineMaterial({
    color: 0xffffff,
    linewidth: 8, // in pixels
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,
})

const line = new Line2(geometry, material)
console.log(line)

export default line
