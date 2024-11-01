import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { parentFormSchema, childFormSchema } from "@/data/menu-categories";

import { X } from "@phosphor-icons/react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const MenuCategories: React.FC = () => {
  const [isSubmittingParent, setIsSubmittingParent] = useState<boolean>(false);
  const [isSubmittingChild, setIsSubmittingChild] = useState<boolean>(false);
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [childCategories, setChildCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const parentForm = useForm<z.infer<typeof parentFormSchema>>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      title: "",
      type: "parent",
    },
  });

  const childForm = useForm<z.infer<typeof childFormSchema>>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      title: "",
      type: "child",
    },
  });

  const onSubmitParent = async (values: z.infer<typeof parentFormSchema>) => {
    setIsSubmittingParent(true);
    try {
      const response = await fetch("/api/menu-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setError(null);
        parentForm.reset();
        fetchCategoriesData();
      } else {
        setError(data.error || "Failed to add subcategory.");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsSubmittingParent(false);
    }
  };

  const onSubmitChild = async (values: z.infer<typeof childFormSchema>) => {
    setIsSubmittingChild(true);
    try {
      const response = await fetch("/api/menu-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setError(null);
        childForm.reset();
        fetchCategoriesData();
      } else {
        setError(data.error || "Failed to add subcategory.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Network error occurred. Please try again.");
    } finally {
      setIsSubmittingChild(false);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await fetch("/api/menu-categories", {
        method: "GET",
      });

      const data = await response.json();

      const parentCategories = data.parentCategories || [];
      const childCategories = data.childCategories || [];

      setParentCategories(parentCategories);
      setChildCategories(childCategories);

      setError(null);
    } catch (error) {
      console.error("Error: ", error);
      setError("Network error occurred. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <div className="space-y-3 text-black md:space-y-6">
      <Card className="p-3 md:p-6">
        <div className="flex flex-col space-y-3 md:flex-row md:space-x-6 md:space-y-0">
          <div className="basis-1/2">
            <Form {...parentForm}>
              <form
                onSubmit={parentForm.handleSubmit(onSubmitParent)}
                className="space-y-3"
              >
                <FormField
                  control={parentForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Menu Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="For ex: Canned / Bottled, Wine, etc"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmittingParent}>
                  {isSubmittingParent ? "Adding" : "Add"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="basis-1/2">
            <Table className="max-h-72 w-full p-3 transition-all duration-300">
              <TableCaption>Current Categories</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="basis-1/4 text-left">Order</TableHead>
                  <TableHead className="basis-1/2">Category</TableHead>
                  <TableHead className="basis-1/4 text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {parentCategories.map((category, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="basis-1/4 font-medium">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="basis-1/2">{category}</TableCell>

                    <TableCell className="flex basis-1/4 justify-end text-right">
                      <Button>
                        <X size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
      <Card className="p-3 md:p-6">
        <div className="flex flex-col space-y-3 md:flex-row md:space-x-6 md:space-y-0">
          <div className="basis-1/2">
            <Form {...childForm}>
              <form
                onSubmit={childForm.handleSubmit(onSubmitChild)}
                className="space-y-3"
              >
                <FormField
                  control={childForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Menu Subcategory</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="For ex: IPAs, Lagers, etc"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmittingChild}>
                  {isSubmittingChild ? "Adding..." : "Add"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="basis-1/2">
            <Table className="max-h-72 w-full p-3 transition-all duration-300">
              <TableCaption>Current Subcategories</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="basis-1/4 text-left">Order</TableHead>
                  <TableHead className="basis-1/2">Subcategory</TableHead>
                  <TableHead className="basis-1/4 text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {childCategories.map((category, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="basis-1/4 font-medium">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="basis-1/2">{category}</TableCell>

                    <TableCell className="flex basis-1/4 justify-end text-right">
                      <X size={18} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MenuCategories;
