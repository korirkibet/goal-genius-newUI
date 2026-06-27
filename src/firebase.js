import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { increment } from "firebase/database";
import {addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, query, updateDoc, where, orderBy, setDoc, startAfter } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdzgeQpJyKlalVoQ-q4-msajNdgss6OGU",
  authDomain: "football2024-f741a.firebaseapp.com",
  projectId: "football2024-f741a",
  storageBucket: "football2024-f741a.appspot.com",
  messagingSenderId: "988342307794",
  appId: "1:988342307794:web:7b6093345325be89f4d60b",
  measurementId: "G-GKR00LWSND"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);
export const auth = getAuth(app);

export const signInUser = (email, password, setNotification) => {
  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    setNotification({
      isVisible: true,
      type: 'success',
      message: "Welcome Back!",
    });
  }).catch(async (error) => {
    const errorMessage = await error.message;
    setNotification({
      isVisible: true,
      type: 'error',
      message: errorMessage,
    });
  });
  return;
}

export const registerUser =(username, email, password, setNotification) => {
  createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.email);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return setNotification({
        isVisible: true,
        type: 'error',
        message: "The user already exists! Login insted.",
      });
    }
    await setDoc(userDocRef, {
      email: user.email,
      username: username,
      isPremium: false, 
      subscription: null
    }).then(async (response) => {
      setNotification({
        isVisible: true,
        type: 'success',
        message: `User with ${user.email} has been registered successfully`,
      });
    }).catch(async (error) => {
      const errorMessage = await error.message;
      setNotification({
        isVisible: true,
        type: 'error',
        message: errorMessage,
      });
    });
  }).catch(async (error) => {
    const errorMessage = await error.message;
    setNotification({
      isVisible: true,
      type: 'error',
      message: errorMessage,
    });
  });
  return;
}

export const updateUser = async (userId, isPremium, subscription, setNotification) => {
  const usercollref = doc(db,'users', userId)
  updateDoc(usercollref,{
    isPremium, 
    subscription
  }).then(response => { 
    setNotification({
      isVisible: true,
      type: 'success',
      message: "user data updated!",
    });
  }).catch(error =>{
    setNotification({
      isVisible: true,
      type: 'error',
      message: "An Unkown Error Occurred" + error.message,
    });
  })
}

export const updateUserPlan = async (userId, plan = null, setNotification) => {
  const usercollref = doc(db,'users', userId)
  updateDoc(usercollref,{
    plan,
  } ).then(response => { 
    setNotification({
      isVisible: true,
      type: 'success',
      message: "user data updated!",
    });
  }).catch(error =>{
    setNotification({
      isVisible: true,
      type: 'error',
      message: "An Unkown Error Occurred" + error.message,
    });
  })
}

export const getUser = async (userId, setUserData) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    setUserData(userDoc.data());
  } else {
    console.error("User not found");
  }
};

export const getAllusers= async (setUsers, setLoading) => {
  setLoading(true);
  const usersCollectionRef = collection(db, "users");


  const users = [];
  await getDocs(usersCollectionRef).then((data) => {
    data.forEach((doc) => {
      users.push({id: doc.id,...doc.data()});
    });
  }).then(() => {
    setUsers(users);
    setLoading(false);
  }).catch(err => setLoading(false));
};

export const getNews = async (pagination, setNews, setNotification, category = null) => {
  try {
    const newsCollectionRef = collection(db, "news");
    let q;
    // Add category filter if category is provided
    if (category) {
    q = query(collection(db, "news"), where("category", "==", category), limit(pagination));
    } else {
      q = query(newsCollectionRef, orderBy("timestamp", "desc"), limit(pagination));
    }

    const querySnapshot = await getDocs(q);
    const news = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (news.length > 0) {
      setNews(news); // Set news only if data is fetched
    }
  } catch (error) {
    setNotification({
      isVisible: true,
      type: "error",
      message: "Error fetching news: " + error.message,
    });
  }
};

export const fetchData = async (
  loading, 
  lastDoc, 
  setData, 
  setLastDoc, 
  setHasMore, 
  setLoading, 
  setNotification, 
  category = null
) => {
  if (loading) return; // Prevent duplicate calls
  setLoading(true);
  
  try {
    const collectionRef = collection(db, "news");
    let q;

    // Add category filter if category is provided
    if (category) {
      q = lastDoc
        ? query(
            collectionRef,
            where("category", "==", category),
            orderBy("timestamp", "desc"),
            startAfter(lastDoc),
            limit(2)
          )
        : query(
            collectionRef,
            where("category", "==", category),
            orderBy("timestamp", "desc"),
            limit(2)
          );
    } else {
      q = lastDoc
        ? query(
            collectionRef,
            orderBy("timestamp", "desc"),
            startAfter(lastDoc),
            limit(2)
          )
        : query(collectionRef, orderBy("timestamp", "desc"), limit(2));
    }

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Append new data while avoiding duplicates
    setData((prevData) => {
      const newDocs = docs.filter((doc) => !prevData.some((item) => item.id === doc.id));
      return [...prevData, ...newDocs];
    });

    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(!querySnapshot.empty && querySnapshot.docs.length >= 2);
  } catch (error) {
    setNotification({
      isVisible: true,
      type: 'error',
      message: "Error fetching data: " + error.message,
    });
  } finally {
    setLoading(false);
  }
};

