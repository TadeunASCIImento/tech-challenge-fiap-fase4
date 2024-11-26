import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostListSearchContainer from './components/PostList/PostList';
import Login from './components/Login/Login';

type RootStackParamList = {
  Postagens: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Postagens" component={PostListSearchContainer} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
  );
}
