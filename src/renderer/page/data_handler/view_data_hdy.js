import {mergeData2} from "../js/project";
import {convertDateFromString} from "../js/utils"

export const viewDataHdy = {
    data: [],
    loading: true,
    unReadNum: 0,
}

export const init_hdy_data = function () {
    $EventBus.$on("refresh-hdy-complete", function (isSucces, data) {
        if(isSucces) mergeViewDataHdy(data)
    })
}

const mergeViewDataHdy = function (list) {
    mergeData2(list, viewDataHdy.data);
    viewDataHdy.data = viewDataHdy.data.sort(function (a, b) {
        let aTime = a.time + "";
        let bTime = b.time + "";
        let date = convertDateFromString(aTime);
        let date1 = convertDateFromString(bTime);
        if(a.readed == false) return -1;
        return date.getTime() > date1.getTime() ? -1:1
    })
}


