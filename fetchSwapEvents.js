// Import required packages
import { request, gql } from 'graphql-request';
import 'dotenv/config'; // Correct ES module import for dotenv

console.log(`https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`);

// Corrected API URL with proper template literal syntax
const UNISWAP_V3_SUBGRAPH_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

// GraphQL query to fetch recent swap events
const query = gql`
    query GetSwapEvents($first: Int!) {
        swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
            id
            sender
            recipient
            amount0
            amount1
            sqrtPriceX96
            tick
            timestamp
        }
    }
`;

// Function to fetch swap events
async function fetchSwapEvents(limit = 5) {
    try {
        const variables = { first: limit };
        const data = await request(UNISWAP_V3_SUBGRAPH_URL, query, variables);
        console.log("Swap Events:", data.swaps);
        return data.swaps;
    } catch (error) {
        console.error("Error fetching swap events:", error.message);
    }
}

// Test the API connection
fetchSwapEvents(10);



