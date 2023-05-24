import { useRoute, useNavigation } from "@react-navigation/native";
import { Highlight } from "@components/Highlight";
import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { Header } from "@components/Header";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Alert, FlatList, TextInput, Keyboard } from "react-native";
import { useState, useEffect, useRef } from "react";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from "./playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type routeParams = {
  group: string
}

export function Players() {

  const [isLoading, setIsLoading] = useState(true)

  const [newPlayerName, setnewPlayerName] = useState('')
  const [team, setTeam] = useState('Team 1')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const newPlayerNameInputRef = useRef<TextInput>(null)

  const navigation = useNavigation()
  const route = useRoute()

  const { group } = route.params as routeParams

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert("New Player", "Please enter the player's name to add.")
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {

      await playerAddByGroup(newPlayer, group)
      newPlayerNameInputRef.current?.blur()

      setnewPlayerName('')
      Keyboard.dismiss()
      fetchPlayersByTeam()

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('New Player', error.message)

      } else {
        console.log(error)
        Alert.alert('New Player', 'It is not possible to add a new player!')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true)

      const playersByTeam = await playerGetByGroupAndTeam(group, team)
      setPlayers(playersByTeam)

    } catch (error) {
      console.log(error)
      Alert.alert('Players', "It is not possible to load the players by selected team!")
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)

      fetchPlayersByTeam()
    } catch (error) {
      console.log(error)
      Alert.alert('Remove player', 'It is not possible to remove the player!')
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group)
      navigation.navigate('groups')
    } catch (error) {
      Alert.alert('Remove Group', 'It is not possible to remove the group!')
    }
  }

  async function handleGroupRemove() {
    try {
      Alert.alert(
        'Remove Group',
        `Would you really like to remove the group named ${group}?`,
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => groupRemove() }
        ]
      )

    } catch (error) {
      Alert.alert('Remove player', 'It is not possible to remove the player!')
    }
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="Add players and divide the teams" />

      <Form>
        <Input
          placeholder="Person name"
          value={newPlayerName}
          autoCorrect={false}
          onChangeText={setnewPlayerName}
          inputRef={newPlayerNameInputRef}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>

      <HeaderList>
        <FlatList
          data={['Team 1', 'Team 2']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            < Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>

      {
        isLoading ? <Loading /> :
          <FlatList
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard
                name={item.name}
                onRemove={() => handlePlayerRemove(item.name)} />
            )}
            ListEmptyComponent={() => (
              <ListEmpty message={`This team is empty, how about registering the first player in ${team} ?`}></ListEmpty>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              { paddingBottom: 100 },
              players.length === 0 && { flex: 1 }
            ]}
          />
      }

      <Button
        title="Remove Group"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />

    </Container >
  )
}