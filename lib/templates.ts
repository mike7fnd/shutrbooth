export interface StripTemplate {
  id: string;
  name: string;
  // Strip container
  stripBg: string;
  borderColor: string;
  dividerColor: string;
  // Header / footer text
  labelText: string;
  // Photo frame
  photoFrameBg: string;
  // Empty slots
  emptySlotBg: string;
  emptySlotBorder: string;
  // Progress dots
  dotActive: string;
  dotInactive: string;
  // Selector thumbnail colours
  thumbBg: string;
  thumbAccent: string;
}

export const TEMPLATES: StripTemplate[] = [
  {
    id: 'classic',
    name: 'classic',
    stripBg: '#F8F6F2',
    borderColor: '#E5E0D8',
    dividerColor: '#E5E0D8',
    labelText: '#8B7D72',
    photoFrameBg: '#ffffff',
    emptySlotBg: 'rgba(245,243,240,0.5)',
    emptySlotBorder: '#D0C8BC',
    dotActive: '#9B7E6E',
    dotInactive: '#D0C8BC',
    thumbBg: '#F8F6F2',
    thumbAccent: '#D0C8BC',
  },
  {
    id: 'noir',
    name: 'noir',
    stripBg: '#141210',
    borderColor: '#2D2926',
    dividerColor: '#2D2926',
    labelText: '#6B5D52',
    photoFrameBg: '#1E1C1A',
    emptySlotBg: 'rgba(20,18,16,0.8)',
    emptySlotBorder: '#3A342E',
    dotActive: '#8B7D72',
    dotInactive: '#2D2926',
    thumbBg: '#141210',
    thumbAccent: '#3A342E',
  },
  {
    id: 'bloom',
    name: 'bloom',
    stripBg: '#FFF0F6',
    borderColor: '#FBCFE8',
    dividerColor: '#FCE7F3',
    labelText: '#BE185D',
    photoFrameBg: '#ffffff',
    emptySlotBg: 'rgba(255,240,246,0.6)',
    emptySlotBorder: '#F9A8D4',
    dotActive: '#F472B6',
    dotInactive: '#FBCFE8',
    thumbBg: '#FFF0F6',
    thumbAccent: '#F9A8D4',
  },
  {
    id: 'retro',
    name: 'retro',
    stripBg: '#D4B896',
    borderColor: '#B89060',
    dividerColor: '#C4A070',
    labelText: '#5C3D0A',
    photoFrameBg: '#E8D5B0',
    emptySlotBg: 'rgba(200,168,130,0.4)',
    emptySlotBorder: '#B89060',
    dotActive: '#8B6914',
    dotInactive: '#C8A870',
    thumbBg: '#D4B896',
    thumbAccent: '#8B6914',
  },
  {
    id: 'midnight',
    name: 'midnight',
    stripBg: '#0F1629',
    borderColor: '#1E2D5A',
    dividerColor: '#1A2545',
    labelText: '#6366F1',
    photoFrameBg: '#162040',
    emptySlotBg: 'rgba(15,22,41,0.8)',
    emptySlotBorder: '#2D3F7A',
    dotActive: '#6366F1',
    dotInactive: '#1E3560',
    thumbBg: '#0F1629',
    thumbAccent: '#6366F1',
  },
];

export const DEFAULT_TEMPLATE = TEMPLATES[0];
