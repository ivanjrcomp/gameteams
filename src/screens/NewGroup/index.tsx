import { useState } from "react";
import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";

export function NewGroup() {

  const [group, setGroup] = useState('')

  const navigation = useNavigation()

  async function handleNew() {
    try {

      if (group.trim().length === 0) {
        return Alert.alert('New Group', 'Choose a name for the Group!')
      }

      await groupCreate(group)
      navigation.navigate('players', { group })

    } catch (error) {
      if (error instanceof AppError)
        Alert.alert('New Group', error.message)
      else {
        console.log(error)
        Alert.alert('New Group', "It is not possible to form a new Group!")
      }

    }
  }

  return (
    <Container>
      <Header showBackButton></Header>

      <Content>
        <Icon />

        <Highlight
          title="New Team"
          subtitle="Create a team to add the participants"
        />

        <Input
          placeholder="Team Name"
          onChangeText={setGroup}
        />

        <Button title="Create"
          style={{ marginTop: 20 }}
          onPress={handleNew}
        />

      </Content>
    </Container>
  )
}