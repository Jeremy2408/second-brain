import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  fetchAuthSession,
  signOut as amplifySignOut,
} from '@aws-amplify/auth';

export async function signUp(email: string, password: string) {
  return amplifySignUp({ username: email, password });
}

export async function login(email: string, password: string) {
  const session = await fetchAuthSession();

  if (session?.tokens?.idToken) {
    console.log("User already signed in");
    return session.tokens.idToken.toString();
  }

  await amplifySignIn({ username: email, password });

  const newSession = await fetchAuthSession();
  return newSession.tokens?.idToken?.toString() ?? null;
}

export async function signOut() {
  return amplifySignOut();
}
