export interface Category {
  id: string;
  categoryName: string;
  description: string;
}

export interface AddCategory {
  categoryName: string;
  description: string;
}

export interface UpdateCategory {
  categoryName?: string;
  description?: string;
}
