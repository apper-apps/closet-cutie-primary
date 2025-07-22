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