export const getNewsItem = async (newsId, setNewsItem, setLoading) => {
  setNewsItem(null);
  setLoading(true);
  const newsDocRef = doc(db, "news", newsId);
  const newsDoc = await getDoc(newsDocRef);
  if (newsDoc.exists()) {
    setNewsItem({id: newsDoc.id, ...newsDoc.data()})
  }
  setLoading(false);
  return;
};

export const addContact = async (data, setNotification) => {
  const contactsDocRef = collection(db, "contacts");
  await addDoc(contactsDocRef, {...data, responded: false}).then(async (userCredential) => {
    setNotification({
      isVisible: true,
      type: 'success',
      message: "Thank You! We will get back to you as soon as possible.",
    });
  }).catch(async (error) => {
    const errorMessage = await error.message;
    setNotification({
      isVisible: true,
      type: 'error',
      message: errorMessage,
    });
  });
};

export const addMailList = async (data, setNotification, setEmail) => {
  try {
      // Reference to the document using email as the document ID
      const mailDocRef = doc(db, "mail-list", data.email);
      const mailDoc = await getDoc(mailDocRef);

      // Check if the email already exists
      if (mailDoc.exists()) {
          return setNotification({
            isVisible: true,
            type: 'warning',
            message: "The email already exists! Try a new one.",
          });
      }

      // Add new email to the mail-list
      await setDoc(mailDocRef, { ...data });
      setNotification({
        isVisible: true,
        type: 'success',
        message: "You are now subscribed to our newsletter.",
      });
      setEmail("");
  } catch (error) {
      setNotification({
        isVisible: true,
        type: 'error',
        message: error.message || "An error occurred while subscribing.",
      });
  }
};

export const addTip = async (data, setNotification, setLoading) => {
  setLoading(true);
  const tipsDocRef = doc(db, "tips", data.home.trim() + data.away.trim() + data.date.split("/").join(""));
  await setDoc(tipsDocRef, {
    ...data
  }).then(async (docRef) => {
    setNotification({
      isVisible: true,
      type: 'success',
      message: "tip added",
    });
    window.location.replace(`/tips`);
  }).catch(async (error) => {
    setNotification({
      isVisible: true,
      type: 'error',
      message: error.message,
    });
    setLoading(false);
  });
  setLoading(false)
};

export const updateTip = async (id, data, setNotification, setLoading, setData) => {
  setLoading(true);
  const tipsDocRef = doc(db, "tips", id);
  await updateDoc(tipsDocRef, {
    ...data
  }).then(async (docRef) => {
    setNotification({
      isVisible: true,
      type: 'success',
      message: "Tip updated successfully!",
    });

    const docSnap = await getDoc(tipsDocRef); // Fetch the document

    if (docSnap.exists()) {
      setData(docSnap.data());
      return docSnap.data();
    } else {
      return null;
    }
  }).catch(async (error) => {
    setNotification({
      isVisible: true,
      type: 'error',
      message: error.message,
    });
    setLoading(false);
  });
  setLoading(false)
};

export const addNews = async (data, setNotification, setLoading) => {
  setLoading(true);
  const newsDocRef = collection(db, "news");
  if (data.image) {
    const imageRef = ref(storage, `blogs/${data.image.name.split(" ").join("_")}`);
    const metadata = {
        contentType: 'blogs/jpeg',
    };
    await uploadBytes(imageRef, data.image, metadata).then((response) => {
      return getDownloadURL(response.ref);
    }).then(async(downloadURL) => {
      await addDoc(newsDocRef, {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: downloadURL,
        timestamp: new Date().toLocaleDateString()
      }).then(async (docRef) => {
        window.location.replace(`/blogs/${docRef.id}`);
      }).catch(async (error) => {
        setNotification({
          isVisible: true,
          type: 'error',
          message: error.message,
        });
        setLoading(false);
      });
    })
  } else {
    setNotification({
      isVisible: true,
      type: 'warining',
      message: 'Please upload an image',
    });
    setLoading(false);
  };
  
};

export const updateNews = async (id, data, setLoading, setNotification) => {
  setLoading(true);
  const newsDocRef = doc(db, "news", id);
  
  if (data.image) {
    const imageRef = ref(storage, `blogs/${data.image.name.split(" ").join("_")}`);
    const metadata = {
      contentType: 'blogs/jpeg',
    };
    await uploadBytes(imageRef, data.image, metadata).then((response) => {
      return getDownloadURL(response.ref);
    }).then(async (downloadURL) => {
      await updateDoc(newsDocRef, {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: downloadURL,
      }).then(() => {
        setNotification({
          isVisible: true,
          type: 'success',
          message: 'Post updated successfully!',
        });
        setLoading(false);
      }).catch(async (error) => {
        setNotification({
          isVisible: true,
          type: 'error',
          message: error.message,
        });
        setLoading(false);
      });
    });
  } else {
    await updateDoc(newsDocRef, {
      title: data.title,
      description: data.description,
      category: data.category,
    }).then(() => {
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Post updated successfully!',
      });
      setLoading(false);
    }).catch(async (error) => {
      setNotification({
        isVisible: true,
        type: 'error',
        message: error.message,
      });
      setLoading(false);
    });
  }
};

export const getTips = async (setTips, setLoading, currentDate) => {
  setLoading(true);
  const tipsCollectionRef = collection(db, "tips");
  var q = query(tipsCollectionRef, where("date", "==", currentDate));

  const tips = [];
  await getDocs(q).then((data) => {
    data.forEach((doc) => {
      tips.push({id: doc.id, ...doc.data()});
    });
  }).then(() => {
    setTips(tips);
    setLoading(false);
  }).catch(err => setLoading(false)).finally(() => {
    setLoading(false);
  })
};
