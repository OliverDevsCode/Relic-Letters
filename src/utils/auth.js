import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  reauthenticateWithPopup,
  signInWithPopup
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/`,
  });
};

export const doReauthenticate = async (currentPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const providerIds = user.providerData.map((p) => p.providerId);

  if (providerIds.includes("password")) {
    // Email/password reauthentication
    if (!currentPassword) {
      throw new Error("Password required for reauthentication");
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return await reauthenticateWithCredential(user, credential);
  }

  if (providerIds.includes("google.com")) {
    // Google reauthentication
    const provider = new GoogleAuthProvider();
    return await reauthenticateWithPopup(user, provider);
  }

  if (providerIds.includes("github.com")) {
    const provider = new GithubAuthProvider();
    return await reauthenticateWithPopup(user, provider);
  }

  throw new Error("Unsupported auth provider for reauthentication");
};

export const doDeleteUserAccount = () => {
  const user = auth.currentUser;
  if (!user) {
    return Promise.reject(new Error("No user is currently signed in."));
  }
  return deleteUser(user);
};

const googleProvider = new GoogleAuthProvider();

export const doSignInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

const githubProvider = new GithubAuthProvider();
export const doSignInWithGithub = () => {
  return signInWithPopup(auth, githubProvider);
};