<template>
  <nav class="side-menu">
    <ul>
      <li class="user-info">
        <i class="pi pi-fw pi-user"></i>
        <span class="side-text">
          Niko Rudić
        </span>
      </li>
      <template v-for="(item, i) of items" :key="i">
        <li>
          <router-link v-if="item.to" :to="item.to" :target="item.target">
            <i :class="item.icon"></i>
            <span class="side-text">{{ item.label }}</span>
          </router-link>
        </li>
      </template>
    </ul>

    <ul class="logout">
      <li>
        <router-link to="/login" target="/login">
          <i class="pi pi-power-off"></i>
          <span class="side-text">
            Logout
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: "sideMenu",
  props: {
    items: Array,
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
};
</script>

<style scoped>
.pi {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 60px;
  height: 36px;
  font-size: 20px;
}

.side-menu:hover,
nav.side-menu.expanded {
  width: 270px;
  overflow: visible;
}

.side-menu {
  background: #24304b;
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100vh;
  left: 0;
  width: 60px;
  overflow: hidden;
  -webkit-transition: width 0.05s linear;
  transition: width 0.05s linear;
  -webkit-transform: translateZ(0) scale(1, 1);
  z-index: 1000;
  box-shadow: 5px 0 15px 0px rgb(175, 175, 175);
}

.side-menu > ul {
  margin: 16px 0;
}

.side-menu li {
  position: relative;
  display: block;
  width: 270px;
  margin: 1px 0;
  line-height: 60px;
}

.side-menu li > a {
  position: relative;
  border-collapse: collapse;
  border-spacing: 15px;
  color: #fff;
  font-family: Arial, sans-serif;
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  -webkit-transform: translateZ(0) scale(1, 1);
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
  display: flex;
  justify-content: center;
  align-items: center;
}

.side-menu .user-info {
  position: relative;
  color: #fff;
  letter-spacing: 2px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  padding-bottom: 12px;
  border-bottom: 1px solid #7885a3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.side-menu .side-icon {
  position: relative;
  width: 60px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 60px;
}

.side-menu .side-text {
  position: relative;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 60px;
  vertical-align: middle;
  width: 210px;
  font-family: "Titillium Web", sans-serif;
}

.side-menu > ul.logout {
  position: absolute;
  left: 0;
  bottom: 0;
}

.no-touch .scrollable.hover {
  overflow-y: hidden;
}

.no-touch .scrollable.hover:hover {
  overflow-y: auto;
  overflow: visible;
}

a:hover,
a:focus {
  text-decoration: none;
}

nav {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

nav ul,
nav li {
  outline: 0;
  margin: 0;
  padding: 0;
}
.side-menu li:hover > a,
nav.side-menu li.active > a,
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus,
.dropdown-menu > .active > a,
.dropdown-menu > .active > a:hover,
.dropdown-menu > .active > a:focus,
.no-touch .dashboard-page nav.dashboard-menu ul li:hover a,
.dashboard-page nav.dashboard-menu ul li.active a {
  background-color: #37559a;
}
</style>
