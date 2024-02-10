import { DojoProvider } from '@dojoengine/core';
import { Account, RevertedTransactionReceiptResponse } from 'starknet';

const tryBetterErrorMsg = (msg: string): string => {
  const failureReasonIndex = msg.indexOf('Failure reason');
  if (failureReasonIndex > 0) {
    let betterMsg = msg.substring(failureReasonIndex);
    const cairoTracebackIndex = betterMsg.indexOf('Cairo traceback');
    betterMsg = betterMsg.substring(0, cairoTracebackIndex);
    return betterMsg;
  }

  return msg;
};

export async function setupWorld(provider: DojoProvider) {
  // Transaction execution and checking wrapper
  const executeAndCheck = async (account: Account, contractName: string, methodName: string, args: any[]) => {

    console.log(account)

    const ret = await provider.execute(account, contractName, methodName, args);
    const receipt = await account.waitForTransaction(ret.transaction_hash, {
      retryInterval: 100,
    });

    // Add any additional checks or logic here based on the receipt
    if (receipt.status === 'REJECTED') {
      console.log('Transaction Rejected');
    }

    if ('execution_status' in receipt) {
      // The receipt is of a type that includes execution_status
      if (receipt.execution_status === 'REVERTED') {
        const errorMessage = tryBetterErrorMsg(
          (receipt as RevertedTransactionReceiptResponse).revert_reason || 'Transaction Reverted'
        );
        console.log('ERROR KATANA', errorMessage);
      }
    }

    return receipt;
  };

  function host() {
    const contractName = 'zconqueror::systems::host::host';
    const create = async (account: Account) => {
      try {
        return await executeAndCheck(account, contractName, 'create', [provider.getWorldAddress()]);
      } catch (error) {
        console.error('Error executing create:', error);
        throw error;
      }
    };

    const set_max_players = async (account: Account, gameId: Number, playerCount: Number) => {
      try {
        return await executeAndCheck(account, contractName, 'set_max_players', [provider.getWorldAddress(), gameId, playerCount]);
      } catch (error) {
        console.error('Error executing create:', error);
        throw error;
      }
    };

    const join = async (account: Account, gameId: Number) => {
      try {
        return await executeAndCheck(account, contractName, 'join', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing join:', error);
        throw error;
      }
    };

    const start = async (account: Account, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'start', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing start:', error);
        throw error;
      }
    };

    return {
      create,
      set_max_players,
      join,
      start,
    };
  }

  function play() {
    const contractName = 'zconqueror::systems::play::play';

    const attack = async (
      account: Account,
      gameId: number,
      attackerIndex: number,
      defenderIndex: number,
      dispatched: number
    ) => {
      try {
        return await executeAndCheck(account, contractName, 'attack', [
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
        return await executeAndCheck(account, contractName, 'defend', [
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
        return await executeAndCheck(account, contractName, 'discard', [
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
        return await executeAndCheck(account, contractName, 'finish', [provider.getWorldAddress(), gameId]);
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
        return await executeAndCheck(account, contractName, 'transfer', [
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
        return await executeAndCheck(account, contractName, 'supply', [
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
