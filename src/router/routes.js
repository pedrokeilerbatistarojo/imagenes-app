const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name:'home',
        path: '',
        component: () => import('src/modules/shared/pages/IndexPage.vue')
      },
      {
        name:'images',
        path: '/images',
        component: () => import('../modules/Images/pages/IndexPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/modules/shared/pages/ErrorNotFound.vue')
  }
]

export default routes
