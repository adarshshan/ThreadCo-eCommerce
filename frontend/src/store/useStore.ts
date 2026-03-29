import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/User";
import type { CartItem } from "../types/Cart";
import type { Product } from "../types/Product";
import * as api from "../services/api";

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  logout: () => void;
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string | number, size?: string, color?: string) => void;
  updateQuantity: (productId: string | number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;

  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      isModalOpen: false,
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      logout: () => {
        set({ user: null, cart: [], wishlist: [] });
        localStorage.removeItem("user");
      },

      cart: [],
      addToCart: (product, quantity = 1, size, color) => {
        const currentCart = get().cart;
        // Check if item exists with same ID, Size AND Color
        const existingItemIndex = currentCart.findIndex(
          (item) => item._id === product._id && item.selectedSize === size && item.selectedColor === color
        );

        if (existingItemIndex > -1) {
          const newCart = [...currentCart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + quantity
          };
          set({ cart: newCart });
        } else {
          set({
            cart: [...currentCart, { ...product, quantity, selectedSize: size, selectedColor: color } as CartItem],
          });
        }
      },
      removeFromCart: (productId, size, color) =>
        set({ 
          cart: get().cart.filter((item) => 
            !(item._id === productId && item.selectedSize === size && item.selectedColor === color)
          ) 
        }),
      updateQuantity: (productId, quantity, size, color) =>
        set({
          cart: get().cart.map((item) =>
            item._id === productId && item.selectedSize === size && item.selectedColor === color 
              ? { ...item, quantity } 
              : item
          ),
        }),
      clearCart: () => set({ cart: [] }),

      wishlist: [],
      fetchWishlist: async () => {
        if (!get().user) return;
        try {
          const { wishlist } = await api.getWishlist();
          set({ wishlist });
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      },
      addToWishlist: async (product) => {
        const currentWishlist = get().wishlist;
        if (!currentWishlist.find((item) => item._id === product._id)) {
          if (get().user) {
            try {
              const { wishlist } = await api.addToWishlist(product._id as string);
              set({ wishlist });
            } catch (error) {
              console.error("Error adding to wishlist:", error);
            }
          } else {
            set({ wishlist: [...currentWishlist, product] });
          }
        }
      },
      removeFromWishlist: async (productId) => {
        if (get().user) {
          try {
            const { wishlist } = await api.removeFromWishlist(
              productId as string,
            );
            set({ wishlist });
          } catch (error) {
            console.error("Error removing from wishlist:", error);
          }
        } else {
          set({
            wishlist: get().wishlist.filter((item) => item._id !== productId),
          });
        }
      },

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "kids-own-storage",
      onRehydrateStorage: (state) => {
        return () => state?.setHasHydrated(true);
      },
      partialize: (state) => ({ 
        user: state.user, 
        cart: state.cart, 
        wishlist: state.wishlist 
      }),
    }
  )
);
