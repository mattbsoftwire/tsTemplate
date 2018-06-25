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
            .then<Location>(rawdata => {
                return {
                    longitude: Number(rawdata.result.longitude),
                    latitude: Number(rawdata.result.latitude)
                }
            })
            .then(location => {
                if (Number.isNaN(location.longitude) || Number.isNaN(location.latitude)) {
                    throw new Error("Invalid coordinates from Postcode API.");
                }
                return location;
            });
    }

    public isValidPostcode(postcode: string): Promise<boolean> {
        //API doesn't handle empty string
        if(postcode === '') {
            return Promise.resolve(false);
        }

        return request(`${PostcodesAPI.API_URL}/postcodes/${postcode}/validate`)
            .then(JSON.parse)
            .then(response => response.result);
    }

    public isValidLondonPostcode(postcode: string): Promise<boolean> {
        return this.isValidPostcode(postcode)
            .then(valid => {
                if (valid) {
                    return PostcodesAPI.isLondonPostcode(postcode)
                }
                throw new Error("Invalid Postcode");
            });
    }

    private static isLondonPostcode(postcode: string) {
        return request(`${PostcodesAPI.API_URL}/postcodes/${postcode}`)
            .then(JSON.parse)
            .then(response => response.result.region == "London")
    }

}