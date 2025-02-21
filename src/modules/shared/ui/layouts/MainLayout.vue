<template>
  <q-layout view="lHh Lpr lFf" class="bg-body">
    <q-header class="bg-white" elevated>
      <q-toolbar>
        <q-btn
          flat
          color="dark"
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div
            class="q-pa-md float-right"
          >

          </div>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="200"
      :breakpoint="500"
    >
      <q-list>
        <q-item-label
          header
        >
          <div class="flex items-center">
            <img class="logo-image" src="../../../../assets/img-logo.png" alt="Img Logo" />
          </div>
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'src/modules/Shared/ui/components/EssentialLink.vue'

const linksList = [
  {
    title: 'Imágenes',
    caption: 'Buscar Imágenes',
    icon: 'search',
    link: { name: 'images' }
  },
  {
    title: 'Vendedores',
    caption: 'Listar vendedores',
    icon: 'group',
    link: { name: 'sellers' }
  },
  {
    title: 'Facturas',
    caption: 'Listar facturas',
    icon: 'description',
    link: { name: 'invoices' }
  },
]

const leftDrawerOpen = ref(true);
const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value
</script>

