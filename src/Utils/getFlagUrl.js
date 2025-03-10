import countryCodeMap from '../data/countryCodeMap.json';

export function getFlagUrl(alpha3) {
  const alpha2 = countryCodeMap[alpha3];
  if (!alpha2) return ''; // když stát nenajdeme
  return `https://flagcdn.com/w40/${alpha2.toLowerCase()}.png`; // velikost vlajky (změň na w80, w20 podle potřeby)
}
