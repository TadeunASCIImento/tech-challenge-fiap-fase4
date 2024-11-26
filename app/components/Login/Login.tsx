import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
    Admin: undefined;               
  };
  
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LoginResponse {
  id: number;
  username: string;
  token: string;
  profileId: number;
}

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const handleSubmit = async () => {
    try {
      const response = await axios.post<LoginResponse>(
        'http://10.0.2.2:3000/api/user/authorization',
        { username, password }
      );

      const { token } = response.data;
      if (token) {}
        await AsyncStorage.setItem('token', token);
        navigation.navigate('Admin');

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data.message || 'Algo deu errado. Por favor, tente novamente.');
      } else {
        setError('Algo deu errado. Por favor, tente novamente.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.title}>Login</TextInput>
      {error && <TextInput style={styles.error}>{error}</TextInput>}
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default Login;
