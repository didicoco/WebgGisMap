<template>
    <div class="maptools-view">
        <span class="maptools-item" @click="handleMapToolsitemClick" id="xzqh">行政区导航</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="mls">目录树管理</span>
        <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link"> 地图测量<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="distance">距离测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="area">面积测量</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link"> 更多功能<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-search" command="spacequery">空间查询</el-dropdown-item>
                <el-dropdown-item icon="el-icon-film" command="morescreen">多屏对比</el-dropdown-item>
                <el-dropdown-item icon="el-icon-reading" command="swipanalyst">卷帘分析</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="clear">清屏</span>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
const options = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
};
export default {
    name: 'MapTools',
    methods: {
        handleMapToolsitemClick(event) {
            //  console.log(event.target.id);
            switch (event.target.id) {
                case 'xzqh': {
                    const currentVisible = this.$store.getters._getDefaultXZQHPannelVisible;
                    this.$store.commit('_setDefaultXZQHPannelVisible', !currentVisible); //行政区划的开关
                    break;
                }
                case 'mls': {
                    const currentVisible = this.$store.getters._getDefaultMapTreeVisible;
                    this.$store.commit('_setDefaultMapTreeVisible', !currentVisible); //目录树的开关
                    break;
                }
                case 'distance':
                    break;
                case 'area':
                    break;
                case 'clear':
                    break;
                default:
                    break;
            }
        },
        handleCommand(command) {
            switch (command) {
                case 'distance':
                    break;
                case 'area':
                    break;
                case 'spacequery':
                    this.initSpaceQuery();
                    break;
                case 'morescreen':
                    break;
                case 'swipanalyst':
                    break;
                default:
                    break;
            }
        },
        //initSpaceQuery 空间查询方法
        async initSpaceQuery() {
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            //1、绘制面状区域
            const [SketchViewModel, Graphic, GraphicsLayer] = await loadModules(
                ['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic', 'esri/layers/GraphicsLayer'],
                options,
            );

            const resultLayer = view.map.findLayerById('polygonGraphicLayer');
            if (resultLayer) {
                view.map.remove(resultLayer);
            }
            const graphicsLayer = new GraphicsLayer({
                id: 'polygonGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground', //指定图形在垂直轴 (z) 上的放置方式,on-the-ground忽略Z值
                },
            });
            view.map.add(graphicsLayer);
            //定义面状区域的样式(符号化渲染)
            const polygonSymbol = {
                type: 'simple-fill',
                color: 'rgba(216,30,6,0.4)',
                style: 'solid',
                outline: {
                    color: '#d81e06',
                    width: 1,
                },
            };
            //自定义草图工具
            var sketchViewModel = new SketchViewModel({
                updateOnGraphicClick: false,
                view,
                layer: graphicsLayer,
                polygonSymbol,
            });
            sketchViewModel.create('polygon'); //指定绘制的样式
            //监听sketchViewModel的状态
            sketchViewModel.on('create-complete', function (event) {
                const graphic = new Graphic({
                    geometry: event.geometry,
                    symbol: sketchViewModel.graphic.symbol,
                });
                graphicsLayer.add(graphic);
            });
            //监听create状态，回调handleSpaceQuery方法去查询要素
            sketchViewModel.on('create', function (event) {
                if (event.state === 'complete') {
                    _self.handleSpaceQuery(event.graphic);
                }
            });
        },
        //2、执行空间查询的方法
        handleSpaceQuery(graphic) {
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            const resultLayer = view.map.findLayerById('layerid1');
            // const resultLayer = view.map.allLayers._items[1];(找不到ID时的替代方法)
            if (!resultLayer) {
                _self.$message({
                    message: '尚未添加业务图层，不能进行空间查询',
                    type: 'warning',
                });
                return;
            }
            const queryPoint = resultLayer.createQuery();
            queryPoint.geometry = graphic.geometry;
            resultLayer
                .queryFeatures(queryPoint)
                .then(function (results) {
                    let currentData = [];
                    if (results.features.length > 0) {
                        //符号化渲染图层
                        _self.renderResultLayer(results.features);
                        //符号化表格数据
                        results.features.map((a, b) => {
                            currentData.push({
                                name: a.attributes.name,
                                type: a.attributes.type,
                                tieluju: a.attributes.tieluju,
                                address: a.attributes.address,
                                lon: a.attributes.lon,
                                lat: a.attributes.lat,
                                key: b,
                            });
                        });
                        // console.log('currentData', currentData);
                        // console.log('results.features', results.features);
                    } else {
                        currentData.length = 0;
                    }
                    _self.$message({
                        message: `查询成功，共查到 ${results.features.length}条数据`,
                        type: 'success',
                    });
                    _self.$store.commit('_setDefaultQueryResult', currentData);
                    _self.$store.commit('_setDefaultQueryResultVisible', true);
                })
                .catch(function (error) {
                    console.log(error);
                    _self.$message.error('空间查询失败，请联系管理员');
                });
        },
        async renderResultLayer(resultFeatures) {
            const view = this.$store.getters._getDefaultView;
            const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], options);
            const resultLayer = view.map.findLayerById('initResultLayer');
            if (resultLayer) view.map.remove(resultLayer);
            const resultData = this._translateLonLat(resultFeatures);
            //实例化弹窗
            let template = {
                title: '{name}-{tieluju}',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'name',
                                label: '名称',
                            },
                            {
                                fieldName: 'type',
                                label: '类型',
                            },
                            {
                                fieldName: 'tieluju',
                                label: '铁路局',
                            },
                            {
                                fieldName: 'address',
                                label: '地址',
                            },
                        ],
                    },
                ],
            };
            const queryResultLayer = new FeatureLayer({
                source: resultData,
                id: 'initResultLayer',
                ObjectIdField: 'ObjectID',
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: 'picture-marker',
                        url: `static/icon/train.png`,
                        width: '32px',
                        height: '32px',
                    },
                },
                fields: [
                    {
                        name: 'OBJECTID',
                        type: 'oid',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'type',
                        type: 'string',
                    },
                    {
                        name: 'tieluju',
                        type: 'string',
                    },
                    {
                        name: 'address',
                        type: 'string',
                    },
                ],
                popupTemplate: template,
            });
            view.map.add(queryResultLayer);
        },
        _translateLonLat(data) {
            const _self = this;
            if (data.length > 0) {
                _self.geoData = [];
                data.map((value, key) => {
                    _self.geoData.push({
                        geometry: {
                            //geometry的结构是固定死的,必须要有这3项
                            type: 'point',
                            x: Number(value.attributes.lon),
                            y: Number(value.attributes.lat),
                        },
                        attributes: {
                            ObjectID: key + 1,
                            name: value.attributes.name,
                            type: value.attributes.type,
                            tieluju: value.attributes.tieluju,
                            address: value.attributes.address,
                        },
                    });
                });
                // console.log(_self.geoData);
            }
            return _self.geoData;
        },
    },
};
</script>

<style>
.maptools-view {
    position: absolute;
    height: 30px;
    padding: 0 15px;
    top: 20px;
    right: 15px;
    background-color: #fff;
}
.maptools-item {
    line-height: 30px;
    margin-left: 15px;
    color: black;
    cursor: pointer;
    /* cursor:pointer属性是在计算机中将光标呈现为指示链接的指针（一只手）  */
}
.maptools-item:first-child {
    margin-left: 0;
}
.el-dropdown-link {
    font-size: 16px;
}
</style>
