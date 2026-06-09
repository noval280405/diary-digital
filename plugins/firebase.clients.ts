import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
    // Masukkan konfigurasi yang kamu salin dari Firebase Console tadi
    const firebaseConfig = {
        apiKey: "AIzaSyCu0xsfZCiIegl21EOvwWu42HnDcC9As6Y",
        authDomain: "syafama-media.firebaseapp.com",
        databaseURL: "https://syafama-media-default-rtdb.firebaseio.com",
        projectId: "syafama-media",
        storageBucket: "syafama-media.firebasestorage.app",
        messagingSenderId: "909231531359",
        appId: "1:909231531359:web:e72585a1544cb7929042ea"
    }

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)

    return {
        provide: {
            fbAuth: auth,
            fbDb: db
        }
    }
})