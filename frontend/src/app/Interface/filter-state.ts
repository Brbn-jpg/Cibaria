export interface FilterState {
  difficulty?: number;
  prepTimeFrom?: number;
  prepTimeTo?: number;
  servingsFrom?: number;
  servingsTo?: number;
  category?: string;
  recipeLanguage?: string;
  query?: string;
  currentPage: number;
  pageSize: number;
}
