import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Footer() {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg">How to Use</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-foreground mb-2">
              Getting Started:
            </h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Paste JSON data into the textarea fields</li>
              <li>Click the edit icon to rename datasets</li>
              <li>
                Add more datasets using the &quot;Add Dataset&quot; button
              </li>
              <li>Try the sample data to see how it works</li>
              <li>Remove datasets you don&apos;t need</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Chart Focus:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Chart shows only &quot;Balance&quot; and &quot;Raw XP Gain&quot;
                metrics
              </li>
              <li>Values are formatted with commas (e.g., 1,000)</li>
              <li>Custom dataset names appear in the legend</li>
              <li>Best results with similar data structures</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
