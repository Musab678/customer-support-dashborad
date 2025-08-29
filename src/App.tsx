import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://musab-workflow.app.n8n.cloud/webhook/b8351c28-27bd-4644-9c1e-c411d6433786/chat',
      initialMessages: [
        'Hi there! 👋',
        'How can I help you with your business dashboard today?'
      ],
      showWelcomeScreen: true,
      i18n: {
        en: {
          title: 'Dashboard Assistant 💼',
          subtitle: "Ask me anything about your business metrics!",
          footer: '',
          getStarted: 'Start Chat',
          inputPlaceholder: 'Ask about your dashboard...',
          closeButtonTooltip: 'Close chat',
        },
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
