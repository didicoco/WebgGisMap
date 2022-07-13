<template>
    <div class="morescreen-view">
        <div class="morescreen-top-view">
            <div id="top-left" class="map-item"></div>
            <div id="top-right" class="map-item"></div>
        </div>
        <div class="morescreen-bottom-view">
            <div id="buttom-left" class="map-item"></div>
            <div id="buttom-right" class="map-item"></div>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
const options = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
};
export default {
    name: 'MoreScreen',
    mounted: function () {
        this._initMap();
    },
    methods: {
        async _initMap() {
            const [Map, MapView, Basemap, TileLayer, watchUtils] = await loadModules(
                ['esri/Map', 'esri/views/MapView', 'esri/Basemap', 'esri/layers/TileLayer', 'esri/core/watchUtils'],
                options,
            );
            const basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', //wkid:102100/3857,即网络墨卡托投影
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });
            const map01 = new Map({
                basemap,
            });
            const mapView01 = new MapView({
                container: 'top-left',
                map: map01,
                zoom: 10,
                center: [118.790024, 32.048483],
            });

            const map02 = new Map({
                basemap,
            });
            const mapView02 = new MapView({
                container: 'top-right',
                map: map02,
                zoom: 10,
                center: [118.790024, 32.048483],
            });

            const map03 = new Map({
                basemap,
            });
            const mapView03 = new MapView({
                container: 'buttom-left',
                map: map03,
                zoom: 10,
                center: [118.790024, 32.048483],
            });

            const map04 = new Map({
                basemap,
            });
            const mapView04 = new MapView({
                container: 'buttom-right',
                map: map04,
                zoom: 10,
                center: [118.790024, 32.048483],
            });

            mapView01.ui.components = [];
            mapView02.ui.components = [];
            mapView03.ui.components = [];
            mapView04.ui.components = [];

            //地图联动

            watchUtils.whenTrue(mapView01, 'stationary', function () {
                if (mapView01.center) {
                    // 拿到的X和Y是投影坐标，需要转换为屏幕坐标，再转换为经纬度
                    console.log('投影坐标：', mapView01.center.x.toFixed(2), mapView01.center.y.toFixed(2)); //toFixed(2),小数保留两位有效数字

                    // 1、拿到投影坐标
                    const mapPoint = {
                        x: mapView01.center.x,
                        y: mapView01.center.y,
                        spatialReference: {
                            wkid: 3857, //4326
                        },
                    };

                    //2、转换为屏幕坐标
                    const screenPoint = mapView01.toScreen(mapPoint);
                    console.log('屏幕坐标：', screenPoint);
                    //3、最终转化为地理坐标
                    const rusultPoint = mapView01.toMap(screenPoint);
                    console.log('地理坐标', rusultPoint.longitude, rusultPoint.latitude);
                    console.log('/////分隔符/////');

                    if (screenPoint) {
                        mapView02.goTo({
                            center: [rusultPoint.longitude, rusultPoint.latitude],
                            zoom: mapView01.zoom,
                        });
                        mapView03.goTo({
                            center: [rusultPoint.longitude, rusultPoint.latitude],
                            zoom: mapView01.zoom,
                        });
                        mapView04.goTo({
                            center: [rusultPoint.longitude, rusultPoint.latitude],
                            zoom: mapView01.zoom,
                        });
                    }
                }
                // if (mapView01.extent) {
                //     console.log(
                //         '2',
                //         mapView01.extent.xmin.toFixed(2),
                //         mapView01.extent.ymin.toFixed(2),
                //         mapView01.extent.xmax.toFixed(2),
                //         mapView01.extent.ymax.toFixed(2),
                //     );
                // }
            });
        },
    },
};
</script>

<style>
.morescreen-view {
    width: 100%;
    height: 100%;
}

.map-item {
    width: calc(50% - 2.5px);
    height: 100%;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
}
.morescreen-top-view {
    width: 100%;
    height: calc(50% - 2.5px);
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5px;
}
.morescreen-bottom-view {
    width: 100%;
    height: calc(50% - 2.5px);
    display: flex;
    justify-content: space-between; /* 均匀排列每个元素,每个元素周围分配相同的空间 */
    margin-top: 2.5px;
}
#top-left {
    margin-right: 2.5px;
}
#top-right {
    margin-left: 2.5px;
}
#buttom-left {
    margin-right: 2.5px;
}
#buttom-right {
    margin-left: 2.5px;
}
</style>
