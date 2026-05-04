import {
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import Collection from './pages/Collection';
import CollectionArchive from './pages/CollectionArchive';
import FAQ from './pages/FAQ';
import Product from './pages/Product';
import Profile from './pages/Profile';

function AppShell() {
  const location = useLocation();
  const showFooter = location.pathname !== '/';

  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/archive" element={<CollectionArchive />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </div>
      {showFooter ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <div className="font-sans text-primary">
      <Router>
        <AppShell />
      </Router>
    </div>
  );
}

export default App;
