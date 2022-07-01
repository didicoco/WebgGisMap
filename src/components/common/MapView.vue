<template>
    <div class="mapview-pannel">
        <div id="mapview"></div>
        <div id="basemapToggle"></div>
        <div id="scaleBar"></div>
        <div id="zoom"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';

const options = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
}; //1.引入ArcGis for js的API
export default {
    name: 'MapView',
    components: {},
    mounted: function () {
        // console.log(this.$store.getters._getDefaultView);
        // console.log(this.$store.state._defaultView);
        this._createMapView(); //生命周期函数，钩子函数，挂载
    },
    methods: {
        async _createMapView() {
            const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/Basemap',
                    'esri/layers/TileLayer',
                    'esri/widgets/BasemapToggle',
                    'esri/widgets/ScaleBar',
                    'esri/widgets/Zoom',
                ],
                options,
            ); //2.加载模块
            //3.实例化地图
            // create a basemap from a dynamic mapserver
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
            const map = new Map({
                basemap, //basemap: 'basemap',报错
            });

            const mapview = new MapView({
                container: 'mapview',
                map: map,
                zoom: 10, //从1到19，数字越大，地图范围越小，精度越高
                center: [118.790024, 32.048483],
            });

            //实例化地图切换控件
            const basemapToggle = new BasemapToggle({
                view: mapview,
                nextBasemap: 'hybrid',
                container: 'basemapToggle',
            });
            //添加地图控件方法一：
            // mapview.ui.add(basemapToggle, {
            //     position: 'bottom-right',//可选值只有四个：左上角top-left，左下角bottom-left，右上角top-right，右下角bottom-right。
            // });
            //添加地图控件方法二:
            mapview.ui.add(basemapToggle); //basemapToggle绑定的是页面DOM的位置,要配合container属性使用,好处是可以用CSS控制自定义位置
            //实例化比例尺
            const scaleBar = new ScaleBar({
                view: mapview,
                container: 'scaleBar',
                unit: 'metric',
            });
            // Add widget to the bottom left corner of the view
            mapview.ui.add(scaleBar);
            //实例化地图缩放控件
            const zoom = new Zoom({
                view: mapview,
                container: 'zoom',
            });
            mapview.ui.add(zoom);
            mapview.ui.components = [];
            this.$store.commit('_setDefaultView', mapview); //把mapview配置到VUEX里，index.js，公共的view
        },
    },
};
</script>

<style>
.mapview-pannel,
#mapview {
    position: relative;
    width: 100%;
    height: 100%;
}
#basemapToggle {
    position: absolute;
    right: 15px;
    bottom: 15px;
}
#scaleBar {
    position: absolute;
    left: 15px;
    bottom: 15px;
}
#zoom {
    position: absolute;
    right: 30px;
    bottom: 100px;
}
</style>
