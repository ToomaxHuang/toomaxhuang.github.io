import { defineComponent } from "vue";
import { RouterView, useRouter } from "vue-router";

import app from "./App.module.less"

export default defineComponent({

  setup() {

    interface Item {
      label: string,
      path: string
    }

    const menuList = [
      {
        label: "基本操作",
        path: "/home"
      },
      {
        label: "动画",
        path: "/animation"
      },
      {
        label: "摄像机",
        path: "/camera"
      },
      {
        label: "全屏和自适应",
        path: "/fullscreen_resizing"
      },
      {
        label: "几何对象",
        path: "/geometry"
      },
      {
        label: "DebugGUI",
        path: "/debug_gui"
      },
      {
        label: "纹理",
        path: "/texture"
      },
      {
        label: "材质",
        path: "/material"
      },
      {
        label: "文本",
        path: "/3d_text"
      },
      {
        label: "灯光",
        path: "/light"
      },
      {
        label: "阴影",
        path: "/shadow"
      },
      {
        label: "幽灵小屋",
        path: "/house"
      },
    ]

    const router = useRouter()

    const handleMenuClicked = (el: Item) => {
      console.log(el)
      router.push(el.path)
    }

    return () => (
      <>
        <div class={app.menu}>
          {menuList.map(el => {
            return <button onClick={() => handleMenuClicked(el)}>{el.label}</button>
          })}
        </div>
        <RouterView />
      </>
    )
  }
})
