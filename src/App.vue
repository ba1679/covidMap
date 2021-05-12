<template>
  <div id="app">
    <div class="container-fluid">
      <div id="nav" class="d-flex align-items-center">
        <h1 class="mr-3"><i class="fas fa-globe-americas text-info p-2"></i>全球疫情資訊</h1>
        <router-link to="/">圖表排名</router-link> |
        <router-link to="/map">地圖顯示</router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import 'bootstrap/scss/bootstrap.scss';

#nav {
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
