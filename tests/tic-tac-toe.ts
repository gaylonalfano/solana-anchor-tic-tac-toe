import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { expect } from "chai";
import { TicTacToe } from "../target/types/tic_tac_toe";

describe("tic-tac-toe", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

  it("setup game!", async () => {
    // 1. Generate some keypairs
    const gameKeypair = anchor.web3.Keypair.generate();
    // NOTE playerOne is NOT a Keypair, but the wallet of program's provider
    // and the Provider serves as the keypair that pays for and signs
    // all transactions
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();

    // 2. Next, send the transaction
    // Q: Some of the args for setupGame() seem to be not needed.
    // E.g., signers doesn't include playerOne, though we specify it
    // in our program
    // A: We don't add playerOne because it is the program provider,
    // which signs the transaction by default!
    // A: We also don't specify system_program acount (in accounts {}),
    // because Anchor recognizes this account and is able to infer it
    // NOTE This is true for other known accounts (token_program, rent sysvar account, etc)
    await program.methods
      .setupGame(playerTwo.publicKey) // instruction arguments
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      }) // accounts
      .signers([gameKeypair])
      // We have to add gameKeypair for signers bc whenever an account gets
      // created, it has to sign its creation transaction
      .rpc();

    // 3. After the transaction returns, we can fetch the state of the game account
    let gameState = await program.account.game.fetch(gameKeypair.publicKey);

    // 4. Verify the game has set up correctly
    // https://book.anchor-lang.com/anchor_references/javascript_anchor_types_reference.html
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([
      playerOne.publicKey,
      playerTwo.publicKey,
    ]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
  });
});
