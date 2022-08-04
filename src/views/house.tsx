import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"
import * as dat from "dat.gui"
import doorColorImg from "@/static/door/door_COLOR_COLOR.png"
import doorNormalImg from "@/static/door/door_COLOR_NRM.png"
import doorOcclusionImg from "@/static/door/door_COLOR_OCC.png"
import doorSpecularityImg from "@/static/door/door_COLOR_SPEC.png"
import doorDisplacementImg from "@/static/door/door_COLOR_DISP.png"

// brick
import brickColorImg from "@/static/brick/BricksFlemishRed001_COL_2k.jpg"
import brickAOImg from "@/static/brick/BricksFlemishRed001_AO_2k.jpg"
import brickNormalImg from "@/static/brick/BricksFlemishRed001_NRM_2k.png"
import brickRoughnessImg from "@/static/brick/BricksFlemishRed001_DISP_2k.jpg"

// floor
import floorColorImg from "@/static/floor/GroundForest003_COL_3K.jpg"
import floorAOImg from "@/static/floor/GroundForest003_AO_3k.jpg"
import floorNormalImg from "@/static/floor/GroundForest003_NRM_3k.jpg"
import floorDispImg from "@/static/floor/GroundForest003_DISP_3K.jpg"
import floorRoughnessImg from "@/static/floor/GroundForest003_DISP_3K.jpg"


