import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Saves a customer inquiry from the contact form into Firestore.
 */
export async function saveInquiry(inquiryData) {
  try {
    const inquiriesCol = collection(db, "inquiries");
    const docRef = doc(inquiriesCol);
    const newInquiry = {
      ...inquiryData,
      id: docRef.id,
      timestamp: new Date().toISOString()
    };
    await setDoc(docRef, newInquiry);
    return newInquiry;
  } catch (err) {
    console.error("Failed to save inquiry to Firestore:", err);
    throw err;
  }
}

/**
 * Fetches all customer inquiries from Firestore.
 */
export async function fetchInquiries() {
  try {
    const inquiriesCol = collection(db, "inquiries");
    const snapshot = await getDocs(inquiriesCol);
    
    if (snapshot.empty) return [];

    const inquiriesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Sort inquiries by timestamp descending (newest first)
    return inquiriesList.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  } catch (err) {
    console.error("Failed to fetch inquiries from Firestore:", err);
    return [];
  }
}

/**
 * Deletes a customer inquiry from Firestore.
 */
export async function deleteInquiry(id) {
  try {
    const docRef = doc(db, "inquiries", id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Failed to delete inquiry with id "${id}":`, err);
    throw err;
  }
}
