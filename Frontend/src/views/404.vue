<template>
  <div class="centered">
    <h2>Error 404 - Route not found</h2>
    <router-link :to="{ path: 'login' }" class="link">Login</router-link>
    <router-link :to="{ path: 'korisnici' }" class="link"
      >Korisnici</router-link
    >

    <a></a>
  </div>
</template>

<script>
export default {
  name: "404",
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.centered {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 100px 30px;
}
.link {
  padding: 10px;
}
</style>
