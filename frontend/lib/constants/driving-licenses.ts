export const DRIVING_LICENSE_TYPES = [
  { value: 'A1', label: 'A1 - Hafif Motosiklet (125cc)' },
  { value: 'A2', label: 'A2 - Orta Motosiklet (35kW)' },
  { value: 'A', label: 'A - Motosiklet' },
  { value: 'B1', label: 'B1 - Hafif Dörtekerlekli' },
  { value: 'B', label: 'B - Otomobil' },
  { value: 'BE', label: 'BE - Otomobil + Römork' },
  { value: 'C1', label: 'C1 - Kamyonet (7.5t)' },
  { value: 'C1E', label: 'C1E - Kamyonet + Römork' },
  { value: 'C', label: 'C - Kamyon' },
  { value: 'CE', label: 'CE - Kamyon + Römork' },
  { value: 'D1', label: 'D1 - Minibüs (16 kişi)' },
  { value: 'D1E', label: 'D1E - Minibüs + Römork' },
  { value: 'D', label: 'D - Otobüs' },
  { value: 'DE', label: 'DE - Otobüs + Römork' },
  { value: 'F', label: 'F - Zirai Traktör' },
  { value: 'G', label: 'G - İş Makinesi' }
] as const;

export type DrivingLicenseType = typeof DRIVING_LICENSE_TYPES[number]['value'];
