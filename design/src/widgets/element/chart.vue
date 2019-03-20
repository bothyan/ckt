<template>
  <barChart v-if="chartKind=='bar'" :json="json" :eleIndex="eleIndex"></barChart>
  <triangleChart v-else-if="chartKind=='histogram'" :json="json" :eleIndex="eleIndex"></triangleChart>
  <lineChart v-else-if="chartKind=='line'" :json="json" :eleIndex="eleIndex"></lineChart>
  <areaChart v-else-if="chartKind=='area'" :json="json" :eleIndex="eleIndex"></areaChart>
  <columnChart v-else-if="chartKind=='cone'" :json="json" :eleIndex="eleIndex"></columnChart>
</template>
<script>
import barChart from './chart/bar.vue';
import lineChart from './chart/line.vue';
import areaChart from './chart/area.vue';
import triangleChart from './chart/triangle.vue';
import columnChart from './chart/column.vue'

export default {
  name: 'svgChart',
  props: ['json','eleIndex'],
  components: {
    barChart, lineChart, areaChart, triangleChart, columnChart
  },
  data() {
    return {
      chartKind: '',
      eleid:''
    }
  },
  created() {
    this.eleid = this.$parent.eleData['eleid'];
    this.chartKind = this.json['chart-kind']
  },
  watch: {
    json: {
      handler(old,val) {
        if(JSON.stringify(old) === JSON.stringify(val)){
          return
        }
        this.chartKind = this.json['chart-kind']
      },
      deep: true
    }
  }
}
</script>