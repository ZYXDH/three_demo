<template>
  <div class="container">
    <canvas id="draw" style="border: 1px solid; background-color: #000"></canvas>
    <div class="config-box">
      <div @click="changeLightPower" class="btn-box">关灯</div>
      <div @click="deleteObj" class="btn-box">删除</div>
      <div @click="moveObj" class="btn-box move-area">
        <div class="move-item" data-type="X-1">X</div>
        <div class="move-item" data-type="Y-1">Y</div>
        <div class="move-item" data-type="Z-1">Z</div>
        <div class="move-item" data-type="X-2">X</div>
        <div class="move-item" data-type="Y-2">Y</div>
        <div class="move-item" data-type="Z-2">Z</div>
      </div>
    </div>
  </div>
</template>

<script setup="props" lang="ts">
import { reactive } from 'vue'
import router from '@/router'
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器
import { getAssetsFile } from '@/utils/img'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Light } from 'three'
//canvas的大小
// wxshare()
const state = reactive({
  hjLightPower: 1
})
const changeLightPower = () => {
  // state.hjLightPower -= 0.1
  console.log('触发了')
  // createLight()
  let obj = scene.getObjectByName('环境灯光')
  // console.log(obj);
  obj.intensity = 0.3

  // scene.remove(obj);
  // renderer.render(scene, camera)
  // init()
}
const deleteObj = () => {
  // console.log(newObj)
  group.remove(newObj)
  scene.remove(outline)
  renderer.render(scene, camera)
}
const moveObj = (event: any) => {
  // console.log(event)
  let { type } = event.target.dataset
  console.log(type)
  let position = newObj.position
  switch (type) {
    case 'X-1':
      position.x += 1
      break
    case 'Y-1':
      position.y += 1
      break
    case 'Z-1':
      position.z += 1
      break
    case 'X-2':
      position.x -= 1
      break
    case 'Y-2':
      position.y -= 1
      break
    case 'Z-2':
      position.z -= 1
      break

    default:
      break
  }
  outline.setFromObject(newObj)
  outline.update()
  renderer.render(scene, camera)
}
let scene = null as any //场景
let camera = null as any //相机
let canvas = null as any //用作渲染的canvas
let renderer = null as any //渲染器
let controls = null as any
let hjLight = null as any
let newObj = null as any
let outline = null as any
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
const group = new THREE.Group() //用于将建筑物的各个零件组合起来

