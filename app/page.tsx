import CardDetail from "@/components/CardDetail";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import ActionButtons from "@/components/ActionButtons";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <Header />
          <ActionButtons />
          <CardDetail />
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
