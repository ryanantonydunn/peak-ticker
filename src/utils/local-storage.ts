export function getLocalStorage(key: string): unknown {
  if (typeof window !== "undefined") {
    const str = window.localStorage.getItem(key);
    if (str) {
      return JSON.parse(str);
    }
  }
}

export function setLocalStorage(key: string, value: unknown): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getLocalLoggedPeaks(): number[] {
  return (getLocalStorage("peaks") as number[] | undefined) || [];
}

export function setLocalLoggedPeaks(peaks: number[]) {
  setLocalStorage("peaks", peaks);
}
