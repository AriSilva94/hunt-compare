import { ChartColumnStacked } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <ChartColumnStacked className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
          JSON Hunt Compare
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Easily upload and compare multiple Hunt Analyzer JSON files. Visualize
        your hunting sessions with interactive charts — perfect for tracking
        performance, loot, damage, and more
      </p>
    </div>
  );
}
