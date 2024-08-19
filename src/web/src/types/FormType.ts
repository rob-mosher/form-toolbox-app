export type FormType = {
  createdAt: Date;
  fileName: string;
  formData: string;
  id: string;
  pageCount: number;
  status: string; // will eventually be stored in the db, so likely no enum available
  templateId?: string;
  textractJobId: string;
}
