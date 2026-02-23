import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
import Loading from "@/components/loading/Loading";
import { generateProgress } from "@/utils/progress";

import { parentFormSchema, childFormSchema } from "@/data/menu-categories";

import { DropResult } from "@hello-pangea/dnd";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema for updating parent-child relationships
const updateParentSchema = z.object({
  parent: z.string().min(1, "Please select a parent category"),
  child: z.string(),
});

// Main component for managing menu categories and their relationships
const MenuCategories: React.FC = () => {
  // State management for loading, submission states, and data
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmittingParent, setIsSubmittingParent] = useState<boolean>(false);
  const [isSubmittingChild, setIsSubmittingChild] = useState<boolean>(false);
  const [parentCategories, setParentCategories] = useState<string[]>([]);
  const [childCategories, setChildCategories] = useState<string[]>([]);
  const [parentName, setParentName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const updateProgress = useCallback((start: number, end: number, delay = 0) => {
    setTimeout(() => setProgress(generateProgress(start, end)), delay);
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;
    if (loading) return;
    gsap.fromTo(
      "#menu-categories-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.15, ease: "sine.inOut" },
    );
  }, [loading]);

  // Form initialization using react-hook-form with zod validation
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

  const updateParentForm = useForm<z.infer<typeof updateParentSchema>>({
    resolver: zodResolver(updateParentSchema),
    defaultValues: {
      parent: "",
      child: "",
    },
  });

  // Handler for submitting new parent categories
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

  // Handler for submitting new child categories
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

  // Handler for removing categories (both parent and child)
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

  // Fetches both parent and child categories from the API
  const fetchCategoriesData = useCallback(async () => {
    try {
      updateProgress(34, 66);
      const response = await fetch("/api/menu-categories", {
        method: "GET",
      });

      const data = await response.json();

      const parentCategories = data.parentCategories || [];
      const childCategories = data.childCategories || [];
      const parentName = data.parentName || null;

      updateProgress(67, 99, 750);
      setParentCategories(parentCategories);
      setChildCategories(childCategories);
      setParentName(parentName);
      setError(null);
    } catch (error) {
      console.error("Error: ", error);
      setError("Network error occurred. Please refresh the page.");
      setProgress(0);
    } finally {
      updateProgress(100, 100);
      setTimeout(() => setLoading(false), 750);
    }
  }, [updateProgress]);

  // Handles reordering of parent categories via drag and drop
  const onDragParentEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(parentCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setParentCategories(items);

    try {
      const response = await fetch("/api/menu-categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: items, type: "parent" }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(null);
      } else {
        setError(data.error || "Failed to update categories.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Network error occurred. Please try again.");
    }
  };

  // Handles reordering of child categories via drag and drop
  const onDragChildEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(childCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChildCategories(items);

    try {
      const response = await fetch("/api/menu-categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: items, type: "child" }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(null);
      } else {
        setError(data.error || "Failed to update subcategories.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Network error occurred. Please try again.");
    }
  };

  // Updates the parent category for selected child categories
  const onSubmitUpdateParent = async (
    values: z.infer<typeof updateParentSchema>,
  ) => {
    try {
      const response = await fetch("/api/menu-categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: childCategories,
          type: "child",
          parentName: values.parent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(null);
        updateParentForm.reset();
        fetchCategoriesData();
      } else {
        setError(data.error || "Failed to update parent category.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("Network error occurred. Please try again.");
    }
  };

  // Load initial data on component mount
  useEffect(() => {
    setProgress(generateProgress(1, 33));
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  if (loading) {
    return (
      <div ref={containerRef} id="menu-categories-container" className="block text-black">
        <Loading
          progress={progress}
          message="Loading menu categories..."
          textColor="black"
          borderColor="border-black"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="menu-categories-container"
      className="space-y-3 text-black opacity-0 md:space-y-6"
    >
      {/* Parent Categories Section */}
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
          <div className="relative min-h-32 basis-1/2">
            <ParentCategoriesTable
              categories={parentCategories}
              removeCategory={removeCategory}
              onDragParentEnd={onDragParentEnd}
            />
          </div>
        </div>
      </Card>

      {/* Child Categories Section */}
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

            <Form {...updateParentForm}>
              <form
                onSubmit={updateParentForm.handleSubmit(onSubmitUpdateParent)}
                className="mt-6 space-y-3"
              >
                <FormField
                  control={updateParentForm.control}
                  name="parent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Parent Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a parent category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parentCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Update Parent</Button>
              </form>
            </Form>
            <p className="mt-6">
              <span className="font-semibold"> Current Parent:</span>{" "}
              {parentName}
            </p>
          </div>

          <div className="relative min-h-32 basis-1/2">
            <ChildCategoriesTable
              categories={childCategories}
              removeCategory={removeCategory}
              onDragChildEnd={onDragChildEnd}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MenuCategories;
