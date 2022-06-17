<template>
    <div class="maptree-pannel" v-show="this.$store.getters._getDefaultMapTreeVisible">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
const options = {
    url: 'https://js.arcgis.com/4.23/init.js',
    css: 'https://js.arcgis.com/4.23/esri/themes/light/main.css',
};

export default {
    name: 'MapTree',
    data() {
        return {
            data: [
                {
                    label: '冷暖图层',
                    //添加图层需要layerid、layerurl两个属性
                    children: [
                        {
                            label: '暖色系图层',
                            layerid: 'layerid0',
                            layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
                        },
                        {
                            label: '灰色系图层',
                            layerid: 'layerid0',
                            layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer',
                        },
                    ],
                },
                {
                    label: '行政区划图层',
                    children: [
                        {
                            label: '省级',
                            layerid: 'layerid1',
                            layerurl: 'https://localhost:6443/arcgis/rest/services/ChinaMap/ChinaMap_total/MapServer/0',
                        },
                        {
                            label: '市级',
                            layerid: 'layerid1',
                            layerurl: 'http://localhost:6080/arcgis/rest/services/ChinaMap/ChinaMap_total/MapServer/1',
                        },
                        {
                            label: '县级',
                            layerid: 'layerid1',
                            layerurl: 'http://localhost:6080/arcgis/rest/services/ChinaMap/ChinaMap_total/MapServer/2',
                        },
                    ],
                },
                {
                    label: '一级 3',
                    children: [
                        {
                            label: '二级 3-1',
                            children: [
                                {
                                    label: '三级 3-1-1',
                                },
                            ],
                        },
                        {
                            label: '二级 3-2',
                            children: [
                                {
                                    label: '三级 3-2-1',
                                },
                            ],
                        },
                    ],
                },
            ],
            defaultProps: {
                children: 'children',
                label: 'label',
            },
        };
    },
    methods: {
        async handleNodeClick(data) {
            switch (data.layerid) {
                case 'layerid0':
                    if (data.layerurl) {
                        const view = this.$store.getters._getDefaultView; //通过VUEX获得公共的view
                        const resultLayer = view.map.findLayerById('layerid');
                        if (resultLayer) view.map.remove(resultLayer);
                        const [TileLayer] = await loadModules(['esri/layers/TileLayer'], options);
                        //实例化目录树中加载的图层--添加切片地图
                        const layer = new TileLayer({ url: data.layerurl });
                        view.map.add(layer);
                        console.log('你点了1');
                    }
                    break;
                case 'layerid1':
                    if (data.layerurl) {
                        console.log('你点了2');
                        const view = this.$store.getters._getDefaultView; //通过VUEX获得公共的view
                        const resultLayer = view.map.findLayerById('layerid');
                        if (resultLayer) view.map.remove(resultLayer);
                        //实例化目录树中加载的图层--添加要素地图
                        const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], options);
                        const featureLayer = new FeatureLayer({
                            url: data.layerurl,
                        });
                        view.map.add(featureLayer);
                    }
                    break;
                default:
                    break;
            }
        },
    },
};
</script>

<style>
.maptree-pannel {
    position: absolute;
    width: 200px;
    height: 300px;
    top: 30px;
    left: 30px;
    background-color: #fff;
}
</style>
