// Import required packages
import { request, gql } from 'graphql-request';
import 'dotenv/config'; // Correct ES module import for dotenv

console.log(`https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`);

// Corrected API URL with proper template literal syntax
const UNISWAP_V3_SUBGRAPH_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

function toUnixTimestamp(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

// GraphQL query to fetch liquidity data over a specified date range
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

// Function to fetch liquidity data with configurable date range
async function fetchLiquidityData(poolAddress, startDate, endDate, limit = 100) {
    try {
        // Convert dates to UNIX timestamps
        const startTimestamp = toUnixTimestamp(startDate);
        const endTimestamp = toUnixTimestamp(endDate);

        console.log(`Fetching liquidity data from ${startDate} (${startTimestamp}) to ${endDate} (${endTimestamp})`);

        const variables = { poolAddress, startTimestamp, endTimestamp, limit };

        // Request data using GraphQL
        const data = await request(UNISWAP_V3_SUBGRAPH_URL, query, variables);
        
        console.log("Fetched Liquidity Data:", data);
        return data;
    } catch (error) {
        console.error('Error fetching liquidity data:', error.message);
        console.error('Full Error Details:', error.response);
    }
}

// Test the API connection with a configurable date range
const poolAddress = '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8'; // WETH/USDC 0.3% pool on Uniswap v3
const startDate = '2024-01-01';
const endDate = '2024-02-01';
fetchLiquidityData(poolAddress, startDate, endDate, 50);
