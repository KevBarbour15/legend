"use client";

import * as React from "react";
import { format } from "date-fns";

import { CalendarBlank } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start rounded-md border bg-[#f5f5f5] px-3 text-left font-hypatia text-base drop-shadow-card",
          )}
        >
          <CalendarBlank className="mr-3 h-4 w-4 p-0 text-customNavy hover:text-customGold" />
          <div className="text-customNavy">
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
