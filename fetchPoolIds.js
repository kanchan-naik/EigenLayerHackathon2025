import { request, gql } from 'graphql-request';
import 'dotenv/config'; // Correct ES module import for dotenv
import fs from 'fs'; // File system module to handle JSON file operations
import path from 'path';

// API Endpoint with Graph API Key
const endpoint = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

// Define the file path to store pool IDs
const outputFilePath = path.join(process.cwd(), 'poolIds.json');

// GraphQL query to fetch only pool IDs
const query = gql`
    query GetAllPools($limit: Int!, $skip: Int!) {
        pools(first: $limit, skip: $skip) {
            id
        }
    }
`;

// Function to load existing pool IDs from the JSON file
function loadExistingPoolIds() {
    try {
        if (fs.existsSync(outputFilePath)) {
            const data = fs.readFileSync(outputFilePath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading existing pool IDs:', error.message);
    }
    return [];
}

// Function to save pool IDs to the JSON file
function savePoolIdsToFile(poolIds) {
    try {
        fs.writeFileSync(outputFilePath, JSON.stringify(poolIds, null, 2), 'utf-8');
        console.log(`✅ Successfully saved ${poolIds.length} pool IDs to ${outputFilePath}`);
    } catch (error) {
        console.error('Error saving pool IDs to file:', error.message);
    }
}

// Function to fetch all pool IDs with pagination and append to the JSON file
async function fetchAllPoolIds(limit = 1000) {
    let allPoolIds = new Set(loadExistingPoolIds()); // Use Set to avoid duplicates
    let skip = 0;
    let hasMore = true;

    try {
        while (hasMore) {
            // console.log(`📡 Fetching pool IDs... Skip: ${skip}, Limit: ${limit}`);
            const variables = { limit, skip };
            
            const data = await request(endpoint, query, variables);
            const pools = data.pools.map(pool => pool.id);

            if (pools.length > 0) {
                pools.forEach(id => allPoolIds.add(id)); // Automatically handles duplicates
                skip += limit;
            } else {
                hasMore = false;
            }
        }

        console.log(`Fetched ${allPoolIds.size} unique pool IDs.`);
        
        // Save updated pool IDs to JSON file
        savePoolIdsToFile(Array.from(allPoolIds));
        return allPoolIds;
    } catch (error) {
        console.error('Error fetching pool data:', error.message);
        if (error.response) {
            console.error('GraphQL Error Details:', JSON.stringify(error.response, null, 2));
        }
    }
}

// Execute the function to fetch and save all pool IDs
fetchAllPoolIds(1000);

