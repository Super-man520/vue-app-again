import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const Login = () => import(/* webpackChunkName: 'index' */ '../components/Login/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */ '../components/Index/Index.vue')
const Users = () => import(/* webpackChunkName: 'users' */ '../components/Users/Users.vue')
const Categories = () => import(/* webpackChunkName: 'products' */ '../components/Products/Categories.vue')
const Goods = () => import(/* webpackChunkName: 'products' */ '../components/Products/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: 'products' */ '../components/Products/GoodsAdd.vue')
const Rights = () => import(/* webpackChunkName: 'rights' */ '../components/Rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: 'rights' */ '../components/Rights/Roles.vue')

const routes = [
  // { path: '/', redirect: 'index' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/users', name: 'users', component: Users },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/goodsadd', name: 'goodsadd', component: GoodsAdd },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/roles', name: 'roles', component: Roles }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
