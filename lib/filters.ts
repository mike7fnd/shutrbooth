export type FilterName =
  | 'none'
  | 'vintage'
  | 'bw'
  | 'film'
  | 'warm'
  | 'cyberpunk'
  | 'dreamy'
  | 'vhs'
  | 'grainy'
  | 'pastel';

export interface Filter {
  name: FilterName;
  label: string;
  css: string;
}

export const FILTERS: Filter[] = [
  { name: 'none',      label: 'None',      css: '' },
  { name: 'vintage',   label: 'Vintage',   css: 'sepia(0.5) contrast(1.2) brightness(0.9) saturate(0.8)' },
  { name: 'bw',        label: 'B&W',       css: 'grayscale(1) contrast(1.1)' },
  { name: 'film',      label: 'Film',      css: 'sepia(0.3) contrast(1.3) brightness(0.95) saturate(0.7)' },
  { name: 'warm',      label: 'Warm',      css: 'sepia(0.2) saturate(1.4) hue-rotate(-15deg) brightness(1.05)' },
  { name: 'cyberpunk', label: 'Cyberpunk', css: 'saturate(2) hue-rotate(180deg) contrast(1.3)' },
  { name: 'dreamy',    label: 'Dreamy',    css: 'brightness(1.1) saturate(1.2) contrast(0.95)' },
  { name: 'vhs',       label: 'VHS',       css: 'contrast(1.4) saturate(1.5) hue-rotate(10deg)' },
  { name: 'grainy',    label: 'Grainy',    css: 'contrast(1.2) brightness(0.95) saturate(0.9)' },
  { name: 'pastel',    label: 'Pastel',    css: 'saturate(0.7) brightness(1.15) contrast(0.9)' },
];

export const getFilterCSS = (name: FilterName): string => {
  const filter = FILTERS.find((f) => f.name === name);
  return filter ? filter.css : '';
};

export const getFilterByName = (name: FilterName): Filter => {
  return FILTERS.find((f) => f.name === name) || FILTERS[0];
};
