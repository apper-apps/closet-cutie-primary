import moodboardData from "@/services/mockData/moodboards.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let moodboards = [...moodboardData];

export const getAll = async () => {
  await delay(300);
  return [...moodboards];
};

export const getById = async (id) => {
  await delay(200);
  const moodboard = moodboards.find(m => m.Id === id);
  if (!moodboard) {
    throw new Error("Moodboard not found");
  }
  return { ...moodboard };
};

export const createMoodboard = async (moodboardData) => {
  await delay(400);
  
  const newId = Math.max(...moodboards.map(m => m.Id), 0) + 1;
  const newMoodboard = {
    Id: newId,
    ...moodboardData,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  moodboards.push(newMoodboard);
  return { ...newMoodboard };
};

export const updateMoodboard = async (id, updatedData) => {
  await delay(300);
  
  const index = moodboards.findIndex(m => m.Id === id);
  if (index === -1) {
    throw new Error("Moodboard not found");
  }
  
  const updatedMoodboard = { 
    ...moodboards[index], 
    ...updatedData,
    lastModified: new Date().toISOString()
  };
  moodboards[index] = updatedMoodboard;
  return { ...updatedMoodboard };
};

export const deleteMoodboard = async (id) => {
  await delay(250);
  
  const index = moodboards.findIndex(m => m.Id === id);
  if (index === -1) {
    throw new Error("Moodboard not found");
  }
  
  moodboards.splice(index, 1);
  return true;
};