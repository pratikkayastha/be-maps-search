import { getAutoCompleteDetails } from '../src'
import { AutoCompleteResult } from '../src/types'
import * as tomtomApi from '../src/tomtom-api'

jest.mock('../src/tomtom-api')

beforeEach(() => {
    jest.resetAllMocks()
})

describe('Autocomplete tests', () => {
    it('throws error if address is empty', async () => {
        const mockedGetFuzzySearchResult = jest.spyOn(tomtomApi, 'getFuzzySearchResult')
        mockedGetFuzzySearchResult.mockImplementation(async (address: string, countries?: string[], limit?: number) => {
            return Promise.resolve([])
        })

        await expect(getAutoCompleteDetails('')).rejects.toThrow(
            '"address" cannot be null or empty string!',
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledTimes(0)
        mockedGetFuzzySearchResult.mockClear()


        await expect(getAutoCompleteDetails('    ')).rejects.toThrow(
            '"address" cannot be null or empty string!',
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledTimes(0)
    })

    it('throws error if limit is invalid', async () => {
        const mockedGetFuzzySearchResult = jest.spyOn(tomtomApi, 'getFuzzySearchResult')
        mockedGetFuzzySearchResult.mockImplementation(async (address: string, countries?: string[], limit?: number) => {
            return Promise.resolve([])
        })

        await expect(getAutoCompleteDetails('test', -4)).rejects.toThrow(
            '"limit" must be greater than 0 and less than or equals to 50',
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledTimes(0)
        mockedGetFuzzySearchResult.mockClear()

        await expect(getAutoCompleteDetails('test', 0)).rejects.toThrow(
            '"limit" must be greater than 0 and less than or equals to 50',
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledTimes(0)
        mockedGetFuzzySearchResult.mockClear()


        await expect(getAutoCompleteDetails('test', 394)).rejects.toThrow(
            '"limit" must be greater than 0 and less than or equals to 50',
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledTimes(0)
    })

    it('return autocomplete results', async () => {
        const mockAutoCompleteResults: AutoCompleteResult[] = [
            {
                placeId: "test1",
                streetName: "Great Charlotte Street",
                municipality: "Liverpool",
                postalCode: "2000",
                countryCode: "AU",
                country: "Australia",
                freeformAddress: "Great Charlotte Street, Liverpool, 2000 NSW",
            },
            {
                placeId: "test2",
                streetName: "Queen Charlotte Street",
                streetNumber: "32-34",
                municipality: "Ashfield",
                postalCode: "2003",
                countryCode: "AU",
                country: "Australia",
                freeformAddress: "Queen Charlotte Street, Ashfield, 2003 NSW",
            }
        ];
    
        const mockedGetFuzzySearchResult = jest.spyOn(tomtomApi, 'getFuzzySearchResult')
        mockedGetFuzzySearchResult.mockImplementation(async (address: string, countries?: string[], limit?: number) => {
            return Promise.resolve(mockAutoCompleteResults)
        })

        const autocomplete: AutoCompleteResult[] = await getAutoCompleteDetails('test', 5)
        
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledWith(
            'test',
            ['AU'],
            5
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledTimes(1)
        expect(autocomplete).toStrictEqual(mockAutoCompleteResults)
    })

    it('handles errors correctly', async () => {
        const mockedGetFuzzySearchResult = jest.spyOn(tomtomApi, 'getFuzzySearchResult')
        mockedGetFuzzySearchResult.mockImplementation(async (address: string, countries?: string[], limit?: number) => {
            throw Error('mock Tomtom API error!')
        })

        await expect(getAutoCompleteDetails('test')).rejects.toThrow(
            'mock Tomtom API error!',
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledWith(
            'test',
            ['AU'],
            20
        )
        expect(mockedGetFuzzySearchResult).toHaveBeenCalledTimes(1)       
    })
})
