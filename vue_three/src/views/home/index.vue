<template>
  <div class="container">
    <canvas id="draw" style="border: 1px solid; background-color: #000"></canvas>
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
//canvas的大小
// wxshare()
const state = reactive({})

const init = () => {
  const canvas = document.querySelector('#draw')
  const scene = new THREE.Scene()
  const width = window.innerWidth
  const height = window.innerHeight
  const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000)
  camera.position.set(10, 10, 10)
  const light = new THREE.AmbientLight(0x404040, 3)
  // const floor = new THREE.PlaneGeometry(1500, 1500)
  // const floorTexture = new THREE.TextureLoader().load(getAssetsFile('three/cao.webp'))
  // floorTexture.repeat.set(1500, 1500)
  // const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture })
  // const floorMesh = new THREE.Mesh(floor, floorMaterial)
  // floorMesh.rotation.x = Math.PI * -0.5;
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

  scene.add(camera)
  // scene.add(floorMesh)
  scene.add(light)
  const renderer = new THREE.WebGLRenderer({
    canvas, //渲染器绘制其输出的canvas
    antialias: true, //是否抗锯齿
    alpha: true //canvas是否包含alpha (透明度)。默认为false
  })
  //设置渲染器大小，这里设置为整个窗口，会自动设置canvas的大小
  renderer.setSize(width, height)
  const loader = new GLTFLoader()
  function loadModel(path: any) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader()
      loader.load(path, resolve)
    })
  }
  //天空盒
  function createSkyBox() {
    const texture = new THREE.TextureLoader().load(getAssetsFile('three/sky.jpg'))
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    // texture.repeat.set(1, 1);
    const skyBox = new THREE.SphereGeometry(500, 100, 100)
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.BackSide
    })
    const skyBoxMesh = new THREE.Mesh(skyBox, material)
    scene.add(skyBoxMesh)
  }
  createSkyBox()
  let houseModel1 = null as any,
    houseModel2 = null as any
  let house1 = loadModel(getAssetsFile('three/house.glb')).then((res) => (houseModel1 = res))
  let house2 = loadModel(getAssetsFile('three/house.glb')).then((res) => (houseModel2 = res))


  const controls = new OrbitControls(camera, canvas);

  Promise.all([house1, house2]).then((val) => {
    //房子1
    houseModel1.scene.position.set(0, 3, 0) //设置模型位置
    houseModel1.scene.scale.set(20, 20, 20) //设置模型缩放
    scene.add(houseModel1.scene)
    //房子2
    houseModel2.scene.position.set(5, 1, 0)
    houseModel2.scene.scale.set(7, 7, 7)
    // houseModel2.scene.rotation.y = 90;
    scene.add(houseModel2.scene)

    render()
  })

  //调用渲染器的渲染方法，告诉它要渲染了
  // renderer.render(scene, camera);
  function render() {
    // console.log(renderer,scene, camera)
    setTimeout(() => {
      controls.update()
      requestAnimationFrame(render);
      renderer.render(scene, camera)
    }, 100)
  }
  render() //调用渲染方法
}

const toUser = () => {
  router.push('User')
}
onMounted(() => {
  //***一些代码
  init()
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
</style>
