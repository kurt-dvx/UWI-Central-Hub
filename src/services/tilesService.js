import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function fetchAllTiles() {
  try {
    const tilesCollection = collection(db, 'tilesdata');
    const snapshot = await getDocs(tilesCollection);
    
    const tiles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return tiles;
  } catch (error) {
    console.error('Error fetching tiles:', error);
    throw error;
  }
}