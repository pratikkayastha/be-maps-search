import { getFuzzySearchResult } from './tomtom-api'
import { AutoCompleteResult } from './types'

export async function getAutoCompleteDetails(address: string, limit: number = 20): Promise<AutoCompleteResult[]> {
    if (!address || address.trim() === '') {
        throw Error('"address" cannot be null or empty string!')
    }

    if (limit <= 0 || limit > 50) {
        throw Error('"limit" must be greater than 0 and less than or equals to 50')
    }

    // get autocomplete results
    const autoCompleteResults: AutoCompleteResult[] = await getFuzzySearchResult(address, ['AU'], limit)
    return autoCompleteResults
}