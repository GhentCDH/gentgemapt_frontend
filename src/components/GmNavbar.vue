<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand>{{ title }}</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  </b-navbar>
</template>

<script>
export default {
  name: "GmNavbar",
  props: ['title'],
}
</script>

<style scoped>

</style>