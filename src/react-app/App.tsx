import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import ContentStudio from "@/react-app/pages/ContentStudio";
import Editor from "@/react-app/pages/Editor";
import Calendar from "@/react-app/pages/Calendar";
import Pricing from "@/react-app/pages/Pricing";
import PostSuggestions from "@/react-app/pages/PostSuggestions";
import BrandKit from "@/react-app/pages/BrandKit";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/content-studio" element={<ContentStudio />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/post-suggestions" element={<PostSuggestions />} />
        <Route path="/brand-kit" element={<BrandKit />} />
      </Routes>
    </Router>
  );
}
