/* previously called generated.ts */

import { DojoProvider } from '@dojoengine/core';
import { Account, RevertedTransactionReceiptResponse, cairo } from 'starknet';

const tryBetterErrorMsg = (msg: string): string => {
  const failureReasonIndex = msg.indexOf('Failure reason');
  if (failureReasonIndex > 0) {
    let betterMsg = msg.substring(failureReasonIndex);
    const cairoTracebackIndex = betterMsg.indexOf('Cairo traceback');
    betterMsg = betterMsg.substring(0, cairoTracebackIndex);

    const regex = /Failure reason:.*?\('([^']+)'\)/;
    const matches = betterMsg.match(regex);

    if (matches && matches.length > 1) {
      return matches[1];
    } else {
      return betterMsg;
    }
  }

  return msg;
};

export async function setupWorld(provider: DojoProvider) {
  // Transaction execution and checking wrapper
  const executeAndCheck = async (account: Account, contractName: string, methodName: string, args: any[]) => {
    const ret = await provider.execute(account, contractName, methodName, args);
    const receipt = await account.waitForTransaction(ret.transaction_hash, {
      retryInterval: 100,
    });

    // Add any additional checks or logic here based on the receipt
    if (receipt.status === 'REJECTED') {
      console.log('Transaction Rejected');
      throw new Error('[Tx REJECTED] ');
    }

    if ('execution_status' in receipt) {
      // The receipt is of a type that includes execution_status
      if (receipt.execution_status === 'REVERTED') {
        const errorMessage = tryBetterErrorMsg(
          (receipt as RevertedTransactionReceiptResponse).revert_reason || 'Transaction Reverted'
        );
        console.log('ERROR KATANA', errorMessage);
        throw new Error('[Tx REVERTED] ' + errorMessage);
      }
    }

    return receipt;
  };

  function host() {
    const contractName = 'zconqueror::systems::host::host';
    const create = async (account: Account, playerName: string, price: bigint, penalty: number) => {
      try {
        return await executeAndCheck(account, contractName, 'create', [
          provider.getWorldAddress(),
          playerName,
          cairo.uint256(price),
          penalty,
        ]);
      } catch (error) {
        console.error('Error executing create:', error);
        throw error;
      }
    };

    const join = async (account: Account, gameId: number, playerName: string) => {
      try {
        return await executeAndCheck(account, contractName, 'join', [provider.getWorldAddress(), gameId, playerName]);
      } catch (error) {
        console.error('Error executing join:', error);
        throw error;
      }
    };

    const leave = async (account: Account, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'leave', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing leave:', error);
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

    const kick = async (account: Account, gameId: number, playerIndex: number) => {
      try {
        return await executeAndCheck(account, contractName, 'kick', [provider.getWorldAddress(), gameId, playerIndex]);
      } catch (error) {
        console.error('Error executing kick:', error);
        throw error;
      }
    };

    const transfer = async (account: Account, gameId: number, playerIndex: number) => {
      try {
        return await executeAndCheck(account, contractName, 'transfer', [
          provider.getWorldAddress(),
          gameId,
          playerIndex,
        ]);
      } catch (error) {
        console.error('Error executing kick:', error);
        throw error;
      }
    };

    const delete_game = async (account: Account, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'delete', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing delete:', error);
        throw error;
      }
    };

    const claim = async (account: Account, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'claim', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing claim:', error);
        throw error;
      }
    };

    return {
      create,
      join,
      leave,
      start,
      claim,
      kick,
      transfer,
      delete_game,
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

    const surrender = async (account: Account, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'surrender', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing surrender:', error);
        throw error;
      }
    };

    const banish = async (account: Account, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'banish', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing banish:', error);
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

    const emote = async (account: Account, gameId: number, emote: string) => {
      try {
        return await executeAndCheck(account, contractName, 'emote', [provider.getWorldAddress(), gameId, emote]);
      } catch (error) {
        console.error('Error executing emote:', error);
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
      emote,
      surrender,
      banish,
    };
  }
  return {
    play: play(),
    host: host(),
  };
}
