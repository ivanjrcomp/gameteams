import { useState } from 'react';
import { FlatList } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from './styles';
//import * as S from './styles'
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation()

  function handleNewGroups() {
    navigation.navigate('new')
  }

  return (
    <Container>
      <Header />

      <Highlight
        title='Teams'
        subtitle='Play with your team' />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <GroupCard title={item} />
        )}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => (
          <ListEmpty message='The list is empty, how about registering the first team?'></ListEmpty>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Button
        title='Create new Team'
        onPress={handleNewGroups}
      />

    </Container>

  );
}

