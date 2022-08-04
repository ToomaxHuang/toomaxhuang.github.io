import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import THREE, { OrbitControls, FontLoader, TextGeometry } from "@/utils/THREE"
import greyImg from "@/static/grey.jpg"
import matcapImg from "@/static/matcap.png"
import * as dat from "dat.gui"
import { Font } from "three/examples/jsm/loaders/FontLoader";

const Text = defineComponent({
    setup: (props, context) => {

        const canvasRef = ref<HTMLElement>()
        
        const scene = new THREE.Scene()

        // 材质
        const textureLoader = new THREE.TextureLoader()
        const greyTexture = textureLoader.load(greyImg)
        const matcapTexture = textureLoader.load(matcapImg)

        /**
         * 文本
         */
        const fontUrl = process.env.BASE_URL + "YouSheBiaoTiHei_Regular.json"
        const fontLoader = new FontLoader()
        let textGeometry: TextGeometry|undefined = undefined
        // const material = new THREE.MeshBasicMaterial()
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture})
        // material.wireframe = true
        // material.map = greyTexture
        let textMesh: THREE.Mesh|undefined = undefined
        let fontObj: Font|undefined = undefined

        const params = {
            size: 24,
            height: 5,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        }
        fontLoader.load(fontUrl, (font) => {
            fontObj = font
            refreshText()
        })

        const refreshText = () => {
            textGeometry = new TextGeometry("你好 Three.js", {
                font: fontObj!,
                ...params
            })

            textGeometry.center() // 02居中的设置方式
            textMesh = new THREE.Mesh(textGeometry, material)
            scene.add(textMesh)

            const torusGetometry = new THREE.TorusBufferGeometry(5, 2.5, 8, 16)
            const torusMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture})

            console.time("torus")
            for (let i=0; i<100; i++) {

                const torus = new THREE.Mesh(torusGetometry, torusMaterial)
                // 随机位置，选择，大小
                torus.position.set((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200)
                torus.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
                const scale = Math.random()
                torus.scale.set(scale, scale, scale)

                scene.add(torus)
            }
            console.timeEnd("torus")
        }
        // GUI
        const gui = new dat.GUI()
        gui.domElement.style.position = "absolute"
        gui.domElement.style.top = "30px"
        gui.domElement.style.right = "0px"
        
        gui.add(params, 'size').min(1).max(80).step(0.01).onChange(() => {
            scene.remove(textMesh!)
            refreshText()
        })
        gui.add(params, 'height').min(0.1).max(10).step(0.01).onChange(() => {
            scene.remove(textMesh!)
            refreshText()
        })
        gui.add(params, 'curveSegments').min(3).max(32).step(1).onChange(() => {
            scene.remove(textMesh!)
            refreshText()
        })
        gui.add(params, 'bevelEnabled').onChange(() => {
            scene.remove(textMesh!)
            refreshText()
        })
        gui.add(params, 'bevelThickness').min(0.01).max(32).step(0.01).onChange(() => {
            scene.remove(textMesh!)
            refreshText()
        })
        gui.add(params, 'bevelSize').min(0.2).max(32).step(0.01).onChange(() => {
            scene.remove(textMesh!)
            refreshText()
        })
        gui.add(params, 'bevelSegments').min(0.2).max(32).step(1).onChange(() => {
            scene.remove(textMesh!)
            refreshText()
        })

        const axesHelper = new THREE.AxesHelper(30)
        scene.add(axesHelper)

        
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 300)
        camera.position.set(0, 0, 100)
        scene.add(camera)

        let renderer: THREE.WebGLRenderer|undefined = undefined
        let controls: OrbitControls|undefined = undefined
        onMounted(() => {
            refreshText()

            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)

            controls = new OrbitControls(camera, renderer.domElement)
            
            tick()
        })
        onUnmounted(() => {
            gui.close()
            gui.destroy()
        })

        const clock = new THREE.Clock()
        const tick = () => {
            window.requestAnimationFrame(tick)
            const elapsedTime = clock.getElapsedTime()

            textMesh!.rotation.y = Math.sin(elapsedTime * 0.5) 
            textMesh!.rotation.x = Math.cos(elapsedTime * 0.5)

            renderer?.render(scene, camera)
            controls?.update()
        }

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

export default Text