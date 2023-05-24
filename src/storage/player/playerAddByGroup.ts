import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { playersGetByGroup } from "./playersGetByGroup";
import App from "App";

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storagePlayers = await playersGetByGroup(group)

    const playerAlreadyExists = storagePlayers.filter((player => player.name === newPlayer.name))

    if (playerAlreadyExists.length > 0) {
      throw new AppError('This person is already part of a team. Please choose another one!')
    }

    const storage = JSON.stringify([...storagePlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)

  } catch (error) {
    throw (error)
  }
}