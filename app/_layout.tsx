import { useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignupScreen from "./(tabs)/signup";
import IconButton from "./(tabs)/iconButton";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./(tabs)/login";
import { NavigationContainer } from "@react-navigation/native";
import Index from "./(tabs)";
import Settings from "./(tabs)/Settings";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor, RootState } from "@/components/reduxstore";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  const TabScreens = useMemo(
    () => (
      <>
        <Tab.Screen
          name="Home"
          component={Index}
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
      </>
    ),
    []
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hides the header for all screens
        tabBarStyle: { backgroundColor: "#fffaf0" }, // Optional: sets the tab bar background color
      }}
    >
      <Tab.Screen
        name="Home"
        component={Index}
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
            <IconButton icon="home" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootLayout() {
  return (
    <Stack.Navigator>
      {/* Tab screens */}
      {/* Payment Modal */}
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen
        name="Log In"
        component={LoginScreen}
        options={{
          presentation: "modal", // Modal presentation for Payment screen
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer independent={true}>
      {!authCtx && <RootLayout />}
      {authCtx && <MyTabs />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <Provider store={store}>
        <StatusBar style="light" />
        <Navigation />
      </Provider>
    </>
  );
}
