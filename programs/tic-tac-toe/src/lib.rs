// NOTE https://book.anchor-lang.com/anchor_in_depth/milestone_project_tic-tac-toe.html
use anchor_lang::prelude::*;
use instructions::*;
use state::game::Tile;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("H977Pr3fnrGuyfrgtbWkBVsQmR6jXbeiceDfBPKhRgBx");

#[program]
pub mod tic_tac_toe {
    use super::*;
    
    pub fn setup_game(ctx: Context<SetupGame>, player_two: Pubkey) -> Result<()> {
        instructions::setup_game::setup_game(ctx, player_two)
    }

    pub fn play(ctx: Context<Play>, tile: Tile) -> Result<()> {
        instructions::play::play(ctx, tile)
    }
}
