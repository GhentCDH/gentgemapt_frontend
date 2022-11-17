<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand>
        <img :src="require('@/images/logo-white.svg')" alt="Gent Gemapt">

<!--        <div class="brand-spacer brand-spacer__left"></div>-->
<!--        <div class="brand-image">-->
<!--        </div>-->
<!--        <div class="brand-spacer brand-spacer__right"></div>-->
    </b-navbar-brand>
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