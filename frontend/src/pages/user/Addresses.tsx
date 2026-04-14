import React, { useState, useEffect } from "react";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/api";
import type { Address } from "../../types/User";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import CustomModal from "../../components/Modal";
import { cn } from "../../utils/cn";

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (_error) {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress?._id) {
        const data = await updateAddress(editingAddress._id, formData);
        if (data.success) {
          toast.success("Address updated successfully");
          setAddresses(data.addresses);
        }
      } else {
        const data = await addAddress(formData);
        if (data.success) {
          toast.success("Address added successfully");
          setAddresses(data.addresses);
        }
      }
      setIsModalOpen(false);
    } catch (_error) {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const data = await deleteAddress(id);
        if (data.success) {
          toast.success("Address deleted successfully");
          setAddresses(data.addresses);
        }
      } catch (_error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const data = await setDefaultAddress(id);
      if (data.success) {
        toast.success("Default address updated");
        setAddresses(data.addresses);
      }
    } catch (_error) {
      toast.error("Failed to update default address");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-text-primary mb-2">
              My Addresses
            </h1>
            <p className="text-text-secondary text-sm md:text-base">
              Manage your saved delivery addresses for a faster checkout
              experience.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-text-inverse rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-accent/20"
          >
            <AddIcon fontSize="small" />
            Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-surface p-12 rounded-3xl border border-border text-center shadow-sm">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
              <HomeIcon
                sx={{ fontSize: 40, color: "var(--color-text-muted)" }}
              />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              No Saved Addresses
            </h2>
            <p className="text-text-secondary mb-8 max-w-sm mx-auto">
              You haven't added any delivery addresses yet. Add your first one
              to get started.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="px-8 py-3 bg-accent text-text-inverse rounded-xl font-bold transition-all hover:opacity-90 shadow-lg shadow-accent/20"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={cn(
                  "group relative bg-surface p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl",
                  address.isDefault
                    ? "border-accent ring-1 ring-accent/20"
                    : "border-border hover:border-accent/50",
                )}
              >
                {address.isDefault && (
                  <div className="absolute top-4 right-4 text-accent">
                    <CheckCircleIcon fontSize="small" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4 pr-8">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-text-primary capitalize truncate max-w-[150px]">
                      {address.fullName}
                    </h3>
                    {address.isDefault && (
                      <span className="inline-block px-2 py-0.5 bg-accent/10 text-accent text-[10px] uppercase font-bold tracking-wider rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-sm text-text-secondary mb-8 min-h-[100px]">
                  <p className="line-clamp-1">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="line-clamp-1">{address.addressLine2}</p>
                  )}
                  <p>
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="pt-2 font-medium text-text-primary">
                    Phone: {address.phone}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(address)}
                      className="p-2 bg-background hover:bg-surface-hover text-text-secondary hover:text-accent rounded-lg transition-all"
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id!)}
                      className="p-2 bg-background hover:bg-surface-hover text-text-secondary hover:text-error rounded-lg transition-all"
                      title="Delete"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id!)}
                      className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      >
        <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="1234567890"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Address Line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
                placeholder="Street address, P.O. box, company name"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Apartment, suite, unit, building, floor, etc."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                  Pincode
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  maxLength={6}
                  pattern="\d{6}"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="w-5 h-5 accent-accent border-border rounded-lg cursor-pointer transition-all"
              />
              <label
                htmlFor="isDefault"
                className="text-sm text-text-secondary cursor-pointer select-none"
              >
                Set as default delivery address
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 sticky bottom-0 bg-surface">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold text-text-secondary hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] px-6 py-3.5 rounded-xl font-bold bg-accent text-text-inverse shadow-lg shadow-accent/20 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                {editingAddress ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      </CustomModal>
    </div>
  );
};

export default Addresses;
