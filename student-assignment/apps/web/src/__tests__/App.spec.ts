import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

const vuetify = createVuetify({
    components,
    directives,
})

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
})

describe('App', () => {
    it('renders properly', () => {
        const wrapper = mount(App, {
            global: {
                plugins: [
                    vuetify,
                    router,
                    createTestingPinia({
                        createSpy: (fn) => fn,
                        initialState: {
                            auth: { user: null, token: null }
                        }
                    })
                ],
            },
        })
        expect(wrapper.exists()).toBeTruthy()
    })
})
