<template>
  <v-card id="root">
    <v-layout>
      <div class="sidebar-wrapper" :style="{ width: rail ? '72px' : '250px' }">
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" class="custom-navigation">
          <v-list>
            <v-list-item prepend-icon="mdi-printer" title="Thiết bị" nav>
              <template v-slot:append>
                <v-btn icon="mdi-menu" variant="text" @click.stop="rail = !rail"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-list density="compact" nav>
            <router-link class="link" to="/">
              <v-list-item prepend-icon="mdi-poll" title="Tổng quan" value="overview"></v-list-item>
            </router-link>

            <router-link class="link" to="/device">
              <v-list-item prepend-icon="mdi-desktop-classic" title="Thiết bị" value="device"></v-list-item>
            </router-link>

            <router-link class="link" to="/payment">
              <v-list-item prepend-icon="mdi-cart" title="Mượn trả" value="payment"></v-list-item>
            </router-link>

            <router-link class="link" to="/report">
              <v-list-item prepend-icon="mdi-chart-pie" title="Báo cáo" value="report"></v-list-item>
            </router-link>

            <router-link class="link" to="/system">
              <v-list-item prepend-icon="mdi-cogs" title="Hệ thống" value="system"></v-list-item>
            </router-link>
          </v-list>
        </v-navigation-drawer>
      </div>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      rail: true,
    };
  },
  name: "Sidebar",
};
</script>

<style lang="scss">
#root {
  .custom-navigation {
    min-width: 72px;
    max-width: 220px;
    background-color: var(--ms-background-sidebar);
    border-right: 0;
  }

  .v-list--one-line {
    overflow: hidden;
    padding-left: 12px;
  }

  .v-list--one-line a {
    text-decoration: none;
    color: white;
  }

  .v-list--one-line {
    .v-list-item-title {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .v-list--nav {
    padding-left: 14px;
  }

  .v-list--nav .v-list-item-title {
    font-size: 16px;
    font-weight: 400;
  }

  .v-list--nav .v-list-item {
    margin: 12px 0;
  }

  .v-list-item--density-default {
    color: white;
    cursor: pointer;
  }

  .router-link-exact-active {
    color: #0dd469 !important;

    .v-list-item-title {
      color: #0dd469 !important;
    }
  }

  .v-list-item__overlay {
    background-color: white;
  }

  .sidebar-wrapper {
    transition: width 0.3s ease-in-out;
  }
}
</style>