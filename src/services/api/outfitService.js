import outfitData from "@/services/mockData/outfits.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let outfits = [...outfitData];

export const getAll = async () => {
  await delay(300);
  return [...outfits];
};

export const getById = async (id) => {
  await delay(200);
  const outfit = outfits.find(o => o.Id === id);
  if (!outfit) {
    throw new Error("Outfit not found");
  }
  return { ...outfit };
};

export const createOutfit = async (outfitData) => {
  await delay(400);
  
  const newId = Math.max(...outfits.map(o => o.Id), 0) + 1;
  const newOutfit = {
    Id: newId,
    ...outfitData,
    dateAdded: outfitData.dateAdded || new Date().toISOString(),
    rating: outfitData.rating || 0,
    wornDates: outfitData.wornDates || []
  };
  
  outfits.push(newOutfit);
  return { ...newOutfit };
};

export const updateOutfit = async (id, updatedData) => {
  await delay(300);
  
  const index = outfits.findIndex(o => o.Id === id);
  if (index === -1) {
    throw new Error("Outfit not found");
  }
  
  const updatedOutfit = { ...outfits[index], ...updatedData };
  outfits[index] = updatedOutfit;
  return { ...updatedOutfit };
};

export const deleteOutfit = async (id) => {
  await delay(250);
  
  const index = outfits.findIndex(o => o.Id === id);
  if (index === -1) {
    throw new Error("Outfit not found");
  }
outfits.splice(index, 1);
  return true;
};

// Calendar/Planning specific operations
export const getPlanningData = async () => {
  await delay(300);
  // Get all outfits with their planned dates
  return outfits.map(outfit => ({
    ...outfit,
    plannedDates: outfit.plannedDates || []
  }));
};

export const createPlanning = async (planningData) => {
  await delay(300);
  
  const { outfitId, date, eventTitle, reminder } = planningData;
  const outfitIndex = outfits.findIndex(o => o.Id === outfitId);
  
  if (outfitIndex === -1) {
    throw new Error("Outfit not found");
  }
  
  const plannedDates = outfits[outfitIndex].plannedDates || [];
  const newPlanning = {
    Id: Math.max(...plannedDates.map(p => p.Id || 0), 0) + 1,
    date,
    eventTitle: eventTitle || "",
    reminder: reminder || false,
    createdAt: new Date().toISOString()
  };
  
  outfits[outfitIndex].plannedDates = [...plannedDates, newPlanning];
  return { ...newPlanning };
};

export const updatePlanning = async (outfitId, planningId, updatedData) => {
  await delay(300);
  
  const outfitIndex = outfits.findIndex(o => o.Id === outfitId);
  if (outfitIndex === -1) {
    throw new Error("Outfit not found");
  }
  
  const plannedDates = outfits[outfitIndex].plannedDates || [];
  const planningIndex = plannedDates.findIndex(p => p.Id === planningId);
  
  if (planningIndex === -1) {
    throw new Error("Planning not found");
  }
  
  const updatedPlanning = { ...plannedDates[planningIndex], ...updatedData };
  outfits[outfitIndex].plannedDates[planningIndex] = updatedPlanning;
  
  return { ...updatedPlanning };
};

export const deletePlanning = async (outfitId, planningId) => {
  await delay(250);
  
  const outfitIndex = outfits.findIndex(o => o.Id === outfitId);
  if (outfitIndex === -1) {
    throw new Error("Outfit not found");
  }
  
  const plannedDates = outfits[outfitIndex].plannedDates || [];
  const planningIndex = plannedDates.findIndex(p => p.Id === planningId);
  
  if (planningIndex === -1) {
    throw new Error("Planning not found");
  }
  
  outfits[outfitIndex].plannedDates.splice(planningIndex, 1);
  return true;
};