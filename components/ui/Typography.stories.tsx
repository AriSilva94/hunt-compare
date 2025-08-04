import { Typography } from "./Typography";

const meta = {
  title: "Components/Typography",
  component: Typography,
};

export default meta;

export function TypographyExample() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <Typography variant="h1">
          Heading 1 - Main Title
        </Typography>
        <Typography variant="h2">
          Heading 2 - Section Title
        </Typography>
        <Typography variant="h3">
          Heading 3 - Subsection Title
        </Typography>
        <Typography variant="h4">
          Heading 4 - Minor Title
        </Typography>
      </div>

      <div className="space-y-3">
        <Typography variant="lead">
          This is a lead paragraph that stands out from regular text.
        </Typography>
        <Typography variant="p">
          This is regular paragraph text. It should be readable and comfortable for long-form content. The typography component handles dark mode automatically.
        </Typography>
        <Typography variant="small">
          This is small text for secondary information.
        </Typography>
        <Typography variant="caption">
          This is caption text for image descriptions or footnotes.
        </Typography>
        <Typography variant="muted">
          This is muted text for less important information.
        </Typography>
      </div>

      <div className="border-t pt-6">
        <Typography variant="h3" className="mb-4">
          Custom Styling Example
        </Typography>
        <Typography variant="p" className="text-blue-600 dark:text-blue-400 font-semibold">
          You can override styles with custom classes while maintaining dark mode support.
        </Typography>
      </div>

      <div className="border-t pt-6">
        <Typography variant="h3" className="mb-4">
          Different HTML Elements
        </Typography>
        <Typography variant="h2" as="div" className="mb-2">
          H2 styling as div element
        </Typography>
        <Typography variant="p" as="span">
          Paragraph styling as span element
        </Typography>
      </div>
    </div>
  );
}