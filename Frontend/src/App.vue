<template>
  <div style="position:relative">
    <Menu
      v-if="!isLogin"
      :items="menuItems"
      @menuitem-click="onMenuItemClick"
      id="navigation"
    />
    <div class="main-view">
      <router-view />
    </div>
  </div>
</template>

<script>
import Menu from "./components/Menu.vue";

export default {
  components: {
    Menu,
  },
  data() {
    return {
      menuItems: [
        { label: "Korisnici", icon: "pi pi-fw pi-users", to: "/korisnici" },
        {
          label: "Artikli",
          icon: "pi pi-fw pi-tags",
          to: "/artikli",
        },
        {
          label: "Grupe artikala",
          icon: "pi pi-fw pi-inbox",
          to: "/grupe",
        },
        {
          label: "Zahtjevi za prijenos",
          icon: "pi pi-fw pi-file-o",
          to: "/prijenos",
        },
        {
          label: "Zahtjevi za otpis",
          icon: "pi pi-fw pi-file-excel",
          to: "/otpis",
        },
      ],
    };
  },
  methods: {},
  computed: {
    isLogin() {
      return this.$route.path === "/login";
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.main-view {
  padding: 20px 40px 20px 100px;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
}

@media print {
  @page {
    size: A4;
  }
  body {
    box-sizing: border-box;
    height: 297mm !important;
    width: 210mm !important;
    margin: 0 !important;
    min-height: unset !important;
    min-width: unset !important;
    padding: 0 !important;
  }
  #nav {
    display: none;
  }
  .main-view {
    box-sizing: border-box;
    height: 297mm !important;
    width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: unset !important;
    min-width: unset !important;
  }
  #navigation {
    display: none;
  }
}
</style>
