import { defineComponent, onMounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"

const Camera = defineComponent({
    setup: () => {

        const canvasRef = ref<HTMLElement>()

        const scene = new THREE.Scene()

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: "#f00"})
        )
        scene.add(mesh)

        const axesHelper = new THREE.AxesHelper(1)
        scene.add(axesHelper)

        const size = {
            width: 800,
            height: 600
        }

        // 透视摄像头
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
        
        // const rate = size.width / size.height
        // const camera = new THREE.OrthographicCamera(-1 * rate, 1, 1 * rate, -1, 0.1, 100)
        camera.position.set(2, 2, 2)
        camera.lookAt(mesh.position)
        scene.add(camera)


        // 设置OrbitControls控制器
        let controls: OrbitControls|undefined = undefined
        // 渲染器
        let renderer: THREE.WebGLRenderer|undefined = undefined

        const clock = new THREE.Clock()

        onMounted(() => {
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)
            
            controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true
        })

        const cursor = {
            x: 0,
            y: 0
        }

        const isDown = ref<boolean>(false)

        const handleMouseMoved = (event: MouseEvent) => {
            if (isDown.value) {
                cursor.x = -(event.clientX / size.width - 0.5)
                cursor.y = event.clientY / size.height - 0.5
            }
        }
        const handleMouseDowned = (event: MouseEvent) => {
            isDown.value = true
            
        }
        const handleMouseUped = (event: MouseEvent) => {
            isDown.value = false
        }

        const tick = () => {

            const elapseTime = clock.getElapsedTime()
            // mesh.rotation.y = elapseTime

            // camera.position.x = cursor.x * 3
            // camera.position.y = cursor.y * 3
            camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
            camera.position.y = cursor.y * 5
            camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
            camera.lookAt(mesh.position)

            // 更新控制器
            controls?.update()

            renderer?.render(scene, camera)
            window.requestAnimationFrame(tick)
        }
        
        tick()

        return () => (
            <>
                <canvas onMousedown={handleMouseDowned} onMouseup={handleMouseUped} onMousemove={handleMouseMoved} ref={canvasRef}/>
            </>
        )
    }
})

export default Camera