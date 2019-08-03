import {mergeData2} from "../js/project";
import {convertDateFromString} from "../js/utils"
import {viewData} from "./view_data";

export const viewDataHdy = {
    data: [],
    loading: true,
    unReadNum: 0,
}

export const init_hdy_data = function () {
    $EventBus.$on("refresh-hdy-complete", function (isSucces, args) {
        if(isSucces) mergeViewDataHdy(args)
    })
}

const mergeViewDataHdy = function ({next, data}) {
    //mergeData2(list, viewDataHdy.data);
    if(next == "next") viewDataHdy.data.push(...data);
    else viewDataHdy.data.splice(0, 0, ...data);
}


