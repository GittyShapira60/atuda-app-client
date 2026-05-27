<template>
  <!-- <v-overlay
    v-model="drawer"
    opacity="0.5"
    class="overlay position-absolute"
    z-index="1999"
    attach="true"
  /> -->
  <v-card class="position-relative z-index">
    <v-app-bar class="app-bar">
      <v-row class="atuda-icon">
        <AtudaApp />
      </v-row>
      <!-- <v-btn
        icon
        @click.stop="drawer = !drawer"
        position="absolute"
        class="nav-position"
      >
        <NavIcon />
      </v-btn> -->
    </v-app-bar>
  </v-card>

  <!-- <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
    class="nav top-0 right-0"
  >
    <v-row justify="end" class="row-drawer">
      <v-btn
        size="x-small"
        icon
        @click="drawer = false"
        color="rgb(var(--v-theme-Powder-Blue))"
        class="elevation-0 close-nav"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>

    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :value="item.title"
        :key="index"
        class="border-0"
        @click="navigateTo(item.route)"
      >
        <template v-slot:prepend>
          <v-img :src="item.icon" width="9.346vw"></v-img>
        </template>
        <v-list-item-title class="item-list-nav">{{
          item.title
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer> -->

  <v-main>
    <RouterView />
  </v-main>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let drawer = ref(false)
const group = ref(null)
const items = [
  {
    title: 'בקשות',
    icon: `/bakashot/assets/navigation/request.png`,
    route: '/requests',
  },
]
watch(group, () => {
  drawer.value = false
})
const navigateTo = (route: any) => {
  router.push({ path: route })
  drawer.value = false
}
</script>

<style lang="scss">
.row-drawer {
  padding-bottom: 0;
  padding-top: 3vh;
  padding-left: 3vh;
}

.v-list-item-title {
  letter-spacing: -0.023vw;
  font-weight: 500;
}

.overlay {
  background-color: rgba(40, 41, 72, 0.6) !important;
  backdrop-filter: blur(7px);
}

.nav-position {
  margin-right: 1.625vw;
}

.nav {
  border-radius: 5.607vw 0 0 5.607vw;
  z-index: 2000 !important;
  height: 96.76vh !important;
}

.v-navigation-drawer__scrim {
  background: none;
}

.z-index {
  z-index: 1998;
}
.v-navigation-drawer--temporary.v-navigation-drawer--active {
  width: 90.654vw !important;
}
.btn-nav {
  margin-right: 1vw !important;
}
.item-list-nav {
  font-size: 4.206vw;
  font-weight: 500;
  line-height: 5.607vw;
}
.close-nav {
  width: 7.009vw !important;
  height: 7.009vw !important;
}

.atuda-icon {
  margin-right: 37.383vw;
}
</style>
