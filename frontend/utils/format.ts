export function shortAddress(address?: string | null) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export function formatUnixTime(timestamp?: bigint | number | null) {
  if (timestamp === null || timestamp === undefined) return "Not set";

  const value = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value * 1000));
}

export function formatAmount(amount: bigint | number | string) {
  return amount.toString();
}

export function enumTag(value: { tag: string } | string) {
  return typeof value === "string" ? value : value.tag;
}
