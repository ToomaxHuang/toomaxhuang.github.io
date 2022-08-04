import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"
import * as dat from "dat.gui"
import gsap from "gsap"

const DebugGui = defineComponent({
    setup: (props, context) => {

        const canvasRef = ref<HTMLElement>()

        // 可以通过定义一个统一的对象来控制所有数据
        const params = {
            color: "#219e7a",
            wireframe: false,
            spin: () => {
                gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + 10})
            }
        }

        // 创建GUI控制面板
        const gui = new dat.GUI({closed: false, width: 400})
        // 隐藏面板
        // gui.hide()

        // 可以配置gui的位置
        gui.domElement.style.position = 'absolute'
        gui.domElement.style.top = '30px'
        
        const scene = new THREE.Scene()
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // const geometry = new THREE.BufferGeometry()
        // const count = 10

        // // 除了three.js自带的geometry，还可以自定义geometry,主要通过buffer geometry来实现
        // const positionArray = new Float32Array(count * 3 * 3)
        // for (let i=0; i<count*3*3; i++) {
        //     positionArray[i] = (Math.random() - 0.5) * 1
        // }
        // const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
        // geometry.setAttribute("position", positionAttribute)

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({color: params.color, wireframe: params.wireframe})
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        // GUI面板设置：
        gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("y方向：")
        gui.add(material, "wireframe").name("线框模式")
        gui.addColor(params, "color").onChange(() => {
            material.color.set(params.color)
        })
        gui.add(params, "spin").name("旋转一下")

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

        onUnmounted(() => {
            gui.close()
            gui.destroy()
        })

        return () => (
            <>
                <canvas ref={canvasRef} />
            </>
        )
    }
})

export default DebugGui