import {mergeData2} from "../js/project";
import {convertDateFromString} from "../js/utils"

export const viewData = {
    data: [],
    loading: true,
    unReadNum: 0,
}

export const init_news_data = function () {
    $EventBus.$on("refresh-news-complete", function (isSucces, data) {
        if(isSucces) mergeViewData(data)
    })
}

const mergeViewData = function (list) {
    ///mergeData2(list, viewData.data);
    viewData.data.splice(0, 0, ...list);
    viewData.data = viewData.data.sort(function (a, b) {
        if(a.readed == false) return -1;
        let aTime = a.time + "";
        let bTime = b.time + "";
        let date = convertDateFromString(aTime);
        let date1 = convertDateFromString(bTime);
        return date.getTime() > date1.getTime() ? -1:1
    })
}
