import { defineComponent, onMounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"
import imgUrl from "@/static/stone.jpg"

const Texture = defineComponent({
    setup: (props, context) => {


        /**
         * 纹理加载的两种方式：
         * 01. 纯ts实现 -> Image
         * 02. three.js -> TextureLoader
         */

        // // 01. 纯ts实现 -> Image
        // const image = new Image()
        // const texture = new THREE.Texture(image)
        // image.onload = () => {
        //     console.log("image has loaded")
        //     texture.needsUpdate = true
        // }
        // image.src = imgUrl


        // 02. three.js -> TextureLoader
        // 可以使用一个加载器来统一管理回调函数
        const loadingManager = new THREE.LoadingManager()
        loadingManager.onStart = () => {
            console.log("start-manager")
        }
        loadingManager.onLoad = () => {
            console.log("loaded-manager")
        }
        loadingManager.onProgress = () => {
            console.log("process-manager")
        }
        loadingManager.onError = () => {
            console.log("error-manager")
        }

        const textureLoader = new THREE.TextureLoader(loadingManager)
        // 加载的回调可以统一让加载管理器去管理
        // const texture = textureLoader.load(
        //     imgUrl, 
        //     () => {console.log("loaded")}, 
        //     () => {console.log("process")}, 
        //     () => {console.log("error")}
        // )

        // 可以同时加载多个纹理图片
        const texture = textureLoader.load(imgUrl)


        // 可以自己调整纹理坐标，达到不同的贴图效果
        texture.repeat.x = 2
        texture.repeat.y = 3
        texture.wrapS = THREE.MirroredRepeatWrapping
        texture.wrapT = THREE.MirroredRepeatWrapping

        // 偏移
        texture.offset.x = 0.5
        texture.offset.y = 0.5

        // 旋转
        texture.rotation = Math.PI * 0.25
        texture.center.x = 0.5
        texture.center.y = 0.5

        // texture.generateMipmaps = false
        // 纹理的过滤器算法, 默认为LinearMipMapLinearFilter
        // texture.minFilter = THREE.NearestFilter
        // texture.minFilter = THREE.LinearMipMapLinearFilter
        // 放大过滤器, THREE.NearestFilter一般可以用于解决小纹理被放大后模糊的问题
        // texture.magFilter = THREE.NearestFilter

        /**
         * 纹理需要注意的三个事项：
         * 01. Weight: 文件类型 .jpg 有损压缩，但是轻量； .png 数据精准，偏重。 法线纹理推荐png格式
         * 02. size or resolution: 大小一般使用宽高1x1的比例，512x512, 1024x1024, 512x2048
         * 03. the Data
         */
        // 纹理来源：poliigon.com, 3dtextures.me, arroway-texture.ch



        const canvasRef = ref<HTMLElement>()
        
        const scene = new THREE.Scene()
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({map: texture})
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

export default Texture