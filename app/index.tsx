import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostListSearchContainer from './components/PostList/PostList';
import Login from './components/Login/Login';
import AdminPostList from './components/AdminPostList/AdminPostList';
import AddPost from './components/AddPost/AddPost';
import PostDetail from './components/PostDetails/PostDetails';

type RootStackParamList = {
  PostList: undefined;
  Login: undefined;
  Admin: undefined;
  AddPost: { postId?: string };
  PostDetails: { postId: string }
};
const handleAddPost = (title: string, description: string) => {
  console.log('Post adicionado/atualizado:', { title, description });
}

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function Index() {
  return (
      <Stack.Navigator>
        <Stack.Screen 
          name="PostList" 
          component={PostListSearchContainer} 
          options={{title: 'Busca de Postagens'}}
          />
      <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminPostList} 
          options={{title: 'Administração de Postagens'}}
          />
        <Stack.Screen 
          name="AddPost"
          options={{ title: 'Adicionar Postagem' }}
          >
          {(props: any) => <AddPost {...props} onAddPost={handleAddPost} />}
          </Stack.Screen>
        <Stack.Screen 
          name='PostDetails' 
          component={PostDetail}
          options={{title: ''}}/> 
      </Stack.Navigator>
  );
}
