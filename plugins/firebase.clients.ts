import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
    // Masukkan konfigurasi yang kamu salin dari Firebase Console tadi
    const firebaseConfig = {
        apiKey: "AIzaSyAtlns1ykxpb8itm3gMQcp8dgW-Xn3H5y0",
        authDomain: "clinic-management-erp.firebaseapp.com",
        projectId: "clinic-management-erp",
        storageBucket: "clinic-management-erp.firebasestorage.app",
        messagingSenderId: "794499631983",
        appId: "1:794499631983:web:619b6faf0a09df80aeb69a",
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