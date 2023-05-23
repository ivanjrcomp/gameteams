import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

export function NewGroup() {

  const navigation = useNavigation()

  function handleNew() {
    navigation.navigate('players', { group: 'team name' })
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
        />

        <Button title="Create"
          style={{ marginTop: 20 }}
          onPress={handleNew}
        />

      </Content>
    </Container>
  )
}