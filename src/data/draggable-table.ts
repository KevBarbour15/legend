export interface ParentTableProps {
  categories: string[];
  removeCategory: (category: string, type: string) => void;
  onDragEnd: (result: any) => void;
}

export interface ChildTableProps {
  categories: string[];
  removeCategory: (category: string, type: string) => void;
  onDragEnd: (result: any) => void;
}
