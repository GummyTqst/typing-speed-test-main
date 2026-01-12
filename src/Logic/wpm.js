export function calculateWPM(correctChars, startTime, endTime = Date.now()) {
    if (!startTime) return 0;
  
    const elapsedMs = endTime - startTime;
    const minutes = elapsedMs / 60000;
  
    if (minutes <= 0) return 0;
  
    return Math.round((correctChars / 5) / minutes);
  }
  
  export function calculateAccuracy(correct, mistakes) {
    const total = correct + mistakes;
    if (total === 0) return 100;
    return Math.round((correct / total) * 100);
  }
  