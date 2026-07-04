import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const defaultContactSettings = {
  addressLine1: "142 Tribeca St, Penthouse B",
  addressLine2: "New York, NY 10013",
  phone: "+1 (212) 555-8902",
  email: "hello@aurainteriors.com",
  hoursLine1: "Monday – Friday: 9:00 AM – 6:00 PM EST",
  hoursLine2: "Saturday: By Appointment Only",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.484196145624!2d-74.01103852342884!3d40.707328971393695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a16df5f14e7%3A0xc0cf4b63e8a4a5!2sTribeca%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  social_instagram: "https://instagram.com",
  social_facebook: "https://facebook.com",
  social_linkedin: "https://linkedin.com",
  social_youtube: "https://youtube.com"
};

export async function fetchContactSettings() {
  try {
    const docRef = doc(db, "page_content", "contact");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.warn("Failed to fetch contact settings:", err);
    return null;
  }
}

export async function updateContactSettings(data) {
  const docRef = doc(db, "page_content", "contact");
  await setDoc(docRef, data, { merge: true });
  return data;
}
