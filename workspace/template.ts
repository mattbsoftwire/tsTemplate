import {TfLAPI} from "./TfLAPI";
import {PostcodesAPI} from "./PostcodesAPI";

export class Template {
    public static STOP_ID = "490008660N"
    public static POSTCODE = "NW5 1TL";

    public run(): void {
        const tflAPI = new TfLAPI();
        const postcodesAPI = new PostcodesAPI();

        postcodesAPI.getLongLatFromPostcode(Template.POSTCODE)
             .then(tflAPI.getNearestStopIDsToLocation)
             .then(list => Promise.all(
                 list.slice(0,2)
                     .map(stop => tflAPI.getNextArrivalsAtStop(stop.naptanId))
                 )
             )
            .then(console.log);
    }
}

