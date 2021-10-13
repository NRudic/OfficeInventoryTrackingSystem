import Login from '@/views/Login.vue'
import Korisnici from '@/views/Korisnici.vue'
import Otpis from '@/views/ZahtjeviZaOtpis.vue'
import Prijenos from '@/views/ZahtjeviZaPrijenos.vue'
import Artikli from '@/views/Artikli.vue'
import Grupe from '@/views/Grupe.vue'
import QRCode from '@/components/QRCodePrint.vue'
import NotFound from '@/views/404.vue'


import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: "/logout",
    name: "logout",
    component: {
      beforeRouteEnter(to, from, next) {
        if (!from) {
          console.log("no from");
        }
        store.dispatch("logout");
        next({ name: "login" });
      }
    }
  },
  {
    path: '/korisnici',
    name: 'korisnici',
    component: Korisnici,
    meta: { requiresAuth: true }
  },
  {
    path: '/prijenos',
    name: 'prijenos',
    component: Prijenos,
    meta: { requiresAuth: true }
  },
  {
    path: '/otpis',
    name: 'otpis',
    component: Otpis,
    meta: { requiresAuth: true }
  },
  {
    path: '/artikli',
    name: 'artikli',
    component: Artikli,
    meta: { requiresAuth: true }
  },
  {
    path: '/grupe',
    name: 'grupe',
    component: Grupe,
    meta: { requiresAuth: true }
  },
  {
    path: '/print',
    name: 'print',
    component: QRCode,
    meta: { requiresAuth: true }
  },
  // 404 - mora ostati zadnji
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  let cookie = await store.dispatch('tryGetBrowserCookie');

  if (to.name == "login" && cookie) {
    next({ name: "korisnici" });
  }
  else if (to.meta.requiresAuth) {
    console.log(cookie);
    if (!cookie) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
})
export default router
