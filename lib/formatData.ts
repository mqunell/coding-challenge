import fs from 'fs';
import { parse } from 'csv-parse/sync';

/**
 * This script aggregates data from the GeoLite2 CSV files containing country blocks and locations.
 * It parses the files, formats the data as JSON, and writes a new JSON file of Network objects
 * (network addresses and country ISO codes) to simulate a database. The API can then read from a
 * single merged and formatted source.
 */

type CsvRecord = string[];
type GeonameId = string;
type NetworkAddress = string;
type CountryIsoCode = string;

interface Location {
	geonameId: GeonameId;
	countryIsoCode: CountryIsoCode;
}

interface Block {
	geonameId: GeonameId;
	networkAddress: NetworkAddress;
}

interface Network {
	networkAddress: NetworkAddress;
	countryIsoCode: CountryIsoCode;
}

// Locations CSV column indexes
const LOCATION_COLS = {
	GEONAME_ID: 0,
	COUNTRY_ISO_CODE: 4,
};

// Blocks CSV column indexes
const BLOCK_COLS = {
	NETWORK: 0,
	GEONAME_ID: 1,
};

// Parse a CSV file as a string[][] of records, skipping the header row
function parseCsv(fileName: string): CsvRecord[] {
	const rawText = fs.readFileSync(`./data/${fileName}.csv`).toString();
	const records = parse(rawText);
	return records.slice(1);
}

// Format location CSV records as JSON
function formatLocations(records: CsvRecord[]): Location[] {
	return records.map((record: CsvRecord) => ({
		geonameId: record[LOCATION_COLS.GEONAME_ID],
		countryIsoCode: record[LOCATION_COLS.COUNTRY_ISO_CODE],
	}));
}

// Format block CSV records as JSON
function formatBlocks(records: CsvRecord[]): Block[] {
	return records.map((record: CsvRecord) => ({
		geonameId: record[BLOCK_COLS.GEONAME_ID],
		networkAddress: record[BLOCK_COLS.NETWORK],
	}));
}

// Write a JSON file of Network[] to simulate a database
function generateJsonFile() {
	// Get the JSON Location[] and Block[]
	const locations: Location[] = formatLocations(parseCsv('country-locations'));

	const blocks: Block[] = [
		...formatBlocks(parseCsv('country-blocks-ipv4')),
		...formatBlocks(parseCsv('country-blocks-ipv6')),
	];

	// Combine all the Locations and Blocks to make Networks
	const output: Network[] = blocks.map((block: Block) => {
		const { geonameId, networkAddress } = block;

		// Find the Location with this geonameId
		const location = locations.find(
			(loc: Location) => loc.geonameId === geonameId
		);

		return {
			networkAddress,
			countryIsoCode: location?.countryIsoCode as CountryIsoCode,
		};
	});

	// Write the JSON file
	fs.writeFileSync('./data/networks.json', JSON.stringify(output));
	console.log('networks.json generated');
}

generateJsonFile();
