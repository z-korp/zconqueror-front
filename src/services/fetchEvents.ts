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
          transactionHash: string;
        };
      }
    ];
  };
};

// Function to fetch events once
export const fetchEventsOnce = async (keys: string[], processResults: (event: Event) => Promise<void>) => {
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
          transactionHash
        }
      }
    }
  }`;

  const { events }: getEventsQuery = await client.request(query);

  // Process each event
  await Promise.all(events.edges.map((edge) => processResults(edge.node)));
};

export const fetchEventsTxHash = async (
  keys: string[],
  transactionHash: string,
  processResults: (event: Event) => void
) => {
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
          transactionHash
        }
      }
    }
  }`;

  const { events }: getEventsQuery = await client.request(query);

  // Process each event
  events.edges
    .filter((e) => e.node.transactionHash === transactionHash)
    .forEach((edge) => {
      processResults(edge.node);
    });
};
