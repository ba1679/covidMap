<template>
  <div>
    <section class="container-fluid">
      <div class="row">
        <div class="col-lg-3">
          <div class="h4">請選擇欲查詢的國家</div>
          <select
            class="form-control mb-1"
            name="continent"
            v-model="select.continent"
            @change="
              removeMarker();
              updateMap();
              select.country = '';
            "
          >
            <option v-for="continent in continentFilter" :value="continent" :key="continent">
              {{ continent }}
            </option>
          </select>
          <select class="form-control" name="country" v-model="select.country" @change="updateCountryMap">
            <option value="" disabled>---請選擇國家---</option>
            <option v-for="country in countryFilter" :value="country.country" :key="country.country">{{
              country.country
            }}</option>
          </select>
          <div class="info mt-4 text-center" v-if="dataFilter">
            <img class="flag" :src="dataFilter.countryInfo.flag" alt="國家國旗" />
            <i class="fas fa-spinner fa-spin" v-if="dataLoading"></i>
            <div class="h4" v-else-if="!dataFilter">請先選擇國家</div>
            <div class="h4 mt-4">
              今日確診人數: <br />
              <strong class="text-danger">{{ dataFilter.todayCases | thousandsComma }}</strong
              >人
              <br />
              Today Cases: <strong class="text-danger">{{ dataFilter.todayCases | thousandsComma }}</strong> <br />
              <div class="h6 mt-3">最後更新時間 : <br />{{ timeString }}</div>
            </div>
          </div>
        </div>
        <div class="col-lg-9 p-0">
          <div id="map"></div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import L from 'leaflet';
import countryName from '../assets/countryName.json';

let osmMap = {};
export default {
  name: 'Map',
  data() {
    return {
      select: {
        continent: 'Asia',
        country: 'Taiwan'
      },
      dataLoading: false,
      countryName,
      covidData: []
    };
  },
  computed: {
    continentFilter() {
      let continents = [];
      this.countryName.forEach((item) => {
        continents.push(item.continent);
      });
      let continentsFilted = continents.filter((item, index, ary) => {
        return ary.indexOf(item) === index;
      });
      return continentsFilted;
    },
    countryFilter() {
      let countriesFilted = this.countryName.filter((item) => {
        return item.continent === this.select.continent;
      });
      return countriesFilted;
    },
    dataFilter() {
      let covidDataCountry;
      covidDataCountry = this.covidData.filter((item) => {
        return item.country === this.select.country;
      });
      return covidDataCountry[0];
    },
    timeString() {
      return new Date(this.dataFilter.updated).toLocaleString();
    }
  },
  methods: {
    getCountryData() {
      const vm = this;
      const url = 'https://corona.lmao.ninja/v3/covid-19/countries';
      vm.dataLoading = true;
      this.$http
        .get(url)
        .then((res) => {
          if (res.status === 200) {
            vm.covidData = res.data;
            vm.updateMap();
            vm.dataLoading = false;
          }
        })
        .catch((err) => {
          vm.covidData = [];
          console.log(err);
        });
    },
    renderMap() {
      // 初始化地圖，定位在台灣
      osmMap = L.map('map', {
        center: [23.5, 121],
        zoom: 6
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(osmMap);
      L.marker([23.5, 121]).addTo(osmMap);
    },
    updateMap() {
      let continentData;
      continentData = this.covidData.filter((item) => {
        let continentModify = item.continent.split('/').pop();
        return continentModify === this.select.continent;
      });
      continentData.forEach((item) => {
        let { lat, long } = item.countryInfo;
        let updateTime = new Date(item.updated).toLocaleString();
        L.marker([lat, long]).addTo(osmMap).bindPopup(`

        <strong class="h6">${item.country}</strong>
        <br>
            今日新增病例: <strong>${item.todayCases}</strong>人 <br>
            目前活躍病例: ${item.active} 人<br>
            累積病例: ${item.cases}人<br>
            累積死亡: ${item.deaths} 人<br>

          <small>更新時間: ${updateTime}</small>`);
      });
      // 亞洲定位在台灣，其他就定位在第一個國家
      if (continentData[0].continent !== 'Asia') {
        this.panTo(continentData[0].countryInfo.lat, continentData[0].countryInfo.long);
      } else {
        this.panTo(23.5, 121);
      }
    },
    updateCountryMap() {
      if (this.dataFilter) {
        let { lat, long } = this.dataFilter.countryInfo;
        this.panTo(lat, long);
      } else {
        alert('無此國家資料');
      }
    },
    //移動到下個區域時，先清掉原有的marker
    removeMarker() {
      // 將所有圖層列出，若是使用L.Marker新增的圖層就清掉
      osmMap.eachLayer((layer) => {
        // instanceof用來檢查某個值是否為某 class 的實例物件或建構函式
        if (layer instanceof L.Marker) {
          osmMap.removeLayer(layer);
        }
      });
    },
    // 重新定位地圖
    panTo(lat, long) {
      osmMap.panTo([lat, long]);
    }
  },
  mounted() {
    this.renderMap();
    this.getCountryData();
  }
};
</script>
<style lang="scss" scoped>
.flag {
  width: 180px;
  height: 130px;
  border-radius: 10px;
}
#map {
  height: 100vh;
}
</style>
