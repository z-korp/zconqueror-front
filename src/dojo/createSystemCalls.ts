import { Account, InvokeTransactionReceiptResponse } from 'starknet';
import { ClientComponents } from './createClientComponents';
import { SetupNetworkResult } from './setupNetwork';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Game, Player, Tile }: ClientComponents
) {
  //account: felt252, seed: felt252, name: felt252, player_count: u8
  const create = async (
    signer: Account,
    account: string,
    seed: number,
    name: string,
    playerCount: number
  ) => {
    try {
      const tx = await execute(signer, 'create', [
        account,
        seed,
        name,
        playerCount,
      ]);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;

      const events = receipt.events;

      if (events) {
        console.log('events', events);
        /*const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(
          eventsTransformed,
          add_hole,
          set_size,
          reset_holes,
          set_hit_mob,
          set_turn
        );*/
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  return {
    create,
  };
}
