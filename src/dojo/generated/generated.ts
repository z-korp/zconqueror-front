import { Account } from 'starknet';
import { DojoProvider } from '@dojoengine/core';

export async function setupWorld(provider: DojoProvider) {
  function host() {
    const contractName = 'host';
    const create = async (account: Account, name: string, playerCount: number) => {
      try {
        return await provider.execute(account, contractName, 'create', [provider.getWorldAddress(), playerCount, name]);
      } catch (error) {
        console.error('Error executing create:', error);
        throw error;
      }
    };

    const join = async (account: Account, gameId: number, playerName: string) => {
      try {
        return await provider.execute(account, contractName, 'join', [provider.getWorldAddress(), gameId, playerName]);
      } catch (error) {
        console.error('Error executing join:', error);
        throw error;
      }
    };

    const start = async (account: Account, gameId: number) => {
      try {
        return await provider.execute(account, contractName, 'start', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing start:', error);
        throw error;
      }
    };

    return {
      create,
      join,
      start,
    };
  }

  function play() {
    const contractName = 'play';

    const attack = async (
      account: Account,
      gameId: number,
      attackerIndex: number,
      defenderIndex: number,
      dispatched: number
    ) => {
      try {
        return await provider.execute(account, contractName, 'attack', [
          provider.getWorldAddress(),
          gameId,
          attackerIndex,
          defenderIndex,
          dispatched,
        ]);
      } catch (error) {
        console.error('Error executing attack:', error);
        throw error;
      }
    };

    const defend = async (account: Account, gameId: number, attackerIndex: number, defenderIndex: number) => {
      try {
        return await provider.execute(account, contractName, 'defend', [
          provider.getWorldAddress(),
          gameId,
          attackerIndex,
          defenderIndex,
        ]);
      } catch (error) {
        console.error('Error executing defend:', error);
        throw error;
      }
    };

    const discard = async (account: Account, gameId: number, cardOne: number, cardTwo: number, cardThree: number) => {
      try {
        return await provider.execute(account, contractName, 'discard', [
          provider.getWorldAddress(),
          gameId,
          cardOne,
          cardTwo,
          cardThree,
        ]);
      } catch (error) {
        console.error('Error executing discard:', error);
        throw error;
      }
    };

    const finish = async (account: Account, gameId: number) => {
      try {
        return await provider.execute(account, contractName, 'finish', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing finish:', error);
        throw error;
      }
    };

    const transfer = async (
      account: Account,
      gameId: number,
      sourceIndex: number,
      targetIndex: number,
      army: number
    ) => {
      try {
        return await provider.execute(account, contractName, 'transfer', [
          provider.getWorldAddress(),
          gameId,
          sourceIndex,
          targetIndex,
          army,
        ]);
      } catch (error) {
        console.error('Error executing transfer:', error);
        throw error;
      }
    };

    const supply = async (account: Account, gameId: number, tileIndex: number, supply: number) => {
      try {
        return await provider.execute(account, contractName, 'supply', [
          provider.getWorldAddress(),
          gameId,
          tileIndex,
          supply,
        ]);
      } catch (error) {
        console.error('Error executing supply:', error);
        throw error;
      }
    };

    return {
      attack,
      defend,
      discard,
      finish,
      transfer,
      supply,
    };
  }
  return {
    play: play(),
    host: host(),
  };
}
