<template>
    <div id="mapview"></div>
</template>

<script>
import { loadModules } from 'esri-loader';

const options = {
    url: 'https://js.arcgis.com/4.23/init.js',
    css: 'https://js.arcgis.com/4.23/esri/themes/light/main.css',
}; //1.引入ArcGis for js的API
export default {
    name: 'MapView',
    components: {},
    mounted: function () {
        console.log(this.$store.getters._getDefaultView);
        // console.log(this.$store.state._defaultView);
        this._createMapView(); //生命周期函数，钩子函数，挂载
    },
    methods: {
        async _createMapView() {
            const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView'], options); //2.加载模块
            //3.实例化地图
            const map = new Map({
                basemap: 'osm',
            });
            const mapview = new MapView({
                container: 'mapview',
                map: map,
                zoom: 10, //从1到19，数字越大，地图范围越小，精度越高
                center: [118.790024, 32.048483],
            });
            mapview.ui.components = [];
            this.$store.commit('_setDefaultView', mapview);
        },
    },
};
</script>

<style>
#mapview {
    position: relative;
    width: 100%;
    height: 100%;
    /* padding: 0; */
}
</style>
