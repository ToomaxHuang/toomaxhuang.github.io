import { defineComponent, onMounted, ref } from "vue";
import THREE from "@/utils/THREE"

const Home = defineComponent({
    
    setup() {
        
        // canvas的对象引用
        const canvasRef = ref<HTMLElement>()

        onMounted(() => {
            // 场景
            const scene = new THREE.Scene()

            // // 网格
            // const geometry = new THREE.BoxGeometry(1, 1, 1)
            // const material = new THREE.MeshBasicMaterial({color: "#f00"})
            // const mesh = new THREE.Mesh(geometry, material)
            // scene.add(mesh)
            
            // // 网格位置变换
            // mesh.position.set(0.7, -0.6, 1)

            // // 网格大小缩放
            // mesh.scale.set(2, 0.5, 0.5)

            // // 网格旋转, 旋转之前使用reorder("YXZ")来订购xyz旋转的先后顺序
            // mesh.rotation.reorder("YXZ")
            // mesh.rotation.x = Math.PI * 0.25
            // mesh.rotation.y = Math.PI * 0.25

            // console.log(mesh.position.length())
            // // console.log(mesh.position.normalize())
            // // console.log(mesh.position.length())

            // Group的概念，多个mesh可以放入group中，group可以统一进行变换
            const grouper = new THREE.Group()
            scene.add(grouper)

            const cube1 = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshBasicMaterial({color: "#f00"})
            )

            grouper.add(cube1)

            grouper.position.set(0.7, -0.6, 1)
            grouper.scale.set(2, 0.5, 0.5)
            grouper.rotation.reorder("YXZ")
            grouper.rotation.x = Math.PI * 0.25
            grouper.rotation.y = Math.PI * 0.25

            // 坐标系
            const axesHelper = new THREE.AxesHelper(1)
            scene.add(axesHelper)

            // 大小
            const size = {
                width: 800,
                height: 600
            }

            // 摄像机
            const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
            // camera.position.x = 1
            // camera.position.y = 1
            // camera.position.z = 3
            camera.position.set(0, 0, 3)
            scene.add(camera)

            // // 将摄像机镜头对准某个三维向量：vector3
            // // camera.lookAt(new THREE.Vector3(0, 0, 0))
            // camera.lookAt(mesh.position)
            camera.lookAt(grouper.position)

            // // 打印mesh到camera的距离
            // console.log(mesh.position.distanceTo(camera.position))

            // 渲染器
            console.log(canvasRef.value)
            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)
            renderer.render(scene, camera)
        })


        return () => <canvas ref={canvasRef}></canvas>
    }
})

export default Home