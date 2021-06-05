<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <section class="container-fluid">
      <div class="globalStatus">
        <div class="h3">
          全球疫情概況 :
        </div>
        <small class="text-muted">最後更新時間: {{ timeString }} (台灣時間)</small>
        <div class="row my-3">
          <div class="col-lg-3 col-md-6 mb-2">
            <div class="card text-center py-2 h-100">
              <i class="fas fa-user-plus fa-2x"></i>
              今日新增確診人數:
              <div class="h4">{{ globalStatus.todayCases | ThousandsComma }}人</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-2">
            <div class="card text-center py-2 h-100">
              <i class="fas fa-sad-tear fa-2x"></i>
              今日新增死亡人數:
              <div class="h4">{{ globalStatus.todayDeaths | ThousandsComma }}人</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-2">
            <div class="card text-center py-2 h-100">
              <i class="fas fa-bible fa-2x"></i>
              截至目前死亡人數:
              <div class="h4">{{ globalStatus.deaths | ThousandsComma }}人</div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-2">
            <div class="card text-center py-2 h-100">
              <i class="fas fa-globe-americas fa-2x"></i>
              全球總確診人數:
              <div class="h4">{{ globalStatus.cases | ThousandsComma }}人</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6 col-12 mb-3">
          <div class="card">
            <div class="card-header d-flex">累積確診病例排名<small class="ml-auto">(以百萬為單位)</small></div>
            <div class="card-body">
              <div id="totalChart"></div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-12 mb-3">
          <div class="card">
            <div class="card-header d-flex">今日確診病例排名<small class="ml-auto">(以千為單位)</small></div>
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
    }
  },
  computed: {
    timeString() {
      const updatedTime = new Date(this.globalStatus.updated)
      return updatedTime.toLocaleString()
    },
    sortTotalCases() {
      return this.allCountries.sort((a, b) => {
        return b.cases - a.cases
      })
    },
    sortTodayCases() {
      return this.allCountries.sort((a, b) => {
        return b.todayCases - a.todayCases
      })
    }
  },
  methods: {
    getAllStatus() {
      const vm = this
      const url = 'https://corona.lmao.ninja/v3/covid-19/all'
      this.$http
        .get(url)
        .then((res) => {
          vm.globalStatus = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getAllCountries() {
      const vm = this
      vm.isLoading = true
      const url = 'https://corona.lmao.ninja/v3/covid-19/countries'
      this.$http
        .get(url)
        .then((res) => {
          vm.allCountries = res.data
          this.renderTotalChart()
          this.renderTodayChart()
          vm.isLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    renderTotalChart() {
      let chartData = []
      let countryData = []
      this.sortTotalCases.forEach((item) => {
        countryData.push(item.country)
        chartData.push(item.cases)
      })
      chartData.splice(10, chartData.length)
      countryData.splice(10, countryData.length)
      let numMillon = chartData.map((item, index) => {
        return Number((item / 1000000).toFixed(2))
      })
      numMillon.unshift('總確診人數')
      let chart = c3.generate({
        bindto: '#totalChart',
        data: {
          columns: [numMillon],
          type: 'bar'
        },
        color: {
          pattern: ['#2C3E50']
        },
        padding: {
          bottom: 30
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            categories: countryData,
            padding: {
              left: 0,
              right: 0
            }
          },
          y: {
            label: {
              text: '(以百萬為單位)',
              position: 'outer-middle'
            },
            tick: {
              format: function(num) {
                return num + 'M'
              }
            }
          }
        }
      })
    },
    renderTodayChart() {
      let chartData = []
      let countryData = []
      this.sortTodayCases.forEach((item) => {
        countryData.push(item.country)
        chartData.push(item.todayCases)
      })
      chartData.splice(10, chartData.length)
      countryData.splice(10, countryData.length)
      let numThousands = chartData.map((item, index) => {
        return Number((item / 1000).toFixed(2))
      })
      numThousands.unshift('今日確診人數')
      let chart = c3.generate({
        bindto: '#todayChart',
        data: {
          columns: [numThousands],
          type: 'bar'
        },
        color: {
          pattern: ['#42B983']
        },
        padding: {
          bottom: 30
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            categories: countryData,
            padding: {
              left: 0,
              right: 0
            }
          },
          y: {
            label: {
              text: '(以千為單位)',
              position: 'outer-middle'
            },
            tick: {
              format: function(num) {
                return num + 'K'
              }
            }
          }
        }
      })
    }
  },
  mounted() {
    this.getAllStatus()
    this.getAllCountries()
  }
}
</script>
