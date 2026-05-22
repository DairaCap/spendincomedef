import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { supabase } from './utils/supabase';

type Todo = {
  id: number;
  name: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const { data: todosData, error } = await supabase.from('todos').select();

        if (error) {
          console.error('Error fetching todos:', error.message);
          return;
        }

        if (todosData && todosData.length > 0) {
          setTodos(todosData as Todo[]);
        }
      } catch (error: unknown) {
        console.error(
          'Error fetching todos:',
          error instanceof Error ? error.message : String(error)
        );
      }
    };

    getTodos();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Todo List</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text key={item.id}>{item.name}</Text>}
      />
    </View>
  );
}
