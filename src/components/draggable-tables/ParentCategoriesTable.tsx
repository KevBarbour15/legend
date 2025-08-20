import { ParentTableProps } from "@/data/draggable-table";

import { Button } from "@/components/ui/button";
import { IconButton } from "@mui/material";

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

const ParentCategoryTable: React.FC<ParentTableProps> = ({
  categories,
  removeCategory,
  onDragParentEnd,
}) => {
  return (
    <>
      <DragDropContext onDragEnd={onDragParentEnd}>
        <Table className="h-auto w-full p-3 transition-all duration-300">
          <TableCaption>Current Categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Order</TableHead>
              <TableHead className="w-full">Category</TableHead>
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
                          <IconButton
                            onClick={() => removeCategory(category, "parent")}
                            className="text-black transition-all duration-300 md:hover:text-red-500"
                          >
                            <X size={18} />
                          </IconButton>
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

export default ParentCategoryTable;
