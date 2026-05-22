import createDOMPurify from 'isomorphic-dompurify';

const DOMPurify = createDOMPurify();

export function stripHtmlTags(value = '') {
  return value
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '')
    .replace(/<br\s*\/?\>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizePlainText(value = '') {
  return stripHtmlTags(value);
}

export function sanitizeRichText(value = '') {
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

export function splitPlainTextToBullets(value = '') {
  const normalized = normalizePlainText(value);
  if (!normalized) return [];

  const lines = normalized
    .split(/(?:\r?\n|•|·|\u2022|\u2023|\u25E6|\u2043|\u2219|\s-\s)+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  const sentences = normalized
    .split(/\.(?=\s|$)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => `${sentence}.`);

  return sentences.length > 1 ? sentences : lines;
}
