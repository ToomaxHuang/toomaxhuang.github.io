import { defineComponent, onMounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"

const Geometry = defineComponent({
    setup: (props, context) => {

        const canvasRef = ref<HTMLElement>()
        
        const scene = new THREE.Scene()
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const geometry = new THREE.BufferGeometry()
        const count = 50

        // 除了three.js自带的geometry，还可以自定义geometry,主要通过buffer geometry来实现
        const positionArray = new Float32Array(count * 3 * 3)
        for (let i=0; i<count*3*3; i++) {
            positionArray[i] = (Math.random() - 0.5) * 4
        }
        const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
        geometry.setAttribute("position", positionAttribute)
        const material = new THREE.MeshBasicMaterial({color: "#FF0", wireframe: true})
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const axesHelper = new THREE.AxesHelper(1)
        scene.add(axesHelper)

        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
        camera.position.set(0, 1, 2)
        scene.add(camera)
        
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

            controls?.update()
            renderer?.render(scene, camera)
        }

        tick()

        return () => (
            <>
                <canvas ref={canvasRef} />
            </>
        )
    }
})

export default Geometry