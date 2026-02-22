"use client";

import React, { useState } from "react";
import { Message } from "@/data/messages";
import { getMessageTypeLabel } from "@/components/message-card/MessageDetailContent";
import MessageDetailContent from "@/components/message-card/MessageDetailContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface MessagesTableProps {
  messages: Message[];
  fetchMessages: () => void;
}

export default function MessagesTable({
  messages,
  fetchMessages,
}: MessagesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-stone-200 hover:bg-transparent">
          <TableHead className="w-8"></TableHead>
          <TableHead className="font-semibold text-stone-700">Name</TableHead>
          <TableHead className="font-semibold text-stone-700">Type</TableHead>
          <TableHead className="font-semibold text-stone-700">Date</TableHead>
          <TableHead className="font-semibold text-stone-700">Read</TableHead>
          <TableHead className="font-semibold text-stone-700">Contacted</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => {
          const isExpanded = expandedId === message._id;
          return (
            <React.Fragment key={message._id}>
              <TableRow
                key={message._id}
                className={cn(
                  "cursor-pointer transition-colors",
                  isExpanded && "bg-stone-100"
                )}
                onClick={() => toggle(message._id)}
              >
                <TableCell className="w-8 py-2">
                  {isExpanded ? (
                    <CaretDown size={16} weight="bold" className="text-stone-600" />
                  ) : (
                    <CaretRight size={16} weight="bold" className="text-stone-400" />
                  )}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {message.name}
                </TableCell>
                <TableCell className="text-stone-600">
                  {getMessageTypeLabel(message.formType)}
                </TableCell>
                <TableCell className="text-stone-600">
                  {new Date(message.sentAt).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell className="text-stone-600">
                  {message.read ? "Yes" : "—"}
                </TableCell>
                <TableCell className="text-stone-600">
                  {message.contacted ? "Yes" : "—"}
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow key={`${message._id}-detail`} className="bg-stone-50">
                  <TableCell colSpan={6} className="p-4">
                    <MessageDetailContent
                      message={message}
                      fetchMessages={fetchMessages}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
