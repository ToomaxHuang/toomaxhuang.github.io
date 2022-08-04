import { defineComponent, onMounted, ref } from "vue";
import THREE, {OrbitControls} from "@/utils/THREE"
import s from "./fullscreen_resizing.module.less"


const FullscreenResizing = defineComponent({
    setup(props, context) {

        const canvasRef = ref<HTMLElement>()
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const scene = new THREE.Scene()

        const axesHelper = new THREE.AxesHelper(1)
        scene.add(axesHelper)

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: "#FF0", wireframe: true})
        )
        scene.add(mesh)

        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
        // 需要设置相机位置，默认在(0, 0, 0)
        camera.position.set(0, 2, 2)
        scene.add(camera)

        
        let renderer: THREE.WebGLRenderer|undefined = undefined
        let controls: OrbitControls|undefined = undefined

        onMounted(() => {
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)
            // 设置渲染像素大小
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

            camera.lookAt(mesh.position)
            // 更新控制器
            controls?.update()

            renderer?.render(scene, camera)
            window.requestAnimationFrame(tick)
        }

        tick()


        // 事件处理方法
        const handleDblclicked = (e: MouseEvent) => {
            // const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
            const fullscreenElement = document.fullscreenElement
            if (!fullscreenElement) 
            {
                if (canvasRef.value?.requestFullscreen) {
                    canvasRef.value?.requestFullscreen()
                }
            }
            else 
            {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                }
            }
        }

        return () => (
            <>
                <canvas style={s.webgl} onDblclick={handleDblclicked} ref={canvasRef}></canvas>
            </>
        )
    }
})

export default FullscreenResizing