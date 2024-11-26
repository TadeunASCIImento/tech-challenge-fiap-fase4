import { Text, View } from "react-native";
import PostListSearchContainer from "./components/PostList/PostList";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PostListSearchContainer/>
    </View>
  );
}
