import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Recommend from '@/views/recommend.vue';
import Singer from '@/views/singer.vue';
import SingerDetail from '@/views/singerDetail.vue';
import Search from '@/views/search.vue';
import TopList from '@/views/top-list.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/recommend"
  },
  {
    path: '/recommend',
    component: Recommend
  }, {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  }, {
    path: '/search',
    component: Search
  }, {
    path: '/top-list',
    component: TopList
  }

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
