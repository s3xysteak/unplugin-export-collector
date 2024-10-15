export async function collect(path: string): Promise<string[]> {
  return import(path).then(Object.keys)
}
