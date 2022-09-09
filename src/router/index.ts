import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Recommend from '@/views/recommend.vue';
import Singer from '@/views/singer.vue';
import SingerDetail from '@/views/singerDetail.vue';
import Search from '@/views/search.vue';
import TopList from '@/views/top-list.vue';
import Album from "@/views/album.vue";
import TopDetail from "@/views/topDetail.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/recommend"
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: Album
    }]
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
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
