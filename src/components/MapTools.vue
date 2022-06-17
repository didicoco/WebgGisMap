<template>
    <div class="maptools-view">
        <span class="maptools-item" @click="handleMapToolsitemClick" id="xzqh">行政区导航</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="mls">目录树管理</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="distance">距离测量</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="area">面积测量</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="clear">清屏</span>
    </div>
</template>

<script>
export default {
    name: 'MapTools',
    methods: {
        handleMapToolsitemClick(event) {
            console.log(event.target.id);
            switch (event.target.id) {
                case 'xzqh':
                    break;
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
</style>
