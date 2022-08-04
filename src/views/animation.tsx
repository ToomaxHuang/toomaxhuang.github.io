import { defineComponent, onMounted, ref } from "vue";
import THREE from "@/utils/THREE"
import gsap from "gsap"

const createMesh = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({color: "#f00"})
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
}

const Animation = defineComponent({
    
    setup() {        
        // canvas的对象引用
        const canvasRef = ref<HTMLElement>()
        // 场景
        const scene = new THREE.Scene()

        // Group的概念，多个mesh可以放入group中，group可以统一进行变换
        const grouper = new THREE.Group()
        scene.add(grouper)

        const mesh = createMesh()
        grouper.add(mesh)

        // 坐标系
        const axesHelper = new THREE.AxesHelper(1)
        grouper.add(axesHelper)

        // 大小
        const size = {
            width: 800,
            height: 600
        }

        // 摄像机
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
        scene.add(camera)
        camera.position.set(0, 0, 3)

        let renderer: THREE.WebGLRenderer|undefined = undefined

        onMounted(() => {

            // 渲染器
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)            
        })

        /**
         * 动画的实现有多种：
         * 01. Date.now()
         * 02. THREE.Clock
         * 03. gsap动画库
         */
        // const clock = new THREE.Clock()

        gsap.to(grouper.position, {duration: 1, delay: 1, x: 2})
        gsap.to(grouper.position, {duration: 1, delay: 2, x: 0})

        const tick = () => {
            
            // const elapsedTime = clock.getElapsedTime()
            // console.log(elapsedTime)
            // camera.position.y = Math.sin(elapsedTime)
            // camera.position.x = Math.cos(elapsedTime)

            camera.lookAt(grouper.position)

            // 不管使用哪种动画，渲染器必须时刻对场景进行渲染
            renderer?.render(scene, camera)
            window.requestAnimationFrame(tick)
        }

        tick()
        return () => <canvas ref={canvasRef}></canvas>
    }
})

export default Animation