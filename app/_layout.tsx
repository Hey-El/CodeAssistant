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
import store, { persistor, RootState } from "@/components/authstate";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { LoadingOverlay } from "./(tabs)/loading";
import CodeChallenge from "./(tabs)/challengeScreen";
import Results from "./(tabs)/Results";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ModalStack = createNativeStackNavigator();

function MyTabs() {
  const TabScreens = useMemo(
    () => (
      <>
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
      {TabScreens}
    </Tab.Navigator>
  );
}

function RootLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Create Account"
        component={SignupScreen}
        options={{
          headerStyle: {
            backgroundColor: "#2563eb", // blue-600
          },
          headerTintColor: "#ffffff", // white text
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: true, // adds shadow
          headerTitleAlign: "center", // centers the title
        }}
      />
      <Stack.Screen
        name="Log In"
        component={LoginScreen}
        options={{
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#2563eb", // blue-600
          },
          headerTintColor: "#ffffff", // white text
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: true, // adds shadow
          headerTitleAlign: "center", // centers the title // Modal presentation for Payment screen
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <ModalStack.Navigator>
      <ModalStack.Screen
        name="HomeScreen"
        component={Index}
        options={{ headerShown: false }}
      />
      <ModalStack.Screen name="Challenges" component={CodeChallenge} />
      <ModalStack.Screen name="Results" component={Results} />
    </ModalStack.Navigator>
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
        <PersistGate loading={<LoadingOverlay />} persistor={persistor}>
          <StatusBar style="light" />
          <Navigation />
        </PersistGate>
      </Provider>
    </>
  );
}
