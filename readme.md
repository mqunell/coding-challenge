#### Coding challenge: API that verifies whether a provided IP address is located in any of the provided country codes

Part 1: Parsing, formatting, and exporting the country blocks and locations to simulate a database

- `/lib/formatData.ts` reads the CSV files in `/data` and generates `/data/networks.json` (network address and country code pairs)

Part 2: Writing an API endpoint that accepts a network address and list of country codes, then verifies whether the IP address is in any of those countries

- `index.ts` configures and starts the Express server
- `/api/verify.ts` reads `/data/networks.json` into memory and then handles API requests by responding with various codes and messages based on results

#### Running and using the project

Project setup:

1. Download or clone the repository
2. Run `npm install` in the root directory to install the dependencies

Running the code:

1. Run `ts-node lib/formatData.ts` to generate `/data/networks.json` (only needs to be done once)
2. Run `ts-node index.ts` to run the Express server in Node

Using the API:

- Runs at `<host>/api/verify`
- Requests to the API should be sent via HTTP POST with a JSON body including the `networkAddress` and a list of `countryIsoCodes` to check, ex:
  `{ "networkAddress": "1.0.0.0/24", "countryIsoCodes": ["US", "CA", "MX"] }`
- Requests will return a status (true/false) and a message based on the results

#### Other notes

Since `/data/networks.json` is meant to simulate a database where the network address is unique, keeping it up to date is relatively straightforward. Creating new entries and updating an address's country code could both be done through upserting, and finding and deleting would both be done based on the network address.
