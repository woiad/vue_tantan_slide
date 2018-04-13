import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import stack from '@/components/stack'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWord',
    //   component: HelloWorld
    // },
    {
      path: '/',
      name: 'stack',
      component: stack
    }

  ]
})
