export type Campaign = {
  id?: string;
  title: string;
  deadline: string;
  created_at?: string;
};

export type Position = {
  id?: string;
  campaign_id: string;
  name: string;
};

export type Candidate = {
  id?: string;
  position_id: string;
  name: string;
  course: string;
  platform?: string;
};

// Helper function to generate UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper functions to work with localStorage
function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    throw new Error(`Failed to save ${key} to localStorage`);
  }
}

export async function createCampaign(campaignData: Campaign) {
  console.log('Creating campaign with data:', campaignData);
  
  try {
    const campaigns = getFromStorage<Campaign>('campaigns');
    const newCampaign = {
      ...campaignData,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    
    campaigns.push(newCampaign);
    saveToStorage('campaigns', campaigns);
    
    console.log('Campaign created successfully:', newCampaign);
    return newCampaign;
  } catch (err) {
    console.error('Exception in createCampaign:', err);
    throw err;
  }
}

export async function createPositions(positions: Omit<Position, 'id'>[]) {
  if (!positions.length) {
    throw new Error('No positions provided');
  }
  
  console.log('Creating positions with data:', positions);
  
  try {
    const existingPositions = getFromStorage<Position>('positions');
    const newPositions = positions.map(position => ({
      ...position,
      id: generateId()
    }));
    
    existingPositions.push(...newPositions);
    saveToStorage('positions', existingPositions);
    
    console.log('Positions created successfully:', newPositions);
    return newPositions;
  } catch (err) {
    console.error('Exception in createPositions:', err);
    throw err;
  }
}

export async function createCandidates(candidates: Omit<Candidate, 'id'>[]) {
  if (!candidates.length) {
    throw new Error('No candidates provided');
  }
  
  console.log('Creating candidates with data:', candidates);
  
  try {
    const existingCandidates = getFromStorage<Candidate>('candidates');
    const newCandidates = candidates.map(candidate => ({
      ...candidate,
      id: generateId()
    }));
    
    existingCandidates.push(...newCandidates);
    saveToStorage('candidates', existingCandidates);
    
    console.log('Candidates created successfully:', newCandidates);
    return newCandidates;
  } catch (err) {
    console.error('Exception in createCandidates:', err);
    throw err;
  }
}

export async function getCampaigns() {
  try {
    const campaigns = getFromStorage<Campaign>('campaigns');
    return campaigns.sort((a, b) => {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    throw error;
  }
}

export async function getCampaignWithPositionsAndCandidates(campaignId: string) {
  if (!campaignId) {
    throw new Error('Campaign ID is required');
  }

  try {
    const campaigns = getFromStorage<Campaign>('campaigns');
    const positions = getFromStorage<Position>('positions');
    const candidates = getFromStorage<Candidate>('candidates');

    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const campaignPositions = positions.filter(p => p.campaign_id === campaignId);
    const positionIds = campaignPositions.map(p => p.id as string);
    const campaignCandidates = candidates.filter(c => positionIds.includes(c.position_id));

    return {
      campaign,
      positions: campaignPositions,
      candidates: campaignCandidates
    };
  } catch (error) {
    console.error('Error getting campaign details:', error);
    throw error;
  }
} 