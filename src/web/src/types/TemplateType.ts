export type TemplateType = {
  id: string; // uuidv4
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any; // TODO resolve typescript implementation of flexible schema logic
}
