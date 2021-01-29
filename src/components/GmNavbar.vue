<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ title }}</a>
      <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navigation"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navigation">
        <!--
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#"
          >Home <span class="sr-only">(current)</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#about">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#contact">Contact</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
        />
        <button class="btn btn-primary my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
      -->
    </div>
  </div>
  <!-- /container -->
  </nav>
</template>

<script>
export default {
  name: "AppNavbar",
  props: ['title'],
}
</script>

<style scoped>

</style>