import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";

import { groupsGetAll } from "./groupsGetAll";

export async function groupRemoveByName(group2Delete: string) {
  try {

    const storageGroups = await groupsGetAll()
    const groups = storageGroups.filter((group) => group !== group2Delete)

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups))

    await AsyncStorage.removeItem(PLAYER_COLLECTION)

  } catch (error) {
    throw error
  }
}