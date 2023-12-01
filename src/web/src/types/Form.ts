export type Form = {
  createdAt: Date;
  fileName: string;
  formData: string;
  formTypeId?: string;
  id: string;
  pageCount: number;
  status: string; // will eventually be stored in the db, so likely no enum available
  textractJobId: string;
}
