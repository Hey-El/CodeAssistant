import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSubscription } from "@/app/(tabs)/useSubscription";

interface AuthContextType {
  authToken: string | null; // authToken can be string or null
  userId: string | null;
  isAuthenticated: boolean; // isAuthenticated is a boolean
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>; // logout function returns a promise
  subscriptionType: string; // Default subscription type
}

export const AuthContext = createContext<AuthContextType>({
  authToken: null,
  userId: null,
  login: async () => {},
  isAuthenticated: false,
  logout: async () => {}, // Provide a default async logout function
  subscriptionType: "free", // Default subscription type
});

export function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<string>("free");

  //determines if the user is already logged in by getting the authtoken if one is present
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        const storedUserId = await AsyncStorage.getItem("userId"); // Retrieve token from AsyncStorage
        if (storedToken && storedUserId) {
          setAuthToken(storedToken);
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Failed to load token from AsyncStorage:", error);
      }
    };

    loadToken();
  }, []);

  const isAuthenticated = !!authToken;

  // Login function to store the token and authenticate the user
  const login = async (token: string, userId: string) => {
    setAuthToken(token); // Update state
    setUserId(userId);
    await AsyncStorage.setItem("userId", userId);
    await AsyncStorage.setItem("authToken", token); // Store token in AsyncStorage
  };

  // Function to log out and remove the token
  const logout = async () => {
    setAuthToken(null); // Clear token from state
    setUserId(null);
    await AsyncStorage.removeItem("authToken"); // Remove token from AsyncStorage
    await AsyncStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userId,
        isAuthenticated,
        authToken,
        subscriptionType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
