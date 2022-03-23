<template>
  <div class="fans-container">
      <div ref="main" style="width: 600px;height:400px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const myChart = echarts.init(this.$refs.main)
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        type: 'category',
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          data: [120, 200, 150, 80, 70, 110],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    }
    myChart.setOption(option)
  },
  methods: {}
}
</script>

<style scoped lang="less">

</style>
