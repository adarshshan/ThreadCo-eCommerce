import Sidebar from "../components/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
