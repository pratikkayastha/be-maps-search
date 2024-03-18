
# Autocomplete search

Small implementation of autocomplete search for places/location. It calls Tomtom fuzzy search API to obtain autocomplete results.

  

## Requirements

  

- Node

- yarn

  

## Installation

  

Please run the following after cloning the git repo.

  

    yarn install

  

To run tests with coverage please run the following

  

    yarn test

  

## How to use

To use this library, you can simply import the `getAutoCompleteDetails` function from `index.ts` and call it by providing a search query and limit (limit is optional), limit is defaulted to 20 if not provided.

  

Example

  

    const results: AutoCompleteResult[] = await getAutoCompleteDetails('kent', 5)

  

or

  

    const results: AutoCompleteResult[] = await getAutoCompleteDetails('kent')

  

## Changes

I've made the following updates to the project.

  

*  `AutoCompleteResult` type added to represent the response object.

* Renamed files and methods to reflect their actual use and purpose.

* Refactored `tomtom-api.ts` so that its specific to TomTom API only, everything related to TomTom API (like API keys and response mapping) is limited to this file. This makes it very easy to debug, test and makes it far easy to replace the API provider/version (if necessary).

* Added test `tomtom-api.test.ts` specific to `tomtom-api.ts`.

* Refactored the test in `test` folder to mock `tomtom-api.ts`.

* Coverage added to tests.

* Validations added for `address` and `limit` params.

*  `countrySet` param set to `AU` for call to Tomtom API so that it returns results only within Australia.

  

## Further improvements

  

* Adding linter and prettier

Linter can help catch code smells and potential issues with the code while prettier makes sure that everyone in the team is using the same code formatting conventions. These can be run before commit using pre-commit hooks using library like Husky. This will reduce sub-optimal code being pushed to the repo.

  

* Error handling and re-tries

The catch secion in `tomtom-api.ts` can be extended to check for HTTP response code from Tomtom API and implement a re-try mechanism on error codes like 500. Futher logging can also be added to simplify debugging.