export interface Performance {
  id: string;
  name: string;
  vote: number;
}

export interface UpdatePerformance {
  categoryId: number;
}

export interface UpdateCategoryVote {
  enabled: boolean;
}

export interface AddPerformance {
  name: string;
}

export interface UpdatePerformaceBody {
  name?: string;
  vote?: number;
}
