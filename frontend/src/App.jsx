import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import ScrollProgress from "./components/common/ScrollProgress";
import WhatsAppFloat from "./components/common/WhatsAppFloat";
import LoadingScreen from "./components/common/LoadingScreen";
import { getProducts } from "./lib/api";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState("");

  const refreshProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError("");
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setProductsError(err?.message || "Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    void refreshProducts();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%"
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      const bar = document.getElementById("scroll-progress");
      if (bar) bar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productMap = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [products]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-4 pt-10 md:px-8">
        <Routes>
          <Route
            path="/"
            element={<HomePage products={products} productsError={productsError} productsLoading={productsLoading} />}
          />
          <Route
            path="/collections"
            element={<CollectionsPage products={products} productsError={productsError} productsLoading={productsLoading} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetailPage productMap={productMap} products={products} productsLoading={productsLoading} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/store-dashboard" element={<AdminProductsPage products={products} onProductsChange={refreshProducts} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <WhatsAppFloat />
      <Footer />
    </>
  );
};

export default App;
