<template>
    <div class="mapview-pannel">
        <div id="mapview"></div>
        <div id="basemapToggle"></div>
        <div id="scaleBar"></div>
        <div id="zoom"></div>
        <div id="compass"></div>
        <div class="view-change" @click="handleViewChale">
            <span>{{ viewModel }}</span>
        </div>
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
    data() {
        return {
            viewModel: '3D',
        };
    },
    mounted: function () {
        this._createMapView(); //生命周期函数，钩子函数，挂载
    },
    methods: {
        async _createMapView() {
            const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom, Compass] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/Basemap',
                    'esri/layers/TileLayer',
                    'esri/widgets/BasemapToggle', //地图切换
                    'esri/widgets/ScaleBar', //比例尺
                    'esri/widgets/Zoom', //放大缩小
                    'esri/widgets/Compass', //指南针,
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
            //实例化底图切换控件
            this.basemapToggle = new BasemapToggle({
                view: mapview,
                nextBasemap: 'hybrid',
                container: 'basemapToggle',
            });

            // mapView.ui.add(basemapToggle, {
            //     position: 'bottom-right',
            // });
            mapview.ui.add(this.basemapToggle);

            //比例尺实例化控件
            this.scaleBar = new ScaleBar({
                view: mapview,
                unit: 'metric',
                style: 'ruler',
                container: 'scaleBar',
            });
            mapview.ui.add(this.scaleBar);

            //放大缩小控件
            this.zoom = new Zoom({
                view: mapview,
                container: 'zoom',
            });
            mapview.ui.add(this.zoom);

            //指南针
            this.compass = new Compass({
                view: mapview,
                container: 'compass',
            });
            mapview.ui.add(this.compass);

            mapview.ui.components = [];
            this.$store.commit('_setDefaultView', mapview); //把mapview配置到VUEX里，index.js，公共的view
        },
        async _createSceneView() {
            document.getElementById('basemapToggle').innerHTML = '';
            document.getElementById('scaleBar').innerHTML = '';
            document.getElementById('zoom').innerHTML = '';
            document.getElementById('compass').innerHTML = '';
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
            const map = new Map({
                basemap,
            });
            const sceneView = new SceneView({
                container: 'mapview',
                map: map,
            });
            setTimeout(() => {
                sceneView.goTo({
                    zoom: 10,
                    center: [104.072745, 30.663774],
                });
            }, 1000);
            sceneView.ui.components = [];
            this.$store.commit('_setDefaultView', sceneView);
        },
        handleViewChale() {
            if (this.viewModel === '3D') {
                this._createSceneView();
                this.viewModel = '2D';
            } else {
                this._createMapView();
                this.viewModel = '3D';
            }
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
#compass {
    position: absolute;
    left: 20px;
    top: 20px;
}
.view-change {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 30px;
    bottom: 180px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.view-change span {
    line-height: 32px;
}
</style>
