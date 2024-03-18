import axios from 'axios'
import { AutoCompleteResult } from './types'

// https://developer.tomtom.com/search-api/documentation/search-service/fuzzy-search
export async function getFuzzySearchResult(
    address: string, 
    countries?: string[], 
    limit: number = 20): Promise<AutoCompleteResult[]> {

    try {
        const key: string = process.env.TOMTOM_API_KEY as string
        if (!key) {
            throw Error('API key for TomTom not found in environment variables!')
        }

        const autocomplete = await axios.get(`https://api.tomtom.com/search/2/search/${address}.json`, {
            params: {
                key,
                limit,
                ...((countries != null && countries.length > 0) && { countrySet: countries.join(',') })
            }
        })

        return autocomplete?.data?.results.map((result: any) => {
            return {
                placeId: result.id,
                streetName: result.address.streetName,
                municipality: result.address.municipality,
                postalCode: result.address.postalCode,
                freeformAddress: result.address.freeformAddress,
                country: result.address.country,
                countryCode: result.address.countryCode,
                streetNumber: result.address.streetNumber
            } as AutoCompleteResult
        })
    } catch (err: any) {
        console.error('Error occured while sending request to TomTom API: ', err.message)
        console.debug(err)
        throw err
    }
}
