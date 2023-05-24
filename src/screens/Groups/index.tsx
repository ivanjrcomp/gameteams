import { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from './styles';
//import * as S from './styles'
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

export function Groups() {
  const [isLoading, setIsLoading] = useState(true)

  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation()

  function handleNewGroups() {
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try {
      setIsLoading(true)

      const data = await groupsGetAll()
      setGroups(data)

    } catch (error) {
      console.log(error)
      Alert.alert('Groups', 'It is not possible to load groups!')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group })
  }

  useFocusEffect(useCallback(() => {
    fetchGroups()
  }, []))

  return (
    <Container>
      <Header />

      <Highlight
        title='Groups'
        subtitle='Play with your group' />

      {
        isLoading ? <Loading /> :
          <FlatList
            data={groups}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <GroupCard
                title={item}
                onPress={() => handleOpenGroup(item)}
              />
            )}
            contentContainerStyle={groups.length === 0 && { flex: 1 }}
            ListEmptyComponent={() => (
              <ListEmpty message='The list is empty, how about registering the first group?'></ListEmpty>
            )}
            showsVerticalScrollIndicator={false}
          />
      }

      <Button
        title='Create New Group'
        onPress={handleNewGroups}
      />

    </Container>

  );
}

