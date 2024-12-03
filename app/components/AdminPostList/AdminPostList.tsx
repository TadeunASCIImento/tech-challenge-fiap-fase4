import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


type RootStackParamList = {
    AddPost: { postId: string | undefined};               
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Post {
  id: string;
  title: string;
  description: string;
}

const AdminPostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };

    fetchToken();

    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://10.0.2.2:3000/api/posts?page=1&limit=20");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar os posts:", error);
        Alert.alert("Erro", "Erro ao buscar os posts.");
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    Alert.alert("Confirmação", "Deseja realmente excluir este post?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            await axios.delete(`http://10.0.2.2:3000/api/posts/${postId}`, {
              headers: {
                Authorization: token,
              },
            });
            Alert.alert("Sucesso", "Post excluído com sucesso!");
            setPosts(posts.filter((post) => post.id !== postId));
          } catch (error) {
            console.error("Erro ao excluir o post:", error);
            Alert.alert("Erro", "Erro ao excluir o post.");
          }
        },
      },
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate("AddPost", { postId: item.id })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Postagens</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("AddPost", {postId: undefined})}
      >
        <Text style={styles.createButtonText}>+ Nova Postagem</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Nenhuma postagem encontrada.</Text>}
      />
    </View>
  );
};

export default AdminPostList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  postItem: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#28a745",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 16,
  },
});
