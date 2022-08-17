<template>
    <div class="mapdata-visual-view">
        <div id="sceneview"></div>
        <div id="echarts01">01010</div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import * as echarts from 'echarts';
const options = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
};
export default {
    name: 'MapDataVisual',
    components: {},
    data() {
        return {
            data: '',
        };
    },
    mounted() {
        this.initMap();
        this.initEcharts01();
    },
    methods: {
        //实例化三维底图
        async initMap() {
            const [Map, SceneView, Basemap, TileLayer] = await loadModules(
                ['esri/Map', 'esri/views/SceneView', 'esri/Basemap', 'esri/layers/TileLayer'],
                options,
            );

            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });
            console.log(111);
            const map = new Map({
                basemap,
            });

            const sceneView = new SceneView({
                container: 'sceneview',
                map: map,
            });

            sceneView.ui.components = [];
        },
        //实例化图表
        initEcharts01() {
            const myChart = echarts.init(document.getElementById('echarts01'));

            // 指定图表的配置项和数据
            const option = {
                title: {
                    text: 'ECharts 入门示例',
                },
                tooltip: {},
                legend: {
                    data: ['销量'],
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        label: {
                            show: true,
                        },
                        itemStyle: {
                            color: function (a) {
                                const color1 = new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    1,
                                    0, //0，0，1，0分别代表了右、下、左、上四个位置的颜色坐标
                                    [
                                        {
                                            offset: 0,
                                            color: '#e30430', //0%处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#f6c6a2', //100%处的颜色
                                        },
                                    ],
                                    false,
                                );
                                const color2 = new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: '#e30430', //0%处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#f6c6a2', //100%处的颜色
                                        },
                                    ],
                                    false,
                                );
                                const colorList = [color1, color2];
                                return colorList[a.dataIndex];
                            },
                        },
                        data: [5, 20, 36, 10, 10, 20],
                    },
                ],
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
    },
};
</script>

<style>
.mapdata-visual-view {
    position: relative;
    width: 100%;
    height: 100%;
}
#sceneview {
    width: 100%;
    height: 100%;
}
#echarts01 {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 300px;
    height: 200px;
}
</style>
