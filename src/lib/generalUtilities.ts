import * as Icons from "lucide-react";

export function resolveIcon(name?: string) {
  if (!name) return null;
  return (Icons as any)[name] ?? Icons.Circle;
}
export const fakeFunction = () => {};