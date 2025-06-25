"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface JsonTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (id: string, value: string) => void;
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  placeholder?: string;
}

const JsonTextarea: React.FC<JsonTextareaProps> = ({
  id,
  name,
  value,
  onChange,
  onNameChange,
  onRemove,
  canRemove,
  placeholder = "Paste your JSON data here...",
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleNameSave = () => {
    onNameChange(id, tempName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="h-8 text-sm font-medium"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameSave();
                  if (e.key === "Escape") handleNameCancel();
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNameSave}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNameCancel}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">{name}</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingName(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] font-mono text-sm border-gray-300"
        />
      </CardContent>
    </Card>
  );
};

export default JsonTextarea;
