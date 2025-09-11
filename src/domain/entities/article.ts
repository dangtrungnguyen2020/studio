export type Article = {
  id: string;
  title: Record<string, string>; // language -> text
  content: Record<string, string>; // language -> text
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  createdAt: Date;
  originalLanguage: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
};
