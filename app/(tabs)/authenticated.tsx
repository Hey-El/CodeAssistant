import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Index from "./index";
import Settings from "./Settings";
import CodeChallenge from "./challengeScreen";
import Results from "./Results";
import IconButton from "./iconButton";
import tw from "twrnc";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={Index}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Challenges" component={CodeChallenge} />
      <Stack.Screen name="Results" component={Results} />
    </Stack.Navigator>
  );
}

export default function AuthenticatedTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fffaf0" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My account"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
