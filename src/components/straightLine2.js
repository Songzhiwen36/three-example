import * as THREE from 'three'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'

const positions = []
const colors = []
const startPoint = new THREE.Vector3(0, 0, 0)
const endPoint = new THREE.Vector3(0, 30, 0)

const strightLine = new THREE.LineCurve3(
    startPoint,
    endPoint
)
// 将直线信息添加到positions数组中
strightLine.getPoints(50).forEach((point, index, array) => {
    positions.push(point.x, point.y, point.z)
    // 计算透明度
    const alpha = 1 - index / array.length
    // 将这条线的颜色设置为绿色到白色的渐变色
    colors.push(0, 1, 0, alpha)
})

const geometry = new LineGeometry()
geometry.setPositions(positions)
geometry.setColors(colors)

const material = new LineMaterial({
    color: 0xffffff,
    linewidth: 5, // in pixels
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,
})

const line = new Line2(geometry, material)
console.log(line)

export default line
