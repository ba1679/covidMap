<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <section class="container">
      <div class="globalStatus">
        更新日期: {{ timeString }} (台灣時間)
        <ul>
          <li>今日新增確診人數: {{ globalStatus.todayCases | ThousandsComma }}人</li>
          <li>今日新增死亡人數: {{ globalStatus.todayDeaths | ThousandsComma }}人</li>
          <li>截至目前死亡人數: {{ globalStatus.deaths | ThousandsComma }}人</li>
          <li>全球總確診人數: {{ globalStatus.cases | ThousandsComma }}人</li>
        </ul>
      </div>
    </section>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">累積確診病例排名</div>
            <div class="card-body">
              <div id="totalChart"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">今日確診病例排名</div>
            <div class="card-body">
              <div id="todayChart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chart',
  data() {
    return {
      isLoading: false,
      globalStatus: {},
      allCountries: []
    };
  },
  computed: {
    timeString() {
      const updatedTime = new Date(this.globalStatus.updated);
      return updatedTime.toLocaleString();
    },
    sortTotalCases() {
      return this.allCountries.sort((a, b) => {
        return b.cases - a.cases;
      });
    },
    sortTodayCases() {
      return this.allCountries.sort((a, b) => {
        return b.todayCases - a.todayCases;
      });
    }
  },
  methods: {
    getAllStatus() {
      const vm = this;
      const url = 'https://corona.lmao.ninja/v3/covid-19/all';
      this.$http
        .get(url)
        .then((res) => {
          vm.globalStatus = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getYesterdayStatus() {
      const vm = this;
      const url = 'https://corona.lmao.ninja/v3/covid-19/all?yesterday=yesterday';
      this.$http
        .get(url)
        .then((res) => {
          console.log(res.data);
          console.log(new Date(res.data.updated));
          // vm.globalStatus = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllCountries() {
      const vm = this;
      vm.isLoading = true;
      const url = 'https://corona.lmao.ninja/v3/covid-19/countries';
      this.$http
        .get(url)
        .then((res) => {
          vm.allCountries = res.data;
          this.renderTotalChart();
          this.renderTodayChart();
          vm.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    renderTotalChart() {
      let chartData = ['總確診人數'];
      let countryData = [];
      this.sortTotalCases.forEach((item) => {
        countryData.push(item.country);
        chartData.push(item.cases);
      });
      chartData.splice(11, chartData.length);
      countryData.splice(10, countryData.length);
      let chart = c3.generate({
        bindto: '#totalChart',
        data: {
          columns: [chartData],
          type: 'bar'
        },
        color: {
          pattern: ['#2C3E50']
        },
        axis: {
          x: {
            type: 'category',
            categories: countryData
          }
        }
      });
    },
    renderTodayChart() {
      let chartData = ['今日確診人數'];
      let countryData = [];
      this.sortTodayCases.forEach((item) => {
        countryData.push(item.country);
        chartData.push(item.todayCases);
      });
      chartData.splice(11, chartData.length);
      countryData.splice(10, countryData.length);
      let chart = c3.generate({
        bindto: '#todayChart',
        data: {
          columns: [chartData],
          type: 'bar'
        },
        color: {
          pattern: ['#42B983']
        },
        axis: {
          x: {
            type: 'category',
            categories: countryData
          }
        }
      });
    }
  },
  mounted() {
    this.getAllStatus();
    this.getAllCountries();
    // this.getYesterdayStatus();
  }
};
</script>
