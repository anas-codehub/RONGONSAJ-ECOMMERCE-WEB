export function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>, nextId: string) {
  if (e.key === "Enter") {
    e.preventDefault();
    const nextInput = document.getElementById(nextId) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }
}