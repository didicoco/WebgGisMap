<template>
    <div class="XZQHComponent-pannel" v-show="this.$store.getters._getDefaultXZQHPannelVisible">
        <div class="XZQHComponent-header">
            <span>行政区划导航</span>
            <i class="el-icon-close" @click="closeXZQHPannel"></i>
        </div>
        <div class="XZQH-select-pannel">
            <span class="XZQH-select-label">省份名称：</span>
            <el-select
                v-model="provinceValue"
                @change="handleProvinceValueChang"
                size="mini"
                clearable
                placeholder="请选择省份"
            >
                <el-option v-for="item in provinceOptions" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="XZQH-content-pannel">
            <tbody>
                <tr v-for="item in cityAndCountyOptions" :key="item.label">
                    <td style="min-width: 50px">
                        <span class="city-item" :value="item.value" @click="handleItemClick(item, value, 'city')">
                            {{ item.label }}
                        </span>
                    </td>
                    <td>
                        <span
                            class="county-item"
                            v-for="item2 in item.children"
                            :key="item2.attributes.Name"
                            :value="item2.attributes.Code"
                            @click="handleItemClick(item2.attributes.Code, 'county')"
                        >
                            {{ item2.attributes.Name }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
const options = {
    url: 'https://js.arcgis.com/4.23/init.js',
    css: 'https://js.arcgis.com/4.23/esri/themes/light/main.css',
};

export default {
    name: 'XZQHComponent',
    data() {
        return {
            provinceOptions: [],
            provinceValue: '',
            cityAndCountyOptions: [],
        };
    },
    mounted: function () {
        this.getProvinceData();
    },
    methods: {
        async getProvinceData() {
            const _self = this;
            const [QueryTask, Query] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], options);
            const queryTask = new QueryTask({
                url: 'https://localhost:6443/arcgis/rest/services/ChinaMap/ChinaMap_total/MapServer/2',
            });
            let query = new Query();
            query.returnGeometry = false; //如果true，则返回的FeatureSet中的每个特征都包含几何。
            query.outFields = ['*']; //要包含在FeatureSet中的属性字段。*代表全部返回
            query.where = '1=1'; //SQL查询语句，范围为所有查询到的值

            //promise then 链式回调
            queryTask.execute(query).then(function (results) {
                let currentData = [];
                if (results.features.length > 0) {
                    results.features.map((item) => {
                        currentData.push({
                            value: item.attributes.Code,
                            label: item.attributes.Name,
                        });
                    });
                    _self.provinceOptions = currentData;
                } else {
                    _self.$message({
                        message: '暂时没有省份数据',
                        type: 'warning',
                    });
                }
            });
        },
        //行政区划 省份数据变化事件
        async handleProvinceValueChang(value) {
            this.getCityAndCountyData(value);
        },
        async getCityAndCountyData(value) {
            const _self = this;
            const provinceCode = value.toString().substring(0, 2);
            const [QueryTask, Query] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], options);
            const queryTask = new QueryTask({
                url: 'http://localhost:6080/arcgis/rest/services/ChinaMap/ChinaMap_total/MapServer/1',
            });
            let query = new Query();
            query.returnGeometry = false;
            query.outFields = ['*'];
            query.where = "Code like '" + provinceCode + "%'";
            //query.where = "code like" + "'" + provinceCode +  "%" + "'";

            let results = await queryTask.execute(query);
            console.log(results);
            let currentCityData = [];
            if (results.features.length > 0) {
                results.features.map((item) => {
                    currentCityData.push({
                        value: item.attributes.Code,
                        label: item.attributes.Name,
                    });
                });
                //循环遍历，获取每一市级对应的区县数据
                Promise.all(
                    currentCityData.map(async (item2) => {
                        const cityCode = item2.value.toString().substring(0, 4);
                        const queryTask2 = new QueryTask({
                            url: 'http://localhost:6080/arcgis/rest/services/ChinaMap/ChinaMap_total/MapServer/0',
                        });
                        let query2 = new Query();
                        query2.returnGeometry = false;
                        query2.outFields = ['*'];
                        query2.where = "Code like '" + cityCode + "%'";

                        const result2 = await queryTask2.execute(query2);
                        item2.children = result2.features;
                        return item2;
                    }),
                ).then((res) => {
                    this.cityAndCountyOptions = res;
                });
            } else {
                _self.$message({
                    message: '暂时没有市级数据',
                    type: 'warning',
                });
            }
        },

        closeXZQHPannel() {
            let currentVisible = this.$store.getters._getDefaultXZQHPannelVisible;
            this.$store.commit('_setDefaultXZQHPannelVisible', !currentVisible); //
        },
    },
};
</script>

<style>
.XZQHComponent-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 500px;
    height: 600px;
    background-color: #fff;
}
.XZQHComponent-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    /* 均匀排列每个元素,首个元素放置于起点，末尾元素放置于终点 */
    justify-content: space-between;
}
.XZQHComponent-header > span {
    line-height: 35px;
    font-size: 20px;
    font-weight: 600;
}
.XZQHComponent-header > i {
    line-height: 35px;
    cursor: pointer;
}
.XZQH-select-pannel {
    width: 100%;
    height: 30px;
    padding: 0 5px;
    box-sizing: border-box;
    margin: 5px 0;
}
.XZQH-select-label {
    font-size: 13px;
}
</style>

