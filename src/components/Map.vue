<template>
  <div class="map">
    <b-message class="val-detail" v-if="this.showInfo != null" type="is-info" has-icon size="is-medium">
      <strong>{{ showInfo.name }}</strong>
      {{ showInfo.value }} µg/m³
    </b-message>
    
    <div class="map-container box" ref="mapEl">
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
import axios from 'axios'

const mapAddr = 'https://gist.githubusercontent.com/n28div/db0b258e697c12dd2f0900e569d1fe02/raw/d487214b16ff2a011e32b386f1ae0a26858ca996/italy-provinces-geojson.json'

export default {
  name: "Map",
  components: {},
  props: ['air_quality'],
  data() {
    return {
      geojson: null,
      zoom: 1500,
      showInfo: null
    }
  },
  methods: {
    drawMap: function() {
      const vm = this
      let el = this.$refs.mapEl;
      el.innerHTML = '';
      let width = 400,
          height = 400

      let svg = d3.select('.map-container')
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('stroke', 'black')
        .attr('stroke-width', '0.3px')
        .classed('map-content', true)
        
      // load topojson
      d3.json(mapAddr, (err, italy) => {
        if (err) return console.log(err)

        let objs_collection = italy.features
        
        let projection = d3.geo.mercator()
          .translate([(width / 2), height / 2])
          .scale(vm.zoom)
          .center([12, 42])
        
        let path = d3.geo.path().projection(projection)

        svg.append("g")
          .attr("class", "tracts")
          .selectAll("path")
          .data(italy.features).enter()
          .append("path")
          .attr("d", path)
          .attr('class', (data) => {
            if (data.id in vm.air_quality)
              return `region quality-${vm.air_quality[data.id].quality_index}`
            else
              return 'region quality-na'
          })
          .on('mouseover', function (d, i) {
            let aq = vm.air_quality[d.id] || null

            if (aq != null && aq.value != null)
              vm.showInfo = {
                name: aq.name,
                value: aq.value
              }
          })
          .on('mouseout', () => vm.showInfo = null)

      });
    }
  },

  watch: {
    air_quality: function(newAq, oldAq) {
      this.drawMap()
    }
  }


}
</script>

<style>
.map-container {
  display: inline-block;
  position: relative;
  width: 90%;
  height: 90%;
  overflow: auto;
}

.map {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
}

.val-detail {
  position: absolute;
  top: 1em;
  right: 2em;
  z-index: 100;
}


.quality-na, .quality-0 {
  fill: #dfdfdf;
}

.quality-1 {
  fill: #96f07b;
}

.quality-2 {
  fill: #29b100;
}

.quality-3 {
  fill: #f0e641;
}

.quality-4 {
  fill: #ff5050;
}

.quality-5 {
  fill: #960032;
}

.region:hover {
  fill: #3c4cda;
}
</style>
