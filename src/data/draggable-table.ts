export interface ParentTableProps {
  categories: string[];
  removeCategory: (category: string, type: string) => void;
  onDragParentEnd: (result: any) => void;
}

export interface ChildTableProps {
  categories: string[];
  removeCategory: (category: string, type: string) => void;
  onDragChildEnd: (result: any) => void;
}
