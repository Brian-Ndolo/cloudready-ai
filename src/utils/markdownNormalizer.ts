/**
 * CloudReady AI - Markdown & Content Normalizer
 *
 * Normalizes common model formatting anomalies safely before rendering:
 * 1. Corrects erroneous Kyrgyz flag emoji (🇰🇬) to Kenyan flag emoji (🇰🇪).
 * 2. Safely decodes printable ASCII numeric character entities (e.g. &#x75; -> 'u', &#x54; -> 'T')
 *    while strictly preserving dangerous characters (<, >, &) to prevent raw HTML/XSS injection.
 * 3. Restores missing whitespace around markdown bold delimiters (e.g. "am**CloudReady AI**" -> "am **CloudReady AI**").
 * 4. Strictly protects code blocks and inline code so technical syntax, math, and code are never mutated.
 */

// Safe printable ASCII range to decode: letters, digits, and standard safe punctuation
function decodeSafeNumericEntity(match: string, hexOrDec: string, isHex: boolean): string {
  const codePoint = parseInt(hexOrDec, isHex ? 16 : 10)
  if (isNaN(codePoint)) return match

  // Strictly allow printable ASCII (space 32 through tilde 126), excluding dangerous HTML chars
  // Exclude: & (38), < (60), > (62), " (34) - keep or let react-markdown handle
  if (
    (codePoint >= 48 && codePoint <= 57) || // 0-9
    (codePoint >= 65 && codePoint <= 90) || // A-Z
    (codePoint >= 97 && codePoint <= 122) || // a-z
    codePoint === 32 || // space
    codePoint === 39 || // '
    codePoint === 45 || // -
    codePoint === 46 || // .
    codePoint === 58 || // :
    codePoint === 59 || // ;
    codePoint === 63 || // ?
    codePoint === 33 // !
  ) {
    return String.fromCharCode(codePoint)
  }

  return match
}

export function normalizeMarkdown(content: string): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // 1. Split text by code blocks (fenced ``` and inline `) to avoid altering code
  const codeRegex = /(```[\s\S]*?```|`[^`\n]+`)/g
  const segments = content.split(codeRegex)

  const normalizedSegments = segments.map((segment, index) => {
    // Odd indexes match code blocks captured by the group -> preserve intact!
    if (index % 2 === 1) {
      return segment
    }

    let text = segment

    // 2. Correct Kyrgyzstan flag emoji (🇰🇬: \uD83C\uDDF0\uD83C\uDDEC) to Kenya flag (🇰🇪: \uD83C\uDDF0\uD83C\uDDEA)
    text = text.replace(/\uD83C\uDDF0\uD83C\uDDEC/g, '🇰🇪')

    // 3. Decode hex HTML entities like &#x75; or &#X54; and decimal entities like &#117;
    text = text.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) =>
      decodeSafeNumericEntity(match, hex, true),
    )
    text = text.replace(/&#([0-9]+);/g, (match, dec) =>
      decodeSafeNumericEntity(match, dec, false),
    )

    // 4. Fix missing space before opening bold delimiter when preceded by word characters
    // e.g. "I am**CloudReady AI**" -> "I am **CloudReady AI**"
    text = text.replace(/([a-zA-Z0-9])\*\*([^\s*][^*]*?[^\s*])\*\*/g, '$1 **$2**')

    // 5. Fix missing space after closing bold delimiter when followed immediately by word characters
    // e.g. "**IaaS**is" -> "**IaaS** is" (punctuation like "**IaaS**," is preserved without extra space)
    text = text.replace(/\*\*([^\s*][^*]*?[^\s*])\*\*([a-zA-Z0-9])/g, '**$1** $2')

    return text
  })

  return normalizedSegments.join('')
}
