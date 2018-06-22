import * as request from 'request-promise';
import * as moment from 'moment';
import {Moment} from "moment";

export interface Arrival{
    expectedArrival: Moment,
    lineName: string,
    destinationName: string
}

export class TfLAPI {
    private static API_KEY = "a63bf5d3e26aa7e1b10f7cdb37935682";
    private static APP_ID = "3f030bb3";
    private static CREDENTIALS = `?app_id=${TfLAPI.APP_ID}&app_key=${TfLAPI.API_KEY}`;
    private static API_URL = "https://api.tfl.gov.uk";


    public getArrivalsAtStop(stopID: string): Promise<Arrival[]> {
        return request(`${TfLAPI.API_URL}/StopPoint/${stopID}/Arrivals${TfLAPI.CREDENTIALS}`)
            .then(JSON.parse)
            .then(list => list.map(arrival => {
                arrival.expectedArrival = moment(arrival.expectedArrival);
                return arrival as Arrival;
            }))
            .then((list) => list.sort((a,b) => a.expectedArrival.diff(b.expectedArrival)));
    }
}