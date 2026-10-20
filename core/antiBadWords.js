const BAD_WORDS = [
  // English
  'fuck', 'fucking', 'fucker', 'motherfucker',
  'shit', 'bullshit', 'bitch', 'bastard',
  'asshole', 'dickhead', 'slut', 'whore',

  // Arabic
  'شرموط', 'شرموطة', 'متناك', 'متناكة',
  'خول', 'عرص', 'منيوك', 'منيوكة',
  'كس امك', 'كسمك', 'يلعن دينك',
  'ابن الكلب', 'ياكلب', 'ياحمار',

  // Franco spellings
  'sharmoot', 'sharmoota', 'kosomak',
  'kosom', 'yabnelkalb', 'yakalb',
  'ya7mar', 'khawal', '3ars',
  'metnak', 'metnaka'
];

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[ًٌٍَُِّْـٰ]/g, '')
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[^\p{L}\p{N}]/gu, '');
}

const NORMALIZED_WORDS = BAD_WORDS.map(normalize);

export function containsBadWord(text = '') {
  const cleaned = normalize(text);
  if (!cleaned) return false;

  return NORMALIZED_WORDS.some(word =>
    word.length >= 3 && cleaned.includes(word)
  );
}
