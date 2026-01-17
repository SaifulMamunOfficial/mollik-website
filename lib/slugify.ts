// Bengali to Banglish (Romanized) transliteration

const bengaliToEnglish: Record<string, string> = {
    // Vowels
    'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u',
    'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',

    // Consonants
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh',
    'স': 's', 'হ': 'h', 'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y',
    'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n',

    // Matras (vowel signs)
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u',
    'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
    '্': '', // Hasanta (virama) - removes inherent vowel

    // Numbers
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
}

export function bengaliToSlug(text: string): string {
    if (!text) return ''

    let result = ''
    let prevWasConsonant = false

    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const nextChar = text[i + 1]

        // Check if it's a Bengali character
        if (bengaliToEnglish[char] !== undefined) {
            const transliterated = bengaliToEnglish[char]

            // If it's a consonant and next is not a matra or hasanta, add inherent 'o'
            const isConsonant = /^[কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়]$/.test(char)
            const nextIsMatra = nextChar && /^[া-ৌ্]/.test(nextChar)

            if (isConsonant && !nextIsMatra && transliterated) {
                result += transliterated + 'o'
                prevWasConsonant = true
            } else {
                result += transliterated
                prevWasConsonant = false
            }
        } else if (/[a-zA-Z0-9]/.test(char)) {
            // Keep English letters and numbers
            result += char.toLowerCase()
            prevWasConsonant = false
        } else if (/\s/.test(char) || char === '-') {
            // Replace spaces with hyphens
            if (result && !result.endsWith('-')) {
                result += '-'
            }
            prevWasConsonant = false
        }
        // Skip other characters
    }

    // Clean up the result
    return result
        .replace(/-+/g, '-')  // Multiple hyphens to single
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        .toLowerCase()
}

export function generateSlug(title: string): string {
    // First try Bengali transliteration
    const banglishSlug = bengaliToSlug(title)

    // If no Bengali content, use simple slug generation
    if (!banglishSlug) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    return banglishSlug
}
