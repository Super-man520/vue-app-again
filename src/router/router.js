import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 按需加载
const Login = () => import(/* webpackChunkName: 'index' */ '../components/Login/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */ '../components/Index/Index.vue')
const Users = () => import(/* webpackChunkName: 'users' */ '../components/Users/Users.vue')
const Categories = () => import(/* webpackChunkName: 'products' */ '../components/Products/Categories.vue')
const Goods = () => import(/* webpackChunkName: 'products' */ '../components/Products/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: 'products' */ '../components/Products/GoodsAdd.vue')
const Params = () => import(/* webpackChunkName: 'products' */ '../components/Products/Params.vue')
const Rights = () => import(/* webpackChunkName: 'rights' */ '../components/Rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: 'rights' */ '../components/Rights/Roles.vue')
const Orders = () => import(/* webpackChunkName: 'order' */ '../components/Order/order.vue')
const Reports = () => import(/* webpackChunkName: 'reports' */ '../components/Reports/Reports.vue')

const routes = [
  { path: '/', redirect: 'index' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/users', name: 'users', component: Users },
      { path: '/categories', name: 'categories', component: Categories },
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/goods-add', name: 'goods-add', component: GoodsAdd },
      { path: '/params', name: 'params', component: Params },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/orders', name: 'orders', component: Orders },
      { path: '/reports', name: 'reports', component: Reports }
    ]
  }
]
const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
