<template>
  <div id="app">
    <div class="content">
      <Map id="map" :air_quality="this.airQuality"/>
    </div>
  
    <div class="bottom-control">
      <div class="indicator">
        <v-date-picker 
          v-model='selectedDate' 
          locale='custom' 
          :available-dates='this.availableDates'>
          <b-icon icon="calendar" size="small" />
        </v-date-picker>
      </div>
      
      <div class="indicator">
        <b-select placeholder="Selezione un parametro" v-model="indicator" rounded size="is-small">
          <option
            v-for="indicator in indicators"
            :value="indicator"
            :key="indicators.indexOf(indicator)">
              {{ indicator }}
            </option>
        </b-select>
      </div>

      <div class="indicator legend">
        <div
          v-for="x in legendMap"
          :key="legendMap.indexOf(x)"
          :style="{ color: x.color }">
          <b-icon v-if="legendMap.indexOf(x) == 0"
                icon="help-circle"
                size="is-small">
          </b-icon>
          <b-icon v-else
                icon="checkbox-blank-circle"
                size="is-small">
          </b-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from './components/Map'
import axios from 'axios'
import { pm10, pm25, so2, no2, o3 } from './model/air_quality_evaluator.js'

const base_url = 'https://itairq.herokuapp.com/api/v1'

export default {
  name: 'app',
  components: {
    Map
  },
  data() {
    return {
      legendMap: [
        {color:'#dfdfdf', label:'Dato non presente'}, 
        {color:'#29b100', label:'Qualità ottima'}, 
        {color:'#96f07b', label:'Qualità buona'}, 
        {color:'#f0e641', label:'Qualità media'}, 
        {color:'#ff5050', label:'Qualità scarsa'}, 
        {color:'#960032', label:'Qualità pessima'},         
      ],
      nationalAirQuality: [],
      indicator: 'pm10',
      indicators: ['pm10', 'pm25', 'so2', 'no2', 'o3'],
      selectedDate: new Date(),
      availableDates: [],
      showModal: false,
      airQuality: {}
    }
  },
  methods: {
    formatDate: function(date) {
      const day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
      const formatted = `${year}/${month}/${day}` 

      return formatted
    },

    parseDate: function(string) {
      const splitted = string.split('-').map((el) => parseInt(el))
      const date = new Date(splitted[0], splitted[1] - 1, splitted[2]) 
      return date
    },

    evaluateAirQuality: function() {
      let valueMethod = null

      switch (this.indicator) {
        case 'so2':
          valueMethod = so2
          break
        case 'no2':
          valueMethod = no2
          break
        case 'o3':
          valueMethod = o3
          break
        case 'pm25':
          valueMethod = pm25
          break
        case 'pm10':
          valueMethod = pm10
          break
      }

      let provinces = {}

      this.nationalAirQuality.forEach(region => {
        region.provinces.forEach(province => {
          provinces[province.short] = valueMethod(province)
        })
      })

      this.airQuality = provinces
    },

    fetchNationalData: function() {
      const vm = this
      const date = this.formatDate(this.selectedDate)

      axios.get(`${base_url}/${date}`).then((res) => {
        vm.nationalAirQuality = res.data
        vm.evaluateAirQuality()
      })
      .catch((err) => console.log(err))
    },

    fetchAvailableDates: function() {
      const vm = this

      axios.get(`${base_url}/dates`).then((res) => {
        vm.availableDates = res.data.map((el) => vm.parseDate(el))
      })
      .catch((err) => console.log(err))
    }
  },
  watch: {
    selectedDate: function() {
      this.fetchNationalData()
    },
    indicator: function() {
      this.evaluateAirQuality()
    }
  },

  beforeMount() {
    this.fetchAvailableDates()
    this.fetchNationalData()
  }
}
</script>

<style scoped>
#app {
  display: grid;
  grid-template-rows: 90% 10%;
  width: 100vw;
  height: 100vh;
}

.bottom-control {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.indicator {
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.legend {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4em;
}
</style>
