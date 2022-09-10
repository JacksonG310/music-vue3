import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Recommend from '@/views/recommend.vue';
// import Singer from '@/views/singer.vue';
// import SingerDetail from '@/views/singerDetail.vue';
// import Search from '@/views/search.vue';
// import TopList from '@/views/top-list.vue';
// import Album from "@/views/album.vue";
// import TopDetail from "@/views/topDetail.vue";

const Recommend = () => import('@/views/recommend.vue' /*webpackChunkName: "Recommend"*/);
const Singer = () => import('@/views/singer.vue' /*webpackChunkName: "Singer"*/);
const SingerDetail = () => import('@/views/singerDetail.vue' /*webpackChunkName: "SingerDetail"*/);
const Search = () => import('@/views/search.vue' /*webpackChunkName: "Search"*/);
const TopList = () => import('@/views/top-list.vue' /*webpackChunkName: "TopList"*/);
const Album = () => import("@/views/album.vue" /*webpackChunkName: "Album"*/);
const TopDetail = () => import("@/views/topDetail.vue" /*webpackChunkName: "TopDetail"*/);


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
  },

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
