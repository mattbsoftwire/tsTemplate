import * as request from 'request-promise';
import * as moment from 'moment';
import {Moment} from "moment";
import {Location} from "./PostcodesAPI";

export interface Arrival{
    expectedArrival: Moment,
    lineName: string,
    destinationName: string
}

export interface StopArrivals {
    stopName: string,
    arrivals: Arrival[]
}

export interface Stop {
    distance : number,
    naptanId : string,
    commonName : string
}

export class TfLAPI {
    private static API_KEY = "a63bf5d3e26aa7e1b10f7cdb37935682";
    private static APP_ID = "3f030bb3";
    private static credentials = {
        app_id: TfLAPI.APP_ID,
        app_key: TfLAPI.API_KEY
    };

    private static API_URL = "https://api.tfl.gov.uk";
    private static BUS_STOP_TYPE = "NaptanPublicBusCoachTram";

    public getNextArrivalsAtStop(stop: Stop): Promise<StopArrivals> {
        const nextArrivalsRequest = {
            url: `${TfLAPI.API_URL}/StopPoint/${stop.naptanId}/Arrivals`,
            qs: TfLAPI.credentials
        };

        return request.get(nextArrivalsRequest)
            .then(JSON.parse)
            .then(this.parseArrivals)
            .then((list) => list.sort((a,b) => a.expectedArrival.diff(b.expectedArrival)))
            .then(list => {return {
                stopName: stop.commonName,
                arrivals: list
            }});
    }


    public getNearestStopsToLocation = (location: Location, radius: number = 200): Promise<Stop[]> =>  {
        const nearestStopPointRequest = {
            url:`${TfLAPI.API_URL}/StopPoint`,
            qs: {
                stopTypes: TfLAPI.BUS_STOP_TYPE,
                lat: location.latitude,
                lon: location.longitude,
                radius: radius,
                ...TfLAPI.credentials
            },
            json: true
        };

        return request.get(nearestStopPointRequest)
            .then(this.parseStops);
    };

    private parseStops = (stops): Stop[] => {
        return stops.stopPoints
            .map((stop): Stop => {
                stop.distance = Number(stop.distance);
                return stop;
            })
    };

    private parseArrivals = (arrivals): Arrival[] => {
        return arrivals.map((arrival): Arrival => {
            arrival.expectedArrival = moment(arrival.expectedArrival);
            return arrival;
        })
    }
}