const House = defineComponent({
    setup: (props, context) => {

        const canvasRef = ref<HTMLElement>()

        const scene = new THREE.Scene()
        const gui = new dat.GUI()
        gui.domElement.style.position = "absolute"
        gui.domElement.style.right = '0'
        gui.domElement.style.top = '30px'

        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.01, 100)
        camera.position.set(10, 10, 10)
        scene.add(camera)
        /**
         * 纹理
         */
        const textureLoader = new THREE.TextureLoader()
        const doorColorTexture = textureLoader.load(doorColorImg)
        const doorNormalTexture = textureLoader.load(doorNormalImg)
        const doorOcclusionTexture = textureLoader.load(doorOcclusionImg)
        const doorSpecularityTexture = textureLoader.load(doorSpecularityImg)
        const doorDisplacementTexture = textureLoader.load(doorDisplacementImg)

        const brickColorTexture = textureLoader.load(brickColorImg)
        const brickAOTexture = textureLoader.load(brickAOImg)
        const brickNormalTexture = textureLoader.load(brickNormalImg)
        const brickRoughnessTexture = textureLoader.load(brickRoughnessImg)

        const floorColorTexture = textureLoader.load(floorColorImg)
        const floorAOTexture = textureLoader.load(floorAOImg)
        const floorNormalTexture = textureLoader.load(floorNormalImg)
        const floorDispTexture = textureLoader.load(floorDispImg)
        
        floorColorTexture.repeat.set(8, 8)
        floorAOTexture.repeat.set(8, 8)
        floorNormalTexture.repeat.set(8, 8)
        floorDispTexture.repeat.set(8, 8)

        floorColorTexture.wrapS = THREE.RepeatWrapping
        floorAOTexture.wrapS = THREE.RepeatWrapping
        floorNormalTexture.wrapS = THREE.RepeatWrapping
        floorDispTexture.wrapS = THREE.RepeatWrapping
        
        floorColorTexture.wrapT = THREE.RepeatWrapping
        floorAOTexture.wrapT = THREE.RepeatWrapping
        floorNormalTexture.wrapT = THREE.RepeatWrapping
        floorDispTexture.wrapT = THREE.RepeatWrapping

        // 环境光
        const ambientLight = new THREE.AmbientLight("#fff", 0.5)
        // scene.add(ambientLight)

        // 月光
        const moonLight = new THREE.DirectionalLight("#fff", 0.12)
        moonLight.position.set(4, 5, -2)
        gui.add(moonLight, "intensity").min(0).max(1).step(0.001)
        gui.add(moonLight.position, "x").min(-5).max(5).step(0.001)
        gui.add(moonLight.position, "y").min(-5).max(5).step(0.001)
        gui.add(moonLight.position, "z").min(-5).max(5).step(0.001)
        scene.add(moonLight)

        // 门前灯
        const doorLight = new THREE.PointLight("#ff7d46", 1, 7)
        doorLight.position.set(0, 2.2, 2.7)
        scene.add(doorLight)

        // 雾气
        const fog = new THREE.Fog("#262837", 1, 15)
        scene.fog = fog



        /**
         * House
         */
        const house = new THREE.Group()
        scene.add(house)

        // 墙
        const walls = new THREE.Mesh(
            new THREE.BoxBufferGeometry(4, 2.5, 4),
            new THREE.MeshStandardMaterial({ 
                map: brickColorTexture,
                normalMap: brickNormalTexture,
                aoMap: brickAOTexture,
                roughnessMap: brickRoughnessTexture
            })
        )
        walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
        walls.position.y = 1.25
        house.add(walls)

        // 屋顶
        const roof = new THREE.Mesh(
            new THREE.ConeBufferGeometry(3.5, 1, 4),
            new THREE.MeshStandardMaterial({ color: "#b35f45"})
        )
        roof.rotation.y = Math.PI * 0.25
        roof.position.y = 3
        house.add(roof)

        // 门
        const door = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1, 2, 50, 50),
            new THREE.MeshStandardMaterial({ 
                map: doorColorTexture,
                aoMap: doorOcclusionTexture,
                displacementMap: doorDisplacementTexture,
                displacementScale: 0.01,
                normalMap: doorNormalTexture,
                metalnessMap: doorSpecularityTexture,
                // wireframe: true,
            })
        )
        door.geometry.setAttribute(
            "uv2",
            new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
        )
        door.position.z = 2 + 0.01
        door.position.y = 1
        house.add(door)

        /**
         * 灌木丛
         */
        const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
        const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854"})

        const bushList = [
            {
                scale: [0.5, 0.5, 0.5],
                position: [0.8, 0.2, 2.5]
            },
            {
                scale: [0.25, 0.25, 0.25],
                position: [1.4, 0.1, 2.4]
            },
            {
                scale: [0.4, 0.4, 0.4],
                position: [-0.8, 0.1, 2.5]
            },
            {
                scale: [0.15, 0.15, 0.15],
                position: [-1, 0.05, 2.9]
            },
        ]
        const bushMeshes: THREE.Mesh[] = []
        bushList.forEach(item => {
            let bush = new THREE.Mesh(bushGeometry, bushMaterial)
            bush.scale.set(item.scale[0], item.scale[1], item.scale[2])
            bush.position.set(item.position[0], item.position[1], item.position[2])
            scene.add(bush)
            bushMeshes.push(bush)
        })

        /**
         * 墓碑
         */
        const graves = new THREE.Group()
        scene.add(graves)

        const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
        const graveMaterial = new THREE.MeshStandardMaterial({color: "#b2b6b1"})

        for (let i=0; i<50; ++i) {
            const angle = Math.random() * Math.PI * 2
            const radius = 3 + Math.random() * 6
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            const grave = new THREE.Mesh(graveGeometry, graveMaterial)
            grave.position.set(x, 0.3, z)

            // 随机旋转
            grave.rotation.z = (Math.random() - 0.5) * 0.4
            grave.rotation.y = (Math.random() - 0.5) * 0.4
            grave.castShadow = true
            graves.add(grave)
        }

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(20, 20),
            new THREE.MeshStandardMaterial({
                map: floorColorTexture,
                aoMap: floorAOTexture,
                normalMap: floorNormalTexture,
                displacementMap: floorDispTexture,
                displacementScale: 0.1,
                // roughnessMap: floorRoughnessTexture
            })
        )
        floor.geometry.setAttribute(
            "uv2",
            new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
        )
        floor.rotation.x = - Math.PI * 0.5
        floor.position.y = 0
        scene.add(floor)

        // 幽灵
        const ghost1 = new THREE.PointLight("#ffff00", 2, 3)
        scene.add(ghost1)
        const ghost2 = new THREE.PointLight("#ff00ff", 2, 3)
        scene.add(ghost2)
        const ghost3 = new THREE.PointLight("#00ffff", 2, 3)
        scene.add(ghost3)

        // 光源：激活阴影
        moonLight.castShadow = true
        doorLight.castShadow = true
        ghost1.castShadow = true
        ghost2.castShadow = true
        ghost3.castShadow = true

        walls.castShadow = true
        bushMeshes.map(bush => {
            bush.castShadow = true
        })

        moonLight.shadow.mapSize.width = 256
        moonLight.shadow.mapSize.height = 256
        moonLight.shadow.camera.far = 7
        doorLight.shadow.mapSize.width = 256
        doorLight.shadow.mapSize.height = 256
        doorLight.shadow.camera.far = 7
        ghost1.shadow.mapSize.width = 256
        ghost1.shadow.mapSize.height = 256
        ghost1.shadow.camera.far = 7
        ghost2.shadow.mapSize.width = 256
        ghost2.shadow.mapSize.height = 256
        ghost2.shadow.camera.far = 7
        ghost3.shadow.mapSize.width = 256
        ghost3.shadow.mapSize.height = 256
        ghost3.shadow.camera.far = 7        
        

        // 物理：接收阴影
        floor.receiveShadow = true
        

        let renderer: THREE.WebGLRenderer|undefined = undefined
        let controls: OrbitControls|undefined = undefined

        onMounted(() => {
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)
            renderer.setClearColor("#262837")
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFSoftShadowMap
            controls = new OrbitControls(camera, renderer.domElement)

            tick()
        })

        onUnmounted(() => {
            gui.close()
            gui.destroy()
        })

        window.addEventListener("resize", () => {
            size.width = window.innerWidth
            size.height = window.innerHeight

            camera.aspect = size.width / size.height
            camera.updateProjectionMatrix()

            renderer?.setSize(size.width, size.height)
            renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        const clock = new THREE.Clock()
        const tick = () => {
            window.requestAnimationFrame(tick)
            const elapsedTime = clock.getElapsedTime()

            const radius = (elapsedTime % 6) + 3
            const angle1 = elapsedTime * 0.5            
            ghost1.position.x = Math.cos(angle1) * radius
            ghost1.position.z = Math.sin(angle1) * radius
            ghost1.position.y = Math.sin(elapsedTime * 3)

            const angle2 = -elapsedTime * 0.32
            ghost2.position.x = Math.cos(angle2) * radius
            ghost2.position.z = Math.sin(angle2) * radius
            ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
            
            const angle3 = -elapsedTime * 0.18
            ghost3.position.x = Math.cos(angle3) * radius
            ghost3.position.z = Math.sin(angle3) * radius
            ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)

            renderer?.render(scene, camera)
            controls?.update()
        }

        return () => (
            <>
                <canvas ref={canvasRef} />
            </>
        )
    }
})

export default House;