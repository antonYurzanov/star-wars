import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home'
import Ship from './components/ship'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home'
    },
    {
      path: '/ship/:id',
      component: Ship,
      name: 'ship'
    }
  ]
})
