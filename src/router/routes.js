const routes = [
  {
    path: '/',
    component: () => import('src/modules/Shared/ui/layouts/MainLayout.vue'),
    children: [
      {
        name:'home',
        path: '',
        component: () => import('src/modules/Shared/ui/pages/IndexPage.vue')
      },
      {
        name:'sellers',
        path: '/sellers',
        component: () => import('src/modules/Sellers/ui/pages/IndexPage.vue')
      },
      {
        name:'images',
        path: '/images',
        component: () => import('src/modules/Images/ui/pages/IndexPage.vue')
      },
      {
        name:'invoices',
        path: '/invoices',
        component: () => import('src/modules/Invoices/ui/pages/IndexPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/modules/Shared/ui/pages/ErrorNotFound.vue')
  }
]

export default routes
