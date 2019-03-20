import dataHandle from 'common/dataHandle';

const svgChart = {
    resizeTable(info,elem){
        let vuex = dataHandle.vuexGetters();
        let pageScale = vuex.getPageScale;

        let width = info.width / pageScale,
        height = info.height / pageScale;
        elem['data-elem']['viewBox'] = `0 0 ${width} ${height}`;
    }
}
export default svgChart;