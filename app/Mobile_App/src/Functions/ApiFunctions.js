import axios from "axios";
import {BASE_URL_ML, BASE_URL_WEB} from "../Constants/Constants";
import {showNotification} from "./AppFunctions";

export function API_CALL(config, {type}) {
    let BASE_URL = null;
    if (type == "WEB") {
        BASE_URL = BASE_URL_WEB;
    } else {
        BASE_URL = BASE_URL_ML;
    }

    const API_Config = Object.assign({}, config, {
        url: `${BASE_URL}${config.url}`,
    });
    return axios(API_Config)
        .then(response => {
            let data = response.data;
            return data;
        })
        .catch(error => {
            console.log("HERE AT API CALL ERROR");
            console.log("API CALL Error", error);
            return error;
        });
}
