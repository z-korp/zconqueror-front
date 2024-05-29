/* previously called generated.ts */

import { DojoProvider } from '@dojoengine/core';
import { AccountInterface, RevertedTransactionReceiptResponse, cairo, shortString } from 'starknet';

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
  const executeAndCheck = async (account: AccountInterface, contractName: string, methodName: string, args: any[]) => {
    const ret = await provider.execute(account, contractName, methodName, args, {
      maxFee: '5000000000000000', // 0.005 ETH
    });
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
    const create = async (account: AccountInterface, playerName: string, price: bigint, penalty: number) => {
      try {
        return await executeAndCheck(account, contractName, 'create', [
          provider.getWorldAddress(),
          shortString.encodeShortString(playerName),
          cairo.uint256(price).high.toString(),
          cairo.uint256(price).low.toString(),
          penalty.toString(),
        ]);
      } catch (error) {
        console.error('Error executing create:', error);
        throw error;
      }
    };

    const join = async (account: AccountInterface, gameId: number, playerName: string) => {
      try {
        return await executeAndCheck(account, contractName, 'join', [
          provider.getWorldAddress(),
          gameId.toString(),
          shortString.encodeShortString(playerName),
        ]);
      } catch (error) {
        console.error('Error executing join:', error);
        throw error;
      }
    };

    const leave = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'leave', [provider.getWorldAddress(), gameId.toString()]);
      } catch (error) {
        console.error('Error executing leave:', error);
        throw error;
      }
    };

    const start = async (account: AccountInterface, gameId: number, roundLimit: number) => {
      try {
        return await executeAndCheck(account, contractName, 'start', [
          provider.getWorldAddress(),
          gameId.toString(),
          roundLimit.toString(),
        ]);
      } catch (error) {
        console.error('Error executing start:', error);
        throw error;
      }
    };

    const kick = async (account: AccountInterface, gameId: number, playerIndex: number) => {
      try {
        return await executeAndCheck(account, contractName, 'kick', [
          provider.getWorldAddress(),
          gameId.toString(),
          playerIndex.toString(),
        ]);
      } catch (error) {
        console.error('Error executing kick:', error);
        throw error;
      }
    };

    const transfer = async (account: AccountInterface, gameId: number, playerIndex: number) => {
      try {
        return await executeAndCheck(account, contractName, 'transfer', [
          provider.getWorldAddress(),
          gameId.toString(),
          playerIndex.toString(),
        ]);
      } catch (error) {
        console.error('Error executing kick:', error);
        throw error;
      }
    };

    const delete_game = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'delete', [provider.getWorldAddress(), gameId.toString()]);
      } catch (error) {
        console.error('Error executing delete:', error);
        throw error;
      }
    };

    const claim = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'claim', [provider.getWorldAddress(), gameId.toString()]);
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
      account: AccountInterface,
      gameId: number,
      attackerIndex: number,
      defenderIndex: number,
      dispatched: number
    ) => {
      try {
        return await executeAndCheck(account, contractName, 'attack', [
          provider.getWorldAddress(),
          gameId.toString(),
          attackerIndex.toString(),
          defenderIndex.toString(),
          dispatched.toString(),
        ]);
      } catch (error) {
        console.error('Error executing attack:', error);
        throw error;
      }
    };

    const surrender = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'surrender', [
          provider.getWorldAddress(),
          gameId.toString(),
        ]);
      } catch (error) {
        console.error('Error executing surrender:', error);
        throw error;
      }
    };

    const banish = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'banish', [provider.getWorldAddress(), gameId.toString()]);
      } catch (error) {
        console.error('Error executing banish:', error);
        throw error;
      }
    };

    const defend = async (account: AccountInterface, gameId: number, attackerIndex: number, defenderIndex: number) => {
      try {
        return await executeAndCheck(account, contractName, 'defend', [
          provider.getWorldAddress(),
          gameId.toString(),
          attackerIndex.toString(),
          defenderIndex.toString(),
        ]);
      } catch (error) {
        console.error('Error executing defend:', error);
        throw error;
      }
    };

    const discard = async (
      account: AccountInterface,
      gameId: number,
      cardOne: number,
      cardTwo: number,
      cardThree: number
    ) => {
      try {
        return await executeAndCheck(account, contractName, 'discard', [
          provider.getWorldAddress(),
          gameId.toString(),
          cardOne.toString(),
          cardTwo.toString(),
          cardThree.toString(),
        ]);
      } catch (error) {
        console.error('Error executing discard:', error);
        throw error;
      }
    };

    const finish = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'finish', [provider.getWorldAddress(), gameId.toString()]);
      } catch (error) {
        console.error('Error executing finish:', error);
        throw error;
      }
    };

    const transfer = async (
      account: AccountInterface,
      gameId: number,
      sourceIndex: number,
      targetIndex: number,
      army: number
    ) => {
      try {
        return await executeAndCheck(account, contractName, 'transfer', [
          provider.getWorldAddress(),
          gameId.toString(),
          sourceIndex.toString(),
          targetIndex.toString(),
          army.toString(),
        ]);
      } catch (error) {
        console.error('Error executing transfer:', error);
        throw error;
      }
    };

    const supply = async (account: AccountInterface, gameId: number, tileIndex: number, supply: number) => {
      try {
        return await executeAndCheck(account, contractName, 'supply', [
          provider.getWorldAddress(),
          gameId.toString(),
          tileIndex.toString(),
          supply.toString(),
        ]);
      } catch (error) {
        console.error('Error executing supply:', error);
        throw error;
      }
    };

    // Cette fonction est le pendant front de celle appelé dans côté contrat in play.cairo
    const emote = async (account: AccountInterface, gameId: number, playerIndex: number, emote: number) => {
      try {
        return await executeAndCheck(account, contractName, 'emote', [
          provider.getWorldAddress(),
          gameId.toString(),
          playerIndex.toString(),
          emote.toString(),
        ]);
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
