import { collection, getDocs, doc, setDoc, query, where, limit, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Fetches all portfolio projects from Firestore.
 */
export async function fetchProjects() {
  try {
    const projectsCol = collection(db, "projects");
    const snapshot = await getDocs(projectsCol);

    const projectsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return projectsList;
  } catch (err) {
    console.error("Firestore fetch projects failed:", err);
    throw err;
  }
}

/**
 * Fetches a single project matching the URL slug from Firestore.
 */
export async function fetchProjectBySlug(slug) {
  try {
    const projectsCol = collection(db, "projects");
    const q = query(projectsCol, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (err) {
    console.warn(`Firestore fetch for slug "${slug}" failed. Error details:`, err);
    return null;
  }
}

/**
 * Adds a new project to Firestore.
 */
export async function addProject(projectData) {
  const projectsCol = collection(db, "projects");
  const docRef = doc(projectsCol);
  const title = projectData.title || "Untitled Project";
  const newProject = { 
    ...projectData,
    title,
    id: docRef.id,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  };
  await setDoc(docRef, newProject);
  return newProject;
}

/**
 * Updates an existing project in Firestore.
 */
export async function updateProject(id, projectData) {
  const docRef = doc(db, "projects", id);
  const title = projectData.title || "Untitled Project";
  const updatedData = {
    ...projectData,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  };
  await setDoc(docRef, updatedData, { merge: true });
  return updatedData;
}

/**
 * Deletes a project from Firestore.
 */
export async function deleteProject(id) {
  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}
