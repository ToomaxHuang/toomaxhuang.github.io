import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import THREE, { OrbitControls } from "@/utils/THREE"
import * as dat from "dat.gui"

import landImg from "@/static/random_stone_COLOR.png"
import landNormalImg from "@/static/random_stone_NRM.png"
import landDisplImg from "@/static/random_stone_DISP.png"
import brickNormalImg from "@/static/brick.jpg"

const Shadow = defineComponent({
    setup: (props, context) => {

        const canvasRef = ref<HTMLElement>()
        
        const scene = new THREE.Scene()

        const axesHelper = new THREE.AxesHelper(30)
        scene.add(axesHelper)

        const gui = new dat.GUI()
        gui.domElement.style.position = "absolute"
        gui.domElement.style.top = "30px"
        gui.domElement.style.right = "0"

        const params = {
            scale: 0.5
        }

        gui.add(params, "scale").min(0).max(1).step(0.01)
        /**
         * 纹理材质，可以通过纹理材质来设置阴影效果, 从而提高性能，不需要实时计算阴影，而是使用贴图。
         * {
         *  map: mapTexture
         * }
         * 或者
         * {
         *  color: 0xff000,
         *  transparent: true,
         *  alphaMap: simpleShadowTexture
         * }
         */
        const textureLoader = new THREE.TextureLoader()
        const landNormalTexture = textureLoader.load(landNormalImg)
        const landTexture = textureLoader.load(landImg)
        const brickNormalTexture = textureLoader.load(brickNormalImg)
        const landDispTexture = textureLoader.load(landDisplImg)
        landNormalTexture.matrixAutoUpdate = false;
        landTexture.matrixAutoUpdate = false;
        landDispTexture.matrixAutoUpdate = false;

        // 环境光
        const ambientLight = new THREE.AmbientLight("#fff", 0.5)
        scene.add(ambientLight)

        // // 平行光
        // const light = new THREE.DirectionalLight("#fff", 0.8)
        // light.position.set(20, 20, 0);
        // light.lookAt(new THREE.Vector3(0, 0, 0))
        // // 启用消费阴影效果
        // light.castShadow = true;
        // scene.add(light)

        // // 配置聚光灯阴影相关属性
        // light.shadow.mapSize.width = 1024; // 默认
        // light.shadow.mapSize.height = 1024;
        // light.shadow.camera.near = 0.01;
        // light.shadow.camera.far = 10;
        // // 阴影渐晕效果, 只有在特定的渲染阴影贴图中，才有效。
        // light.shadow.radius = 10;
        // light.shadow.camera.scale.set(5, 5, 5);

        // const lightHelper = new THREE.CameraHelper(light.shadow.camera);
        // scene.add(lightHelper)

        // 聚光灯
        const spotLight = new THREE.SpotLight("#FFF", 0.2, 200, Math.PI * 0.25, 0.25, 1)
        spotLight.position.set(0, 20, 20);
        spotLight.lookAt(new THREE.Vector3(0, 0, 0))
        spotLight.castShadow = true
        spotLight.shadow.camera.far = 50;
        scene.add(spotLight)

        const spotLightHepler = new THREE.CameraHelper(spotLight.shadow.camera);
        scene.add(spotLightHepler)
        
        const size = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 300)
        camera.position.set(0, 0, 100)
        scene.add(camera)

        // 平面

        const material = new THREE.MeshStandardMaterial();
        material.metalness = 0.4
        material.roughness = 0.8

        const planeMaterial = new THREE.MeshStandardMaterial();
        planeMaterial.roughness = 0.68
        planeMaterial.color.set("#C06641")
        planeMaterial.normalMap = brickNormalTexture

        const plane = new THREE.Mesh(
            new THREE.BoxBufferGeometry(50, 0.5, 50, 32, 8, 32), 
            planeMaterial
        );
        // 接收阴影效果
        plane.receiveShadow = true;
        scene.add(plane)

        // 球
        const sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(2, 128, 128),
            material
        )
        sphere.position.set(0, 2.25, 0)
        sphere.castShadow = true;
        sphere.receiveShadow = false;
        scene.add(sphere)

        // const sphereShadow = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(15, 15),
        //     new THREE.MeshStandardMaterial({
        //         color: "#FF0000",
        //         transparent: true,
        //         alphaMap: simpleShadowTexture
        //     })
        // )
        // sphereShadow.rotation.x = -Math.PI * 0.5;
        // sphereShadow.position.y = plane.position.y + 0.26;
        // scene.add(sphereShadow);

        let renderer: THREE.WebGLRenderer|undefined = undefined
        let controls: OrbitControls|undefined = undefined
        onMounted(() => {

            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.value
            })
            renderer.setSize(size.width, size.height)
            // 启用阴影映射效果
            renderer.shadowMap.enabled = true;
            // 指定阴影映射类型
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.shadowMap.type = THREE.PCFShadowMap;

            controls = new OrbitControls(camera, renderer.domElement)
            
            tick()
        })

        onUnmounted(() => {
            gui.close()
            gui.destroy()
        })

        const clock = new THREE.Clock()

        const uvTransform = {
            isRepeat: false,
            offsetX: 0,
            offsetY: 0,
            repeatX: 1,
            repeatY: 1,
            rotation: 1,
            centerX: 0.5,
            centerY: 0.5
        }
        gui.add(uvTransform, "isRepeat")
        gui.add(uvTransform, "offsetX").min(0).max(1).step(0.01)
        gui.add(uvTransform, "offsetY").min(0).max(1).step(0.01)
        gui.add(uvTransform, "repeatX").min(0.25).max(2).step(0.01)
        gui.add(uvTransform, "repeatY").min(0.25).max(2).step(0.01)
        gui.add(uvTransform, "rotation").min(-2).max(2).step(0.01)
        gui.add(uvTransform, "centerX").min(0).max(1).step(0.01)
        gui.add(uvTransform, "centerY").min(0).max(1).step(0.01)

        const tick = () => {
            window.requestAnimationFrame(tick)
            const elapsedTime = clock.getElapsedTime()

            material.map = landTexture;
            material.normalMap = landNormalTexture;
            material.normalScale.set(params.scale, params.scale);
            material.displacementMap = landDispTexture;
            material.displacementScale = params.scale;

            // UV变换
            // 调整旋转平移缩放
            material.map.matrix.setUvTransform( 
                uvTransform.offsetX, uvTransform.offsetY, 
                uvTransform.repeatX, uvTransform.repeatY, 
                uvTransform.rotation, 
                uvTransform.centerX, uvTransform.centerY 
            );
            material.map.needsUpdate = true; // 每次手动调整后设置为true
            // 调整贴图重复
            material.map.wrapS  = material.map.wrapT = (uvTransform.isRepeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping)
            material.map.needsUpdate = true; // 每次手动调整后设置为true

            sphere.rotation.y = Math.PI * elapsedTime
            sphere.position.x = Math.cos(elapsedTime) * 10
            sphere.position.z = Math.sin(elapsedTime) * 10
            sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) * 3 + 2

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

export default Shadow