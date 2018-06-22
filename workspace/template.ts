import * as request from 'request-promise';
import * as moment from 'moment';
import {TfLAPI} from "./TfLAPI";

export class Template {
    public static STOP_ID = "490008660N"

    public run(): void {
        new TfLAPI().getArrivalsAtStop(Template.STOP_ID)
            .then(console.log);
    }
}

