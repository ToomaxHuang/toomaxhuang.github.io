import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"

import * as dat from "dat.gui"

import stoneImg from "@/static/stone.jpg"
import greyImg from "@/static/grey.jpg"
import brickNormalImg from "@/static/brick.jpg"
import waterNormalImg from "@/static/water_normal.png"

const Material = defineComponent({
    setup(props, context) {

        const canvasRef = ref<HTMLElement>()

        const scene = new THREE.Scene()

        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        /**
         * 纹理
         */
        const textureLoader = new THREE.TextureLoader()
        const stoneTexture = textureLoader.load(stoneImg)
        const greyTexture = textureLoader.load(greyImg)
        const normalTexture = textureLoader.load(brickNormalImg)
        const waterNormalTexture = textureLoader.load(waterNormalImg)

        /**
         * Ojbect: 物体网格
         */
        // const material = new THREE.MeshBasicMaterial()
        // // 可以不再构造函数中配置相关属性，先创建材质对象，然后设置属性
        // // material.map = stoneTexture
        // material.map = greyTexture
        // // material.color.set("#0f0")
        // // 纹理和颜色可以合并使用
        // material.color = new THREE.Color("#FF0")

        // // 网格可以设置透明度
        // material.transparent = true
        // material.opacity = 0.5


        // 深度材质，拉近才能看的到
        // const material = new THREE.MeshDepthMaterial()

        // const material = new THREE.MeshLambertMaterial()
        // material.map = greyTexture

        // const material = new THREE.MeshPhongMaterial()
        // material.shininess = 100 // 光滑度
        // material.specular = new THREE.Color("#1188ff") // 反光颜色

        // // 卡通材质，最好配合渐变纹理使用，效果最佳
        // const material = new THREE.MeshToonMaterial()
        // material.gradientMap = gradientTexture

        const material = new THREE.MeshStandardMaterial()
        material.metalness = 0.45
        material.roughness =  0.65
        material.map = greyTexture
        material.normalMap = waterNormalTexture

        // 我们可以使用dat.gui来控制debug
        const gui = new dat.GUI()
        gui.domElement.style.position = "absolute"
        gui.domElement.style.top = "30px"
        gui.domElement.style.right = "0"

        gui.add(material, "metalness").min(0).max(1).step(0.001)
        gui.add(material, "roughness").min(0).max(1).step(0.001)

        const sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(1, 16, 16),
            material
        )
        sphere.position.x = -2
        const plan = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1, 1, 8, 8),
            material
        )
        const torus = new THREE.Mesh(
            new THREE.TorusBufferGeometry(0.5, 0.2, 8, 16),
            material
        )
        torus.position.x = 2

        scene.add(sphere, plan, torus)

        /**
         * Lights
         */
        // // 环境光，个人理解
        // const ambientLight = new THREE.AmbientLight("#fff", 0.5)
        // scene.add(ambientLight)

        // 点光源
        const pointLight = new THREE.PointLight("#eee", 0.8)
        pointLight.position.x = 2
        pointLight.position.y = 3
        pointLight.position.z = 4
        scene.add(pointLight)

        // 相机配置
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
        camera.position.set(0, 0, 3)
        scene.add(camera)

        // 渲染器和控制器配置
        let renderer: THREE.WebGLRenderer|undefined = undefined
        let controls: OrbitControls|undefined = undefined

        onMounted(() => {
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)

            controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true
        })

        onUnmounted(() => {
            gui.close()
            gui.destroy()
        })

        const clock = new THREE.Clock()
        // 循环渲染场景
        const tick = () => {
            window.requestAnimationFrame(tick)
            const elapsedTime = clock.getElapsedTime()

            
            sphere.rotation.y = elapsedTime * 0.5
            torus.rotation.x = Math.sin(elapsedTime) * 0.5
            torus.rotation.y = Math.cos(elapsedTime) * 0.5

            controls?.update()
            renderer?.render(scene, camera)
        }

        tick()

        // 场景自适应
        window.addEventListener("resize", () => {
            size.width = window.innerWidth
            size.height = window.innerHeight

            camera.aspect = size.width / size.height
            camera.updateProjectionMatrix()
            renderer?.setSize(size.width, size.height)
            renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        return () => (
            <>
                <canvas ref={canvasRef} />
            </>
        )
    }
})

export default Material