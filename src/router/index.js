import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/case1',
            name: 'webgl_animation_keyframes',
            component: () => import('@/views/CaseOne.vue'),
            meta: {
                title: 'webgl_animation_keyframes'
            }
        },
        {
            path: '/case2',
            name: 'webgl_lights_physical',
            component: () => import('@/views/LightPhysical.vue'),
            meta: {
                title: 'webgl_lights_physical'
            }
        },
        {
            path: '/case3',
            name: 'webgl_scene_multiple_compare',
            component: () => import('@/views/SceneMultipleCompare.vue'),
            meta: {
                title: 'webgl_scene_multiple_compare'
            }
        },
        {
            path: '/case4',
            name: 'webgl_lines_fat',
            component: () => import('@/views/LinesFat.vue'),
            meta: {
                title: 'webgl_lines_fat'
            }
        },
        {
            path: '/case5',
            name: 'materials-texture-filtering',
            component: () => import('@/views/MaterialsTextureFiltering.vue'),
            meta: {
                title: 'webgl - materials - texture filtering'
            }
        },
        {
            path: '/case6',
            name: 'webgl-clipping',
            component: () => import('@/views/WebglClipping.vue'),
            meta: {
                title: 'webgl-clipping'
            }
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('@/views/CursorTest.vue'),
            meta: {
                title: 'test'
            }
        }
    ]
})

export default router
