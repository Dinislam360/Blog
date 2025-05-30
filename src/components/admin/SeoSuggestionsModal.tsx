
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SeoSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: string[];
  headings: string[];
  onSelectTitle?: (title: string) => void;
  onSelectHeading?: (heading: string) => void; // Could be useful if headings are part of a structured editor
}

export function SeoSuggestionsModal({
  isOpen,
  onClose,
  titles,
  headings,
  onSelectTitle,
}: SeoSuggestionsModalProps) {
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, type: 'title' | 'heading', index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      const key = `${type}-${index}`;
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast({ title: "Copied to clipboard!", description: `${type.charAt(0).toUpperCase() + type.slice(1)} copied.` });
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
      toast({ title: "Copy failed", description: "Could not copy text to clipboard.", variant: "destructive" });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AI SEO Suggestions</DialogTitle>
          <DialogDescription>
            Here are some AI-generated alternative titles and headings to improve your post's SEO and readability.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="grid gap-6 py-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Alternative Titles</h3>
              {titles.length > 0 ? (
                <ul className="space-y-2">
                  {titles.map((title, index) => (
                    <li key={`title-${index}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="flex-1 mr-2">{title}</span>
                      <div className="flex items-center gap-2">
                        {onSelectTitle && (
                           <Button variant="outline" size="sm" onClick={() => onSelectTitle(title)}>
                             Use Title
                           </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(title, 'title', index)} title="Copy title">
                          {copiedStates[`title-${index}`] ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No alternative titles generated.</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Alternative Headings</h3>
              {headings.length > 0 ? (
                <ul className="space-y-2">
                  {headings.map((heading, index) => (
                    <li key={`heading-${index}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <span className="flex-1 mr-2">{heading}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(heading, 'heading', index)} title="Copy heading">
                        {copiedStates[`heading-${index}`] ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No alternative headings generated.</p>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
