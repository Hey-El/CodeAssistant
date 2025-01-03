import { createUser } from "./auth";
import { useContext } from "react";
import AuthContent from "@/components/AuthContent";
import { AuthContext } from "@/components/auth-context";
import signUpUser from "./newUser";

function SignupScreen() {
  const authCtx = useContext(AuthContext);

  async function SignUpUser({ email, password }) {
    const response = await createUser(email, password);
    const token = JSON.stringify(response.idToken);
    const userId = response.localId;
    await authCtx.login(token, userId);
    const newUser = await signUpUser(userId);
    if (newUser.ok) {
      console.log("User successfully created");
    } else {
      console.log("Error creating user");
    }
  }

  return <AuthContent Authenticated={SignUpUser} />;
}

export default SignupScreen;
