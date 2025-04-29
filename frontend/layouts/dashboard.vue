<template>
  <div>
    <provet-layout>
      <provet-navigation slot="nav">
        <provet-header slot="header" heading="Provet">
          <provet-icon name="generic-company" size="l" aria-hidden="true" />
          Nordhealth
        </provet-header>

        <provet-nav-group heading="Workspace">
          <provet-nav-item
            :active="route.path === '/breweries'"
            icon="interface-globe"
          >
            <NuxtLink class="nav-link-reset" to="/breweries">Breweries List</NuxtLink>
          </provet-nav-item>
          <provet-nav-item
            :active="route.path === '/reports'"
            icon="graph-pie-chart"
          >
            <NuxtLink class="nav-link-reset" to="/reports">Reports</NuxtLink>
          </provet-nav-item>
        </provet-nav-group>

        <provet-dropdown slot="footer" expand>
          <provet-button slot="toggle" expand>
            <provet-avatar
              slot="start"
              aria-hidden="true"
              name="Laura Williams"
            />
            Zahra Karami
          </provet-button>
          <provet-dropdown-item @click="logout">
            Sign out
            <provet-icon slot="end" name="interface-logout" />
          </provet-dropdown-item>
        </provet-dropdown>
      </provet-navigation>

      <provet-header slot="header">
        <h1 class="n-typescale-l">Dashboard</h1>
      </provet-header>

      <provet-stack gap="l">
        <slot />
      </provet-stack>
    </provet-layout>

    <provet-command-menu />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

function logout() {
  auth.logout();
  router.push('/');
}


onMounted(() => {
  const layout = document.querySelector("provet-layout") as any;
  const commandMenu = document.querySelector("provet-command-menu") as any;
  const navigation = document.querySelector("provet-navigation");

  if (commandMenu) {
    commandMenu.commands = [
      {
        id: "toggle-nav",
        title: "Toggle navigation",
        icon: "navigation-toggle",
        shortcut: "Alt+KeyL",
        handler() {
          if (layout) {
            layout.navOpen = !layout.navOpen;
          }
        },
      },
    ];
  }

  if (navigation) {
    navigation.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches("provet-nav-item") && (target as any).href) {
        (target as any).active = true;
      }
    });
  }
});
</script>

<style scoped>

</style>
