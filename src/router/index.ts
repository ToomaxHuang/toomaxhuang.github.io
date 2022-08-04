import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        name: "home",
        meta: {
            type: "home"
        },
        component: () => import("@/views/home")
    },
    {
        path: "/animation",
        name: "animation",
        meta: {
            type: "animation"
        },
        component: () => import("@/views/animation")
    },
    {
        path: "/camera",
        name: "camera",
        meta: {
            type: "camera"
        },
        component: () => import("@/views/camera")
    },
    {
        path: "/fullscreen_resizing",
        name: "fullscreen_resizing",
        meta: {
            type: "fullscreen_resizing"
        },
        component: () => import("@/views/fullscreen_resizing")
    },
    {
        path: "/geometry",
        name: "geometry",
        meta: {
            type: "geometry"
        },
        component: () => import("@/views/geometry")
    },
    {
        path: "/debug_gui",
        name: "debug_gui",
        meta: {
            type: "debug_gui"
        },
        component: () => import("@/views/debug_gui")
    },
    {
        path: "/texture",
        name: "texture",
        meta: {
            type: "texture"
        },
        component: () => import("@/views/texture")
    },
    {
        path: "/material",
        name: "material",
        meta: {
            type: "material"
        },
        component: () => import("@/views/material")
    },
    {
        path: "/3d_text",
        name: "3d_text",
        meta: {
            type: "3d_text"
        },
        component: () => import("@/views/3d_text")
    },
    {
        path: "/light",
        name: "light",
        meta: {
            type: "light"
        },
        component: () => import("@/views/light")
    },
    {
        path: "/shadow",
        name: "shadow",
        meta: {
            type: "shadow"
        },
        component: () => import("@/views/shadow")
    },
    {
        path: "/house",
        name: "house",
        meta: {
            type: "house"
        },
        component: () => import("@/views/house")
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router