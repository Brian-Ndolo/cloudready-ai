import { normalizeMarkdown } from './markdownNormalizer'

export function runNormalizerTests(): { passed: number; failed: number; errors: string[] } {
  const tests: Array<{ name: string; input: string; expected: string }> = [
    {
      name: '1. Ordinary prose without markdown or entities',
      input: 'Cloud computing is the delivery of computing services over the internet.',
      expected: 'Cloud computing is the delivery of computing services over the internet.',
    },
    {
      name: '2. Missing space before bold markdown delimiter',
      input: 'I am**CloudReady AI** and I am here to help.',
      expected: 'I am **CloudReady AI** and I am here to help.',
    },
    {
      name: '3. Missing space after bold markdown delimiter followed by word',
      input: 'Understanding **IaaS**is key to passing AZ-900.',
      expected: 'Understanding **IaaS** is key to passing AZ-900.',
    },
    {
      name: '4. Bold markdown delimiter followed by punctuation should not insert space',
      input: 'We recommend **Azure App Service**, which is PaaS.',
      expected: 'We recommend **Azure App Service**, which is PaaS.',
    },
    {
      name: '5. Kyrgyz flag emoji (🇰🇬) normalized to Kenyan flag emoji (🇰🇪)',
      input: 'Karibu Kenya 🇰🇬! Learn cloud fundamentals.',
      expected: 'Karibu Kenya 🇰🇪! Learn cloud fundamentals.',
    },
    {
      name: '6. Hex numeric HTML entities (e.g. &#x75;, &#x54;) safely decoded',
      input: '&#x54;his concept involves &#x75;sing managed services.',
      expected: 'This concept involves using managed services.',
    },
    {
      name: '7. Decimal numeric HTML entities (e.g. &#117;) safely decoded',
      input: 'Start &#117;sing Azure today.',
      expected: 'Start using Azure today.',
    },
    {
      name: '8. Dangerous script tags are NOT converted to raw HTML (<, > preserved)',
      input: 'Check this: &#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;',
      expected: 'Check this: &#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;',
    },
    {
      name: '9. URLs with query strings or dashes are untouched',
      input: 'Official resource: https://learn.microsoft.com/en-us/training/courses/az-900t00?locale=en-us',
      expected: 'Official resource: https://learn.microsoft.com/en-us/training/courses/az-900t00?locale=en-us',
    },
    {
      name: '10. Fenced code blocks with double asterisks (e.g. power operator in Python) are preserved intact',
      input: "```python\nx = 2**8\nprint('Power calculation:', x)\n```",
      expected: "```python\nx = 2**8\nprint('Power calculation:', x)\n```",
    },
    {
      name: '11. Inline code blocks with asterisks are preserved intact',
      input: 'In Python, exponentiation is written as `2**8`.',
      expected: 'In Python, exponentiation is written as `2**8`.',
    },
    {
      name: '12. Kiswahili text and legitimate East African characters preserved',
      input: 'Habari za asubuhi! Karibu kwenye CloudReady AI 🇰🇪. Jifunze misingi ya Azure.',
      expected: 'Habari za asubuhi! Karibu kwenye CloudReady AI 🇰🇪. Jifunze misingi ya Azure.',
    },
  ]

  let passed = 0
  let failed = 0
  const errors: string[] = []

  for (const test of tests) {
    const actual = normalizeMarkdown(test.input)
    if (actual === test.expected) {
      passed++
    } else {
      failed++
      errors.push(`[FAIL] ${test.name}\n  Expected: ${JSON.stringify(test.expected)}\n  Actual:   ${JSON.stringify(actual)}`)
    }
  }

  return { passed, failed, errors }
}

interface ProcessWithArgs {
  argv?: string[]
  exit?: (code?: number) => void
}
declare const process: ProcessWithArgs | undefined

// Self-run when executed directly via node/tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('markdownNormalizer.test')) {
  const result = runNormalizerTests()
  console.log(`Normalizer Tests: ${result.passed} passed, ${result.failed} failed.`)
  if (result.errors.length > 0) {
    console.error(result.errors.join('\n\n'))
    process.exit(1)
  }
}
