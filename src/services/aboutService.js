import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Fetches all studio stats from Firestore.
 */
export async function fetchStats() {
  try {
    const statsCol = collection(db, "stats");
    const snapshot = await getDocs(statsCol);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.warn("Firestore fetch failed for stats. Error details:", err);
    return [];
  }
}

export async function addStat(statData) {
  const statsCol = collection(db, "stats");
  const docRef = doc(statsCol);
  const newStat = { ...statData, id: docRef.id };
  await setDoc(docRef, newStat);
  return newStat;
}

export async function updateStat(id, statData) {
  const docRef = doc(db, "stats", id);
  await setDoc(docRef, statData, { merge: true });
  return statData;
}

export async function deleteStat(id) {
  const docRef = doc(db, "stats", id);
  await deleteDoc(docRef);
}

/**
 * Fetches the studio timeline process from Firestore.
 */
export async function fetchTimeline() {
  try {
    const timelineCol = collection(db, "timeline");
    const snapshot = await getDocs(timelineCol);

    // Sort by step code
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    return list.sort((a, b) => a.step.localeCompare(b.step));
  } catch (err) {
    console.warn("Firestore fetch failed for timeline. Error details:", err);
    return [];
  }
}

export async function addTimelineStep(stepData) {
  const timelineCol = collection(db, "timeline");
  const docRef = doc(timelineCol);
  const newStep = { ...stepData, id: docRef.id };
  await setDoc(docRef, newStep);
  return newStep;
}

export async function updateTimelineStep(id, stepData) {
  const docRef = doc(db, "timeline", id);
  await setDoc(docRef, stepData, { merge: true });
  return stepData;
}

export async function deleteTimelineStep(id) {
  const docRef = doc(db, "timeline", id);
  await deleteDoc(docRef);
}

// ==========================================
// ABOUT PAGE STATIC CONTENT
// ==========================================

export async function fetchAboutContent() {
  try {
    const docRef = doc(db, "page_content", "about");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (err) {
    console.warn("Firestore fetch failed for about content.", err);
    return null;
  }
}

export async function updateAboutContent(contentData) {
  const docRef = doc(db, "page_content", "about");
  await setDoc(docRef, contentData, { merge: true });
  return contentData;
}
