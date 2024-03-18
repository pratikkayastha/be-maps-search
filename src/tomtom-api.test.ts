import axios from 'axios'
import { getFuzzySearchResult } from './tomtom-api'
import { AutoCompleteResult } from './types'

const ORIGINAL_ENV = process.env
jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

beforeEach(() => {
    // Mock process.env before each test case
    process.env = {
        TOMTOM_API_KEY: 'mock-api-key'
    }
    jest.resetAllMocks()
})

afterEach(() => {
    // Resetting original env
    process.env = ORIGINAL_ENV
})

describe('Tomtom API tests', () => {

    it('throws error if API key is not set', async () => {
        process.env = {}

        await expect(getFuzzySearchResult('test')).rejects.toThrow(
            'API key for TomTom not found in environment variables!',
        )
    })

    it('handles no results', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { results: []} })
        const res = await getFuzzySearchResult('asfasffasfasafsafs')

        expect(mockedAxios.get).toHaveBeenCalledWith('https://api.tomtom.com/search/2/search/asfasffasfasafsafs.json', {
            params: {
                key: 'mock-api-key',
                limit: 20,
            }
        })

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)

        expect(res).toStrictEqual([])
    })

    it('handles error from TomTom API', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('mock error'))

        await expect(getFuzzySearchResult('test')).rejects.toThrow('mock error')
    })

    it('handles countries param', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { results: []} })
        const res = await getFuzzySearchResult('test', ['AU', 'NZ'])

        expect(mockedAxios.get).toHaveBeenCalledWith('https://api.tomtom.com/search/2/search/test.json', {
            params: {
                key: 'mock-api-key',
                limit: 20,
                countrySet: 'AU,NZ'
            }
        })

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)

        expect(res).toStrictEqual([])
    })

    it('handles empty array for countries param', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { results: []} })
        const res = await getFuzzySearchResult('test', [])

        expect(mockedAxios.get).toHaveBeenCalledWith('https://api.tomtom.com/search/2/search/test.json', {
            params: {
                key: 'mock-api-key',
                limit: 20,
            }
        })

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)

        expect(res).toStrictEqual([])
    })

    it('handles limit param', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { results: []} })
        const res = await getFuzzySearchResult('test', [], 10)

        expect(mockedAxios.get).toHaveBeenCalledWith('https://api.tomtom.com/search/2/search/test.json', {
            params: {
                key: 'mock-api-key',
                limit: 10,
            }
        })

        expect(mockedAxios.get).toHaveBeenCalledTimes(1)

        expect(res).toStrictEqual([])
    })

    it('handles multiple responses from API with different fields', async () => {
        mockedAxios.get.mockResolvedValueOnce({ 
            data: { 
                results: [
                    {
                        id: "test1",
                        address: {
                            streetName: "Great Charlotte Street",
                            municipality: "Liverpool",
                            postalCode: "2000",
                            countryCode: "AU",
                            country: "Australia",
                            freeformAddress: "Great Charlotte Street, Liverpool, 2000 NSW",
                        }
                    },
                    {
                        id: "test2",
                        address: {
                            streetName: "Queen Charlotte Street",
                            streetNumber: "32-34",
                            municipality: "Ashfield",
                            postalCode: "2003",
                            countryCode: "AU",
                            country: "Australia",
                            freeformAddress: "Queen Charlotte Street, Ashfield, 2003 NSW",
                        }
                    }
                ]
            }
        })

        const autocomplete: AutoCompleteResult[] = await getFuzzySearchResult('test', ['AU'], 10)
        expect(autocomplete).toEqual([
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
        ])
    })
})