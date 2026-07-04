import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Fetches all client testimonials from Firestore.
 */
export async function fetchTestimonials() {
  try {
    const testimonialsCol = collection(db, "testimonials");
    const snapshot = await getDocs(testimonialsCol);

    const testimonialsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return testimonialsList;
  } catch (err) {
    console.error("Firestore fetch testimonials failed:", err);
    throw err;
  }
}

/**
 * Adds a new testimonial to Firestore.
 */
export async function addTestimonial(testimonialData) {
  const testimonialsCol = collection(db, "testimonials");
  const docRef = doc(testimonialsCol);
  const newTestimonial = {
    ...testimonialData,
    id: docRef.id
  };
  await setDoc(docRef, newTestimonial);
  return newTestimonial;
}

/**
 * Updates an existing testimonial in Firestore.
 */
export async function updateTestimonial(id, testimonialData) {
  const docRef = doc(db, "testimonials", id);
  await setDoc(docRef, testimonialData, { merge: true });
  return testimonialData;
}

/**
 * Deletes a testimonial from Firestore.
 */
export async function deleteTestimonial(id) {
  const docRef = doc(db, "testimonials", id);
  await deleteDoc(docRef);
}
