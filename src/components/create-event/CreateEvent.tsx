import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { formSchema } from "@/data/create-event";
import { ensureFirebaseStorageAuth, storage } from "@/lib/firebase";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

type UploadResponse = {
  url: string;
  is_photo: boolean;
};

const getTodayInputValue = () => new Date().toISOString().split("T")[0];

const CreateEvent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      "#create-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.15, ease: "sine.inOut" },
    );
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      tickets_url: "",
      description: "",
    },
  });

  useEffect(() => {
    form.setValue("date", getTodayInputValue());
  }, [form]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetMedia = () => {
    setSelectedFile(null);
    setMediaError(null);
    setUploadProgress(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      resetMedia();
      return;
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      resetMedia();
      setMediaError("Please upload a photo or video file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      resetMedia();
      setMediaError("Please upload a file that is 100 MB or smaller.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMediaError(null);
  };

  const uploadMedia = (file: File): Promise<UploadResponse> => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const fileName = `${Date.now()}-${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
    const mediaRef = ref(storage, `events/${fileName}`);
    const uploadTask = uploadBytesResumable(mediaRef, file, {
      contentType: file.type,
      cacheControl: "public, max-age=31536000",
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url,
            is_photo: file.type.startsWith("image/"),
          });
        },
      );
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedFile) {
      setMediaError("Please upload a photo or video for this event.");
      return;
    }

    setIsSubmitting(true);
    setMediaError(null);
    setUploadProgress(0);

    try {
      await ensureFirebaseStorageAuth();
      const uploadedMedia = await uploadMedia(selectedFile);
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          tickets_url: values.tickets_url || undefined,
          image_url: uploadedMedia.url,
          is_photo: uploadedMedia.is_photo,
        }),
      });

      if (response.ok) {
        form.reset();
        form.setValue("date", getTodayInputValue());
        resetMedia();
        setUploadProgress(null);
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error ?? "Failed to create event.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setMediaError(
        error instanceof Error
          ? error.message
          : "Failed to create event. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="create-container"
      className="text-black opacity-0"
    >
      <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="For ex: Jose's Birthday Party"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Event Photo or Video</FormLabel>
              <FormDescription className="text-pretty text-sm italic md:text-base">
                Upload a photo or video. The event will automatically use the
                correct display format based on the file type.
              </FormDescription>
              <FormControl>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                />
              </FormControl>
              {selectedFile && (
                <p className="text-sm text-stone-600">
                  Selected {selectedFile.type.startsWith("image/") ? "photo" : "video"}:{" "}
                  {selectedFile.name}
                </p>
              )}
              {previewUrl && selectedFile?.type.startsWith("image/") && (
                // eslint-disable-next-line @next/next/no-img-element -- object URLs cannot be optimized by next/image
                <img
                  src={previewUrl}
                  alt="Selected event media preview"
                  className="max-h-64 rounded-md border border-stone-200 object-contain"
                />
              )}
              {previewUrl && selectedFile?.type.startsWith("video/") && (
                <video
                  src={previewUrl}
                  className="max-h-64 rounded-md border border-stone-200 object-contain"
                  controls
                  muted
                  playsInline
                />
              )}
              {mediaError && (
                <p className="text-sm font-medium text-red-500">{mediaError}</p>
              )}
              {uploadProgress !== null && (
                <p className="text-sm text-stone-600">
                  Uploading media: {uploadProgress}%
                </p>
              )}
            </FormItem>

            <FormField
              control={form.control}
              name="tickets_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tickets Link</FormLabel>
                  <FormDescription className="text-pretty text-sm italic md:text-base">
                    Optional Eventbrite or ticket purchase URL.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://www.eventbrite.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional information/ideas here."
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateEvent;
