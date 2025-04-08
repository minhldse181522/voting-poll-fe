export interface Performance {
  id: string;
  name: string;
  vote: number;
}

export interface UpdatePerformance {
  categoryId: number;
}

export interface AddPerformance {
  name: string;
}