const init = () => {
  //canvas的大小
  const width = 1000
  const height = 1000
  //建筑的长宽
  const baseWidth = 40
  const baseLength = 40
  const baseHeight = 40

  canvas = document.querySelector('#draw')
  //创建场景
  scene = new THREE.Scene()
  //创建一个透视相机
  camera = new THREE.PerspectiveCamera(125, width / height, 1, 2000)
  //设置相机位置
  camera.position.set(0, 200, 10)
  //创建环境光
  hjLight = new THREE.AmbientLightProbe(0xffffff, state.hjLightPower)
  // hjLight.target=()
  hjLight.name = '环境灯光'
  // hjLight.position.set()
  //添加环境光至场景
  scene.add(hjLight)

  //添加房子的group到场景中
  scene.add(group)
  //添加轨道控制器

  //渲染器
  renderer = new THREE.WebGLRenderer({
    canvas, //传入要渲染的canvas，相关参数可以看文档
    antialias: true, //抗锯齿
    alpha: true
  })
  //设置渲染器大小
  renderer.setSize(width, height)
  controls = new OrbitControls(camera, canvas)
  //执行

  //创建地面
  function createGround() {
    //导入材质
    const groundTexture = new THREE.TextureLoader().load(getAssetsFile('three/cao.webp'))
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(100, 100)
    const ground = new THREE.CircleGeometry(500, 100)
    const groundMaterial = new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
      map: groundTexture
      // transparent: true,
      // opacity: 0.2,
    })

    const groundMesh = new THREE.Mesh(ground, groundMaterial)
    groundMesh.name = '地面' //设置name属性
    groundMesh.rotateX(-Math.PI / 2) //旋转用于呈现一个水平的地面
    scene.add(groundMesh)
  }
  createGround()
  function createFloor() {
    const texture = new THREE.TextureLoader().load(getAssetsFile('three/wood.jpg'))
    //设置地板大小，由于后面将要生成墙体存在设置为1的厚度，因此这里对地板的x，z均-2
    const floor = new THREE.BoxGeometry(baseWidth, 1, baseLength)
    const material = new THREE.MeshPhongMaterial({ map: texture })
    const mesh = new THREE.Mesh(floor, material)
    return mesh
  }
  function floors() {
    let floorArr = [] as Array<any>
    const floorConfig = [
      // 地板
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: baseLength },
      { x: baseWidth * 1, y: 0, z: baseLength },
      { x: baseWidth * 1, y: 0, z: 0 },
      { x: baseWidth * 2, y: 0, z: 0 },
      { x: baseWidth * 3, y: 0, z: 0 },
      { x: baseWidth * 2, y: 0, z: baseLength },
      { x: baseWidth * 3, y: 0, z: baseLength },
      // 屋顶
      { x: 0, y: baseHeight, z: 0 },
      { x: 0, y: baseHeight, z: baseLength },
      { x: baseWidth * 1, y: baseHeight, z: baseLength },
      { x: baseWidth * 1, y: baseHeight, z: 0 },
      { x: baseWidth * 2, y: baseHeight, z: 0 },
      { x: baseWidth * 3, y: baseHeight, z: 0 },
      { x: baseWidth * 2, y: baseHeight, z: baseLength },
      { x: baseWidth * 3, y: baseHeight, z: baseLength }
    ]

    floorConfig.forEach((item, index) => {
      let floorItem = createFloor()
      floorItem.position.set(item.x, item.y, item.z)
      floorItem.name = `地板-${index}`
      floorArr.push(floorItem)
    })
    floorArr.forEach((item) => {
      group.add(item)
    })
  }
  floors()

  function createWall() {
    const wallTexture = new THREE.TextureLoader().load(getAssetsFile('three/wall1.jpg'))
    const wall = new THREE.BoxGeometry(baseLength, baseHeight, 1)
    const wallMaterial = new THREE.MeshPhongMaterial({
      map: wallTexture
    })
    //墙体的网格
    const wallMesh = new THREE.Mesh(wall, wallMaterial)
    return wallMesh
  }
  // function createWall
  function wallMethot() {
    let walls = [] as Array<any>
    const wallConfigs = [
      { roY: Math.PI, x: 0, y: baseHeight / 2, z: -baseLength / 2, havehole: { type: 'door' } }
      // { roY: Math.PI, x: baseWidth * 1, y: baseHeight / 2, z: -baseLength / 2 },
      // { roY: Math.PI, x: baseWidth * 2, y: baseHeight / 2, z: -baseLength / 2 },
      // { roY: Math.PI, x: baseWidth * 3, y: baseHeight / 2, z: -baseLength / 2 },
      // { roY: Math.PI / 2, x: -baseWidth / 2, y: baseHeight / 2, z: 0 },
      // { roY: Math.PI / 2, x: -baseWidth / 2 + (baseWidth - 1) * 1 - 2, y: baseHeight / 2, z: 0 },
      // { roY: Math.PI / 2, x: -baseWidth / 2 + (baseWidth - 1) * 3 - 2, y: baseHeight / 2, z: 0 },
      // { roY: Math.PI / 2, x: -baseWidth / 2 + (baseWidth - 1) * 4 - 2, y: baseHeight / 2, z: 0 },
      // { roY: Math.PI / 2, x: -baseWidth / 2, y: baseHeight / 2, z: baseLength },
      // { roY: Math.PI / 2, x: -baseWidth / 2 + (baseWidth - 1) * 1 - 2, y: baseHeight / 2, z: baseLength },
      // { roY: Math.PI / 2, x: -baseWidth / 2 + (baseWidth - 1) * 3 - 2, y: baseHeight / 2, z: baseLength },
      // { roY: Math.PI / 2, x: -baseWidth / 2 + (baseWidth - 1) * 4 - 2, y: baseHeight / 2, z: baseLength }
    ]
    wallConfigs.forEach((item, index) => {
      let wallItem = createWall()
      wallItem.rotateY(item.roY)
      wallItem.position.set(item.x, item.y, item.z)
      wallItem.name = `墙-${index}`
      // if (item.havehole) {
      //   const door = new THREE.Path()
      //   //门的位置
      //   door.moveTo(baseWidth / 2 + 5, 0)
      //   door.lineTo(baseWidth / 2 + 5, 16)
      //   door.lineTo(baseWidth / 2 - 5, 16)
      //   door.lineTo(baseWidth / 2 - 5, 0)
      //   door.lineTo(baseWidth / 2 + 5, 0)
      //   wallItem.holes.push(door)
      // }
      walls.push(wallItem)
    })
    walls.forEach((item) => {
      group.add(item)
    })
  }
  wallMethot()

  // 创建一个灯泡

  function genwallShape() {
    const shape = new THREE.Shape()
    let height = baseHeight //墙的高度
    shape.moveTo(0, 0) //起点
    shape.lineTo(0, height) //墙体高度
    shape.lineTo(baseWidth / 2 - 1, height + 5) //墙体顶点
    shape.lineTo(baseWidth / 2 - 1, height + 6) //墙体顶点
    shape.lineTo(baseWidth / 2 + 1, height + 6) //墙体顶点
    shape.lineTo(baseWidth / 2 + 1, height + 5) //墙体顶点
    shape.lineTo(baseWidth, height)
    shape.lineTo(baseWidth, 0)
    shape.lineTo(0, 0)
    return { shape }
  }
  //创建不规则墙体
  function createIrregularWall(shape: any, position: any) {
    const extrudeSettings = {
      depth: 1, //定义深度，由于挤压几何体的点位都是x，y坐标组成的二位平面，这个参数定义向z轴的延展长度，即为墙的厚度
      bevelEnabled: false
    }
    const wallTexture = new THREE.TextureLoader().load(getAssetsFile('three/wall1.jpg'))
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
    wallTexture.repeat.set(0.05, 0.05)
    const material = new THREE.MeshPhongMaterial({ map: wallTexture })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...position)
    group.add(mesh)
    return mesh
  }
  //创建不带门的不规则墙体
  function createNoDoorWall() {
    let { shape } = genwallShape()
    let mesh = createIrregularWall(shape, [-baseWidth / 2, 0, -baseLength / 2])
    mesh.name = '带门的墙对面的墙'
  }
  function createDoorWall() {
    let { shape } = genwallShape()
    const door = new THREE.Path()
    //门的位置
    door.moveTo(baseWidth / 2 + 5, 0)
    door.lineTo(baseWidth / 2 + 5, 16)
    door.lineTo(baseWidth / 2 - 5, 16)
    door.lineTo(baseWidth / 2 - 5, 0)
    door.lineTo(baseWidth / 2 + 5, 0)
    // 形状上的孔洞
    shape.holes.push(door)
    let mesh = createIrregularWall(shape, [-baseWidth / 2, 0, baseLength / 2 - 1])
    mesh.name = '带门的墙'
  }
  function onPointerMove(event: any) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / width) * 2 - 1
    pointer.y = -(event.clientY / height) * 2 + 1
  }
  canvas.addEventListener(
    'click',
    (event: any) => {
      onPointerMove(event)
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(scene.children)
      // console.log(intersects[0])
      console.log('点击了', intersects[0]?.object?.name)
      if (!intersects[0]?.object?.name) {
        return
      }
      let obj = scene.getObjectByName('选中边框')
      if (obj) {
        scene.remove(obj)
      }
      newObj = intersects[0].object
      outline = new THREE.BoxHelper()
      outline.name = '选中边框'
      outline.setFromObject(newObj)
      scene.add(outline)
    },
    false
  )

  // createDoorWall()

  // createNoDoorWall()
  // const frontWall = createWall()
  // frontWall.rotateY(Math.PI)
  // frontWall.position.set(0, 10, 30)
  // const endWall = frontWall.clone()
  // endWall.rotateY(Math.PI)
  // endWall.position.set(0, 10, -30)
  // group.add(endWall)
  // group.add(frontWall)
  // group.add(rightWall)
  // group.add(leftWall)
  // setTimeout(() => {

  animate()
  // }, 100)
}
function createLight() {
  const geometry = new THREE.BoxGeometry(5, 5, 5)
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(40, 36, 20)
  const light = new THREE.PointLight(0xffffff, 1, 100)
  light.name = '灯光'
  // hjLight.target=()
  light.position.set(40, 36, 20)
  //添加环境光至场景
  scene.add(light)
  scene.add(cube)
}

const animate = () => {
  controls.update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
const toUser = () => {
  router.push('User')
}
onMounted(() => {
  //***一些代码
  init()
  // setInterval(()=>{
  //   state.hjLightPower-=0.1
  // })
})
</script>

<style lang="less" scoped>
.contain-content {
  width: 100vw;
  margin-top: calc(@titleMarginTop + @titleMarginBottom + 48px);
  height: calc(100vh - (@titleMarginTop + @titleMarginBottom + 48px));
  position: absolute;
  top: 0;
}
.config-box {
  position: fixed;
  right: 0;
  top: 0;
  width: 100px;
  height: 100px;
  .btn-box {
    width: 40px;
    height: 30px;
    margin: 10px;
    border-radius: 5px;
    background-color: aqua;
  }
  .move-area {
    display: flex;
    flex-wrap: wrap;
    .move-item {
      width: 12px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
