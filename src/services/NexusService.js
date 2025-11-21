// NexusService.js
const GRAPHQL_ENDPOINT = 'https://api.nexusmods.com/v2/graphql';

const HEADERS = (apiKey) => ({
    'Content-Type': 'application/json',
    'apikey': apiKey,
    // 'Authorization': `Bearer ${apiKey}` // Try this if apikey fails, but apikey is standard for Nexus
});

export const NexusService = {
    validateKey: async (apiKey) => {
        try {
            // Simple query to check validity (e.g. current user or just a game list)
            const query = `
        query {
          games(count: 1) {
            nodes {
              id
            }
          }
        }
      `;
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: HEADERS(apiKey),
                body: JSON.stringify({ query })
            });
            const data = await response.json();
            return !data.errors;
        } catch (e) {
            console.error("API Key Validation Failed", e);
            return false;
        }
    },

    fetchGames: async (apiKey) => {
        const query = `
      query {
        games(count: 50, sort: [{ field: downloads, direction: DESC }]) {
          nodes {
            id
            name
            domainName
            nexusId
          }
        }
      }
    `;
        try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: HEADERS(apiKey),
                body: JSON.stringify({ query })
            });
            const result = await response.json();
            return result.data?.games?.nodes || [];
        } catch (e) {
            console.error("Failed to fetch games", e);
            return [];
        }
    },

    fetchMods: async (apiKey, gameId, batchSize = 50) => {
        // We use a random offset to simulate randomization if random sort isn't available
        // For now, let's just fetch recent or popular and shuffle client side
        // Or better, fetch from 'updated' to get active mods
        const query = `
      query Mods($gameId: Int!, $count: Int!) {
        mods(
          filter: { gameId: [{ value: $gameId, op: EQUALS }] },
          sort: [{ field: endorsements, direction: DESC }], 
          count: $count
        ) {
          nodes {
            id
            modId
            name
            summary
            description
            pictureUrl
            author
            version
            createdAt
            updatedAt
            endorsements
            uploader {
              name
              avatar
            }
          }
        }
      }
    `;

        try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: HEADERS(apiKey),
                body: JSON.stringify({
                    query,
                    variables: { gameId: parseInt(gameId), count: batchSize }
                })
            });
            const result = await response.json();
            const mods = result.data?.mods?.nodes || [];

            // Shuffle mods
            return mods.sort(() => Math.random() - 0.5);
        } catch (e) {
            console.error("Failed to fetch mods", e);
            return [];
        }
    },

    fetchModDetails: async (apiKey, modId) => {
        // If we need more details than the list provides
        const query = `
      query Mod($modId: ID!) {
        mod(id: $modId) {
          id
          description
          modRequirements {
            nodes {
              name
            }
          }
        }
      }
    `;
        // Implementation skipped for now as list provides enough for MVP
        return null;
    }
};
