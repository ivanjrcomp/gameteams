import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { AppError } from "@utils/AppError";

export async function playerGetByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await playersGetByGroup(group)

    const players = storage.filter(player => player.team === team)

    return players
  } catch (error) {
    throw error;
  }
}