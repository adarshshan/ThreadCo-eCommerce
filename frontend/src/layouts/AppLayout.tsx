import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useStore } from "../store/useStore";
import { useEffect } from "react";

const AppLayout = () => {
  const { setUser } = useStore();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") ?? "null");
    if (user) setUser(user);
    else setUser(null);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
