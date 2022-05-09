import fs from 'fs';
import { Router, Request, Response } from 'express';

interface RequestBody {
	networkAddress: string;
	countryIsoCodes: string[];
}

interface Network {
	networkAddress: string;
	countryIsoCode: string;
}

// Create the Express Router
const router = Router();

// Read all the networks into memory to help simulate reading from a database
const allNetworks: Network[] = JSON.parse(
	fs.readFileSync('./data/networks.json').toString()
);

/**
 * API route handler
 *
 * Provided address empty or not a string: HTTP 400
 * Network could not be found: HTTP 404
 * Network found but not with the included country codes: HTTP 404
 * Network found with a matching country code: HTTP 200
 */
router.route('/verify').post((req: Request, res: Response) => {
	const { networkAddress, countryIsoCodes }: RequestBody = req.body;

	// Invalid input
	if (typeof networkAddress !== 'string' || networkAddress.length === 0) {
		return res.status(400).send({
			status: false,
			message: 'Network address invalid input',
		});
	}

	// Attempt to find the Network from the provided networkAddress
	const network = allNetworks.find(
		(n: Network) => n.networkAddress === networkAddress
	);

	// Network not found
	if (!network) {
		return res.status(404).send({
			status: false,
			message: `Network address "${networkAddress}" not found in the database`,
		});
	}

	// Network found, country code doesn't match
	if (!countryIsoCodes.includes(network.countryIsoCode)) {
		return res.status(404).send({
			status: false,
			message: `Network address "${networkAddress}" not found for these country codes`,
		});
	}

	// Network found, country code matches
	res.status(200).send({
		status: true,
		message: `Network address "${networkAddress}" found with country ISO code ${network.countryIsoCode}`,
	});
});

export default router;
