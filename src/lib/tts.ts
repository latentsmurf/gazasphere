export function speak(text: string, lang: 'en-US' | 'ar-SA'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject('Speech synthesis not supported')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.8

    utterance.onend = () => resolve()
    utterance.onerror = (event) => reject(event.error)
    
    window.speechSynthesis.speak(utterance)
  })
}
