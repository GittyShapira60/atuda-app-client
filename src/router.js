import { createMemoryHistory, createRouter } from 'vue-router'
import { validateAuth } from './auth/authorization'
import { ref } from 'vue'
import Request from '../src/components/mainComponents/requests/Main.vue'
import Flow from '../src/components/mainComponents/requests/Flow.vue'
import Message from '../src/components/mainComponents/requests/Message.vue'

const routes = [
    { path: '/', redirect:'/requests', name: 'home' },
    { path: '/requests',component: Request, name: 'requests' },
    { path: '/flow/:id', component: Flow, name: 'flow', props: true },
    { path: '/error/:title/:message/:sumSteps', component: Message, name: 'message', props: true },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export const errorState = ref(null);

router.onError((error) => {
    const status = error.status
    errorState.value = status
});

router.beforeEach(async (to, from, next) => {
    const success = await validateAuth()
    if (success) {
        next()
    } else next({ name: 'NotFound' })
})


export default router