import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Vertex from './shader/vertex.glsl'
import Fragment from './shader/fragment.glsl'

/**
 * dat gui
 */
const gui = new dat.GUI({
    width: 400
})

//canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * scene
 */
const scene = new THREE.Scene()

/**
 * enviorements maps
 */

 const cubeTextureLoader = new THREE.CubeTextureLoader()
 const enviorementMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.png',
    '/textures/environmentMaps/1/nx.png',
    '/textures/environmentMaps/1/py.png',
    '/textures/environmentMaps/1/ny.png',
    '/textures/environmentMaps/1/pz.png',
    '/textures/environmentMaps/1/nz.png'
 ])

/**
 * Geometries
 */
const sphere = new THREE.SphereBufferGeometry(1, 32, 32)
const material = new THREE.ShaderMaterial({
    vertexShader: Vertex,
    fragmentShader: Fragment, 
    transparent: true,
    uniforms: {
        uTime: {value: 0},
        RefractionRatio: { value: 1.02 },
        FresnelBias: { value: 0.1 },
        FresnelPower: { value: 2.0 },
        FresnelScale: { value: 1.0 },
        tCube: { value: null }
    } 
})
const mesh = new THREE.Mesh(sphere, material)
scene.add(mesh)

material.uniforms.tCube.value = enviorementMapTexture
scene.background = enviorementMapTexture

/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 5)
scene.add(camera)

/**
 * controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()


const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //update controls
    controls.update()

    material.uniforms.uTime.value = elapsedTime

    //renderer
    renderer.render(scene, camera)

    //requestAnimationFunction
    window.requestAnimationFrame(tick)
}


tick()


