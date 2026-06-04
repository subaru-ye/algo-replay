import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import ProblemList from "@/pages/ProblemList";
import ProblemForm from "@/pages/ProblemForm";

const App = () => (
  <HashRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/list" element={<ProblemList />} />
        <Route path="/add" element={<ProblemForm />} />
        <Route path="/edit/:id" element={<ProblemForm />} />
      </Routes>
    </Layout>
  </HashRouter>
);

export default App;
