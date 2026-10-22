export function contentPath(id: string, published: Date): string {
  return `/${published.toISOString().slice(0, 10)}-${id.split("/").pop()}`;
}
