<template>
    <div class="title"> 光谱数据分类测试 </div>
    <div class="head">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="请选择样品：">
              <el-select v-model="id" placeholder="下拉选择">
                <el-option
                  v-for="item in data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <button type="button" @click=confirm>确认</button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div id="chart" style="height:600px;width:1400px;"></div>
  </template>
  
  <script setup>
  import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
  import * as echarts from 'echarts';
  
  let { proxy } = getCurrentInstance();
  
  const data = ref([])
  const id = ref()
  
  onMounted(() => {
    proxy.$http.get("/api/spectrum/getAllData").then(res => {
      data.value = res.data;
    })
  })
  
  
const confirm = () => {
  proxy.$http.post("/spectrum/test/" + id.value).then(res => {
    let data = res.data;
    echarts.init(document.getElementById('chart')).dispose();
    var myChart = echarts.init(document.getElementById('chart'));
    myChart.setOption({
      title: {
        text: '光谱数据'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['原始数据', '初步平滑', '背景荧光', '校准基线', '二次平滑']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xdata
      },
      yAxis: {
        type: 'value',
        interval:0.1, // 步长
        min:-0.1, // 起始
        max:0.1, // 终止
      },
      series: [
        {
          name: '原始数据',
          type: 'line',
          data: data.originY
        },
        {
          name: '初步平滑',
          type: 'line',
          data: data.sm1
        },
        {
          name: '背景荧光',
          type: 'line',
          data: data.background
        },
        {
          name: '校准基线',
          type: 'line',
          data: data.corrected
        },
        {
          name: '二次平滑',
          type: 'line',
          data: data.sm2
        }
      ]
    });
  })
}
  
  
  </script>
  
  <style scoped>
  .title{
    font-size: 40px;
    margin: 20px 0;
  }
  
  #chart{
    height:100%;
    width:100%;
  }
  
  </style>
  