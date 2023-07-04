/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "three";

declare module "three/addons/loaders/GLTFLoader.js"

declare module "three/addons/controls/OrbitControls.js"
