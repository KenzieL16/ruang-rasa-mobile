const localImageMap = {
  '/nasi-ayam-sambal-matah.jpg': require('../../assets/images/nasi-ayam-sambal-matah.jpg'),
  'nasi-ayam-sambal-matah.jpg': require('../../assets/images/nasi-ayam-sambal-matah.jpg'),
  '/nasi-goreng-kampung.jpg': require('../../assets/images/nasi-goreng-kampung.jpg'),
  'nasi-goreng-kampung.jpg': require('../../assets/images/nasi-goreng-kampung.jpg'),
  '/nasi-ayam-mentega.jpg': require('../../assets/images/nasi-ayam-mentega.jpg'),
  'nasi-ayam-mentega.jpg': require('../../assets/images/nasi-ayam-mentega.jpg'),
  '/pisang-goreng.jpg': require('../../assets/images/pisang-goreng.jpg'),
  'pisang-goreng.jpg': require('../../assets/images/pisang-goreng.jpg'),
  '/tahu-gejrot.jpg': require('../../assets/images/tahu-gejrot.jpg'),
  'tahu-gejrot.jpg': require('../../assets/images/tahu-gejrot.jpg'),
  '/bakwan-jagung.jpg': require('../../assets/images/bakwan-jagung.jpg'),
  'bakwan-jagung.jpg': require('../../assets/images/bakwan-jagung.jpg'),
  '/cendol-dawet.jpg': require('../../assets/images/cendol-dawet.jpg'),
  'cendol-dawet.jpg': require('../../assets/images/cendol-dawet.jpg'),
  '/klepon.jpg': require('../../assets/images/klepon.jpg'),
  'klepon.jpg': require('../../assets/images/klepon.jpg'),
  '/es-teh-manis.jpg': require('../../assets/images/es-teh-manis.jpg'),
  'es-teh-manis.jpg': require('../../assets/images/es-teh-manis.jpg'),
  '/kopi-susu-gula-aren.jpg': require('../../assets/images/kopi-susu-gula-aren.jpg'),
  'kopi-susu-gula-aren.jpg': require('../../assets/images/kopi-susu-gula-aren.jpg'),
  '/air-mineral.jpg': require('../../assets/images/air-mineral.jpg'),
  'air-mineral.jpg': require('../../assets/images/air-mineral.jpg'),
  '/resto-ruang-rasa.jpg': require('../../assets/images/resto-ruang-rasa.jpg'),
  'resto-ruang-rasa.jpg': require('../../assets/images/resto-ruang-rasa.jpg'),
  'hero.png': require('../../assets/images/hero.png'),
  '/hero.png': require('../../assets/images/hero.png'),
};

export const defaultHeroImage = localImageMap['/nasi-ayam-sambal-matah.jpg'];
export const defaultRestoImage = localImageMap['/resto-ruang-rasa.jpg'];

export function getImageSource(imageProp) {
  if (!imageProp) {
    return defaultHeroImage;
  }

  // If already a required number or object
  if (typeof imageProp === 'number' || (typeof imageProp === 'object' && imageProp.uri)) {
    return imageProp;
  }

  const str = String(imageProp).trim();

  if (localImageMap[str]) {
    return localImageMap[str];
  }

  // Check without leading slash
  const cleanStr = str.startsWith('/') ? str.substring(1) : '/' + str;
  if (localImageMap[cleanStr]) {
    return localImageMap[cleanStr];
  }

  if (str.startsWith('http://') || str.startsWith('https://')) {
    return { uri: str };
  }

  // Fallback
  return defaultHeroImage;
}

