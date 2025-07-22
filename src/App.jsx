import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";

// Pages
import Home from "@/components/pages/Home";
import Closet from "@/components/pages/Closet";
import Moodboards from "@/components/pages/Moodboards";
import MoodboardEditor from "@/components/pages/MoodboardEditor";
import Lookbook from "@/components/pages/Lookbook";
import Calendar from "@/components/pages/Calendar";

// Components
import NavigationTabs from "@/components/molecules/NavigationTabs";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-background to-surface">
        <AnimatePresence mode="wait">
<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="/quiz" element={<Home showQuizDirectly={true} />} />
            <Route path="/moodboards" element={<Moodboards />} />
            <Route path="/moodboard/:id" element={<MoodboardEditor />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </AnimatePresence>
        <NavigationTabs />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
          className="mt-4"
          toastClassName="shadow-xl"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;