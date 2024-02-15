import { Event } from '@/utils/events';
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(import.meta.env.VITE_PUBLIC_TORII + '/graphql');

type getEventsQuery = {
  events: {
    edges: [
      {
        node: {
          id: string;
          keys: string[];
          data: string[];
          createdAt: string;
        };
      }
    ];
  };
};

// Function to fetch events once
export const fetchEventsOnce = async (keys: string[], processResults: (event: Event) => void) => {
  const formattedKeys = keys.map((key) => `"${key}"`).join(',');

  const query = `
  query events {
    events(keys: [${formattedKeys}]) {
      edges {
        node {
          id
          keys
          data
          createdAt
        }
      }
    }
  }`;

  const { events }: getEventsQuery = await client.request(query);

  // Process each event
  events.edges.forEach((edge) => {
    processResults(edge.node);
  });
};
