import { ChildTableProps } from "@/data/draggable-table";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { X } from "@phosphor-icons/react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ChildCategoriesTable: React.FC<ChildTableProps> = ({
  categories,
  removeCategory,
  onDragEnd,
}) => {
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Table className="h-auto w-full p-3 transition-all duration-300">
          <TableCaption>Current Subcategories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Order</TableHead>
              <TableHead className="w-full">Subcategory</TableHead>
              <TableHead className="text-right">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <Droppable droppableId="categories">
            {(provided) => (
              <TableBody
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-full"
              >
                {categories.map((category, idx) => (
                  <Draggable key={category} draggableId={category} index={idx}>
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={` ${snapshot.isDragging ? "flex w-full justify-between bg-gray-200" : "flex-grow"} `}
                      >
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell>{category}</TableCell>
                        <TableCell className="justify-end text-right">
                          <Button
                            onClick={() => removeCategory(category, "child")}
                          >
                            <X size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </>
  );
};

export default ChildCategoriesTable;
