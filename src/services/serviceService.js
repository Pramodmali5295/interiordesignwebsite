import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Fetches all design services from Firestore.
 */
export async function fetchServices() {
  try {
    const servicesCol = collection(db, "services");
    const snapshot = await getDocs(servicesCol);

    const servicesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return servicesList;
  } catch (err) {
    console.error("Firestore fetch services failed:", err);
    throw err;
  }
}

/**
 * Adds a new design service to Firestore.
 */
export async function addService(serviceData) {
  const servicesCol = collection(db, "services");
  const docRef = doc(servicesCol);
  const newService = {
    ...serviceData,
    id: docRef.id,
    slug: serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  };
  await setDoc(docRef, newService);
  return newService;
}

/**
 * Updates an existing design service in Firestore.
 */
export async function updateService(id, serviceData) {
  const docRef = doc(db, "services", id);
  const updatedData = {
    ...serviceData,
    slug: serviceData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  };
  await setDoc(docRef, updatedData, { merge: true });
  return updatedData;
}

/**
 * Deletes a design service from Firestore.
 */
export async function deleteService(id) {
  const docRef = doc(db, "services", id);
  await deleteDoc(docRef);
}
