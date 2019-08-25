import {mergeData2} from "../js/project";
import {convertDateFromString} from "../js/utils"
import {viewDataHdy} from "./view_data_hdy";

export const viewData = {
    data: [],
    loading: true,
    unReadNum: 0,
}

export const init_news_data = function () {
    $EventBus.$on("refresh-news-complete", function (isSucces, args) {
        if(isSucces) mergeViewData(args)
    })
}

const mergeViewData = function ({next, data}) {
    if(next == "next") viewData.data.push(...data);
    else viewData.data.splice(0, 0, ...data);

    //如果是定时任务提交的数据就不用排序了, 直接返回
    if(next == "setInterval") return;

    viewData.data = viewData.data.sort(function (a, b) {
        if(a.readed == false) return -1;
        let aTime = a.time + "";
        let bTime = b.time + "";
        let date = convertDateFromString(aTime);
        let date1 = convertDateFromString(bTime);
        return date.getTime() > date1.getTime() ? -1:1
    })
}
