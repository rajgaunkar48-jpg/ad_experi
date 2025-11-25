// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCockXycIqggel_72gLywMdzTSV4tbPrJw",
  authDomain: "saveme-oni-chan.firebaseapp.com",
  projectId: "saveme-oni-chan",
  storageBucket: "saveme-oni-chan.firebasestorage.app",
  messagingSenderId: "70804107958",
  appId: "1:70804107958:web:b191bdebb056dd5f39ac17"
};

// Initialize Firebase and export useful constants
export const app = initializeApp(firebaseConfig);
export default firebaseConfig;

export { firebaseConfig };