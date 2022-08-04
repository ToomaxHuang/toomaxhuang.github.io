import { defineComponent, onMounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"

const Light = defineComponent({
    setup(props, context) {

        const canvasRef = ref<HTMLElement>()
        const scene = new THREE.Scene()
        const axesHelper = new THREE.AxesHelper(30)
        scene.add(axesHelper)

        // // 环境光
        // const ambientLight = new THREE.AmbientLight("#fff", 0.5)
        // scene.add(ambientLight)

        // 点光源
        const pointLight = new THREE.PointLight("#fff", 0.5)
        pointLight.position.set(2, 3, 4)
        // scene.add(pointLight)

        // 太阳光
        const sunLight = new THREE.DirectionalLight("#fff", 0.8)
        // scene.add(sunLight)

        // 半球光，物体对半被不同颜色照亮
        const hemisphereLight = new THREE.HemisphereLight("#fff", "#FF0", 0.6)
        // scene.add(hemisphereLight)

        // 面光
        const rectAreaLight = new THREE.RectAreaLight("#fff", 50, 2, 2)
        rectAreaLight.position.set(0, 5, 10)
        rectAreaLight.lookAt(new THREE.Vector3())
        // scene.add(rectAreaLight)

        // 聚光灯
        const spotLight = new THREE.SpotLight("#FFF", 5, 10, Math.PI * 0.25, 0.25, 1)
        spotLight.position.set(0, 5, 10)
        spotLight.lookAt(new THREE.Vector3())
        scene.add(spotLight)
        /**
         * 最后我们可以使用光辅助来更直观地观察光的方向和距离等信息
         * 
         * 面光辅助需要单独引入 import { RectAreaHelper } from "three/examples/jsm/helpers/RectAreaHelper.js"
         */
        const lightHelper = new THREE.PointLightHelper(spotLight, 0.2)
        scene.add(lightHelper)


        // 材质
        const material = new THREE.MeshStandardMaterial()
        material.metalness = 0.4
        material.roughness = 0.8

        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(10, 15, 8, 8),
            material
        )

        const torus = new THREE.Mesh(
            new THREE.TorusBufferGeometry(1, 0.5, 8, 16),
            material
        )
        torus.position.z = 2
        torus.position.y = 5

        const sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(1, 16, 16),
            material
        )
        sphere.position.set(-3, 5, 2)
        scene.add(plane, torus, sphere)

        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.01, 100)
        camera.position.set(0, 0, 10)
        scene.add(camera)


        let renderer: THREE.WebGLRenderer|undefined = undefined
        let controller: OrbitControls|undefined = undefined
        onMounted(() => {
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            controller = new OrbitControls(camera, renderer.domElement)

            tick()
        })

        window.addEventListener("resize", () => {
            size.width = window.innerWidth
            size.height = window.innerHeight
            camera.aspect = size.width / size.height
            camera.updateProjectionMatrix()
            renderer?.setSize(size.width, size.height)
            renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        const tick = () => {
            window.requestAnimationFrame(tick)

            renderer?.render(scene, camera)
            controller?.update()
        }

        return () => (
            <>
                <canvas ref={canvasRef} />
            </>
        )
    }
})

export default Light