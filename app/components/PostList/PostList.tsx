import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


type RootStackParamList = {
  PostDetails: { postId: string };
  Login: undefined;               
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Post {
  id: string;
  title: string;
  description: string;
}

const PostListSearchContainer: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/api/posts?page=1&limit=20');
        setPosts(response.data.data);
        setFilteredPosts(response.data.data);
      } catch (err) {
        console.error('Erro ao buscar os posts:', err);
        setError('Erro ao buscar os posts.');
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const searchPostsByKeyword = async () => {
      setError('');
      try {
        if (keyword) {
          const response = await axios.get(
            `http://10.0.2.2:3000/api/posts/search?keyword=${keyword}`
          );
          setFilteredPosts(response.data);
        }
      } catch (err) {
        setError('Ocorreu um erro ao buscar os posts.');
      }
    };

    searchPostsByKeyword();
  }, [keyword, posts]);

  const handlePostClick = (postId: string) => {
    navigation.navigate('PostDetails', { postId });
  };

  const handleLoginClick = () => {
    navigation.navigate('Login');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostClick(item.id)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>
        {item.description.substring(0, 100).concat('...')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loginIcon} onPress={handleLoginClick}>
        <FontAwesome name="user-circle" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Digite a palavra para busca..."
        value={keyword}
        onChangeText={setKeyword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noPosts}>Nenhum post encontrado.</Text>
      )}
    </View>
  );
};

export default PostListSearchContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loginIcon: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  postItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#555',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  noPosts: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
  },
});
