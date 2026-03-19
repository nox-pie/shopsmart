import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import About from './pages/About';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import Collection from './pages/Collection';
import FAQ from './pages/FAQ';
import Product from './pages/Product';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="font-sans text-primary">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
