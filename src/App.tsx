import Home from "./pages/Home";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

function App() {
  return (
    <TooltipProvider>
      <Toaster theme="dark" position="bottom-right" />
      <Home />
   </TooltipProvider>
  );
}

export default App;
