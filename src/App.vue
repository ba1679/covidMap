<template>
  <div id="app">
    <div class="container-fluid">
      <div id="nav" class="d-flex align-items-center">
        <h1 class="mr-3 mobile-h1"><i class="fas fa-globe-americas text-info p-2"></i>全球疫情資訊</h1>
        <div class="d-flex mobile-direction">
          <router-link to="/">圖表排名</router-link> <span class="md-none">|</span>
          <router-link to="/map">地圖顯示</router-link>
        </div>
      </div>
    </div>
    <router-view />
    <a href="#" class="back-to-top fa-2x d-none" @click.prevent="backToTop">
      <i class="fas fa-arrow-circle-up fa-2x"></i>
    </a>
    <footer class="footer-bg py-2">
      <div class="container text-center text-light">
        <p class="mb-0">資料來源: <a href="https://www.worldometers.info/coronavirus/">worldometers</a></p>
        <p>&copy; copyright 2021 By Hsin-Hui</p>
      </div>
    </footer>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
  name: 'All',
  methods: {
    backToTop() {
      $('html,body').animate(
        {
          scrollTop: 0
        },
        1000
      );
    }
  },
  mounted() {
    $(window).scroll(function() {
      if ($(this).scrollTop() > 50) {
        $('.back-to-top').addClass('d-block');
      } else {
        $('.back-to-top').removeClass('d-block');
      }
    });
  }
};
</script>

<style lang="scss">
@import 'bootstrap/scss/bootstrap.scss';

body {
  position: relative;
}
.back-to-top {
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: 1000;
  color: #2c3e50;
}
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
.footer-bg {
  background-color: #42b983;
}
@media (max-width: 768px) {
  .mobile-h1 {
    font-size: 1.25rem;
  }
  .mobile-direction {
    flex-direction: column;
  }
  .md-none {
    display: none;
  }
}
</style>
