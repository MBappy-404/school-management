"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function ReportSection({
  title,
  description,
  action,
  className,
  children,
}: ReportSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("border-border/60", className)}>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
          </div>
          {action}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
