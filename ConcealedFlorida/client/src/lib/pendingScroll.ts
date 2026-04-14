let pendingId: string | null = null;

export function setPendingScroll(id: string) {
  pendingId = id;
}

export function consumePendingScroll(): string | null {
  const id = pendingId;
  pendingId = null;
  return id;
}
