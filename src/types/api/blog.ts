export interface RelatedAdmin {
  id: string;
  name: string;
}

// blog categories
export interface BlogCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoryPayload {
  name: string;
}

// blogs
export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  category?: BlogCategory;
  author?: RelatedAdmin;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPayload {
  title: string;
  content: string;
  /** optional — backend falls back to the authenticated admin */
  authorId?: string;
  categoryId: string;
}
