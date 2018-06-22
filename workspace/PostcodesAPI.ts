import * as request from 'request-promise';

export interface Location{
    longitude: number,
    latitude: number
}

export class PostcodesAPI {
    private static API_URL = "http://api.postcodes.io";

    public getLongLatFromPostcode(postcode: string): Promise<Location> {
        return request(`${PostcodesAPI.API_URL}/postcodes/${postcode}`)
            .then(JSON.parse)
            .then(rawdata => {
                return {
                    longitude: Number(rawdata.longitude),
                    latitude: Number(rawdata.latitude)
                } as Location
            })
    }
}