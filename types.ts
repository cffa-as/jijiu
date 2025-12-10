
export type EmergencyCategory = 'medical' | 'disaster' | 'survival';

export interface GuideStep {
  title: string;
  description: string;
  imagePlaceholder?: string; // URL for image/gif
  isCritical?: boolean;
  durationSeconds?: number; // If step requires timing (e.g. check breathing 10s)
  bpm?: number; // If step requires rhythm (e.g. CPR 110bpm)
}

export interface EmergencyGuide {
  id: string;
  title: string;
  category: EmergencyCategory;
  summary: string;
  iconName: string; // Lucide icon name
  steps: GuideStep[];
  quickSteps: string[]; // For "Quick Mode"
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'food' | 'medical' | 'tool' | 'doc';
  expiryDate?: string;
  quantity: number;
  location?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string; // e.g. "Father", "Key Holder"
  phone: string;
  bloodType?: string;
  medicalNotes?: string; // Allergies, medications
}

export interface DrillTask {
  id: string;
  title: string;
  lastPerformed: string | null;
  frequencyDays: number;
  steps: string[]; // Checklist steps for the drill
}

// --- Map & Plan Types ---

export type MarkerType = 'exit' | 'extinguisher' | 'kit' | 'danger' | 'assembly' | 'valve';

export interface MapMarker {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  type: MarkerType;
}

export interface PlanData {
  backgroundImage?: string; // Base64 Data URL
  markers: MapMarker[];
}

export enum ViewState {
  HOME = 'HOME',
  GUIDE_LIST = 'GUIDE_LIST',
  GUIDE_DETAIL = 'GUIDE_DETAIL',
  TOOLS = 'TOOLS',
  PLAN = 'PLAN',
  KIT = 'KIT'
}
