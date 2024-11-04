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

import ParentCategoriesTable from "@/components/draggable-tables/ParentCategoriesTable";
import ChildCategoriesTable from "@/components/draggable-tables/ChildCategoriesTable";

import { parentFormSchema, childFormSchema } from "@/data/menu-categories";

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

  const removeCategory = async (type: string, title: string) => {
    try {
      const response = await fetch("/api/menu-categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: type, title: title }),
      });

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        setError(null);
        fetchCategoriesData();
      } else {
        setError(data.error || "Failed to delete.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Network error occurred. Please try again.");
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

  const onDragEnd = async (result: any) => {};

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
                        <Input placeholder="For ex: Draft, etc" {...field} />
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
          <div className="relative basis-1/2">
            <div
              className={`absolute inset-0 transition-all duration-100 ease-in-out ${loading ? "opacity-100" : "pointer-events-none opacity-0"} flex items-center justify-center text-xl font-medium`}
            >
              <p>Loading...</p>
            </div>

            <div
              className={`min-h-32 transition-all duration-300 ease-in-out ${loading ? "opacity-0" : "opacity-100"} `}
            >
              {!loading && (
                <ParentCategoriesTable
                  categories={parentCategories}
                  removeCategory={removeCategory}
                  onDragEnd={onDragEnd}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
      <Card className="h-auto min-h-32 p-3 transition-all duration-300 ease-in-out md:p-6">
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
                        <Input placeholder="For ex: IPAs, etc" {...field} />
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

          <div className="relative basis-1/2">
            <div
              className={`absolute inset-0 transition-all duration-100 ease-in-out ${loading ? "opacity-100" : "pointer-events-none opacity-0"} flex items-center justify-center text-xl font-medium`}
            >
              <p>Loading...</p>
            </div>

            <div
              className={`min-h-32 transition-all duration-300 ease-in-out ${loading ? "opacity-0" : "opacity-100"} `}
            >
              {!loading && (
                <ChildCategoriesTable
                  categories={childCategories}
                  removeCategory={removeCategory}
                  onDragEnd={onDragEnd}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MenuCategories;
