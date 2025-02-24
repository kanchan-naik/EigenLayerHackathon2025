// Import required packages
import { request, gql } from 'graphql-request';
import 'dotenv/config'; // Load environment variables
import fs from 'fs';
import path from 'path';

// API Endpoint with Graph API Key
const UNISWAP_V3_SUBGRAPH_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

// file paths for pool IDs and liquidity data
const poolIdsFilePath = path.join(process.cwd(), 'poolIds.json');
const liquidityDataFilePath = path.join(process.cwd(), 'liquidityData.json');

// convert dates to UNIX timestamps
function toUnixTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

// load liquidity data from JSON file if it exists in the repo
function loadExistingLiquidityData() {
    try {
        if (fs.existsSync(liquidityDataFilePath)) {
            const data = fs.readFileSync(liquidityDataFilePath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading existing liquidity data:', error.message);
    }
    return [];
}

// Save liquidity data to JSON file
function saveLiquidityDataToFile(liquidityData) {
    try {
        fs.writeFileSync(liquidityDataFilePath, JSON.stringify(liquidityData, null, 2), 'utf-8');
        console.log(`Successfully saved ${liquidityData.length} liquidity entries to ${liquidityDataFilePath}`);
    } catch (error) {
        console.error('Error saving liquidity data to file:', error.message);
    }
}

// GraphQL query to fetch liquidity data for a specific pool
const query = gql`
    query GetLiquidityData($poolAddress: String!, $startTimestamp: Int!, $endTimestamp: Int!, $limit: Int!) {
      
      pool(id: $poolAddress) {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
        feeTier
        liquidity
        volumeUSD
        totalValueLockedUSD
      }

      mints(
        first: $limit,
        where: { timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp, pool: $poolAddress },
        orderBy: timestamp,
        orderDirection: asc
      ) {
        id
        sender
        amount0
        amount1
        amountUSD
        timestamp
      }
      
      burns(
        first: $limit,
        where: { timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp, pool: $poolAddress },
        orderBy: timestamp,
        orderDirection: asc
      ) {
        id
        owner
        amount0
        amount1
        amountUSD
        timestamp
      }
    }
`;

// Fetch liquidity data for a single pool
async function fetchLiquidityData(poolAddress, startDate, endDate, limit = 100) {
    try {
        const startTimestamp = toUnixTimestamp(startDate);
        const endTimestamp = toUnixTimestamp(endDate);

        console.log(`Fetching liquidity data for pool ${poolAddress} from ${startDate} to ${endDate}`);
        const variables = { poolAddress, startTimestamp, endTimestamp, limit };

        const data = await request(UNISWAP_V3_SUBGRAPH_URL, query, variables);
        return { poolAddress, ...data }; // data for that specific pool id
    } catch (error) {
        console.error(`Error fetching liquidity data for pool ${poolAddress}:`, error.message);
        if (error.response) {
            console.error('GraphQL Error Details:', JSON.stringify(error.response, null, 2));
        }
        return null;
    }
}

// wrapper to fetch liquidity data for all pool IDs from poolIds.json
async function fetchAllLiquidityData(startDate, endDate, limit = 50) {
    const existingLiquidityData = loadExistingLiquidityData();
    const existingPoolAddresses = new Set(existingLiquidityData.map(item => item.poolAddress));

    try {
        const poolIds = JSON.parse(fs.readFileSync(poolIdsFilePath, 'utf-8'));

        for (const poolAddress of poolIds) {
            if (!existingPoolAddresses.has(poolAddress)) {
                const liquidityData = await fetchLiquidityData(poolAddress, startDate, endDate, limit);
                if (liquidityData) {
                    existingLiquidityData.push(liquidityData);
                    saveLiquidityDataToFile(existingLiquidityData);
                }
            } else {
                console.log(`⚠️ Pool ${poolAddress} already exists in the liquidity data, skipping.`);
            }
        }

        console.log(`✨ Completed fetching liquidity data for all pools.`);
    } catch (error) {
        console.error('Error fetching liquidity data for all pools:', error.message);
    }
}

// Configure the date range and execute the function
const startDate = '2024-01-01';
const endDate = '2024-02-01';
fetchAllLiquidityData(startDate, endDate, 50);
