import { create } from "zustand"

interface UIStore {
  productFormOpen: boolean
  editingProductId: string | null
  openCreate: () => void
  openEdit: (id: string) => void
  closeForm: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  productFormOpen: false,
  editingProductId: null,
  openCreate: () => set({ productFormOpen: true, editingProductId: null }),
  openEdit: (id) => set({ productFormOpen: true, editingProductId: id }),
  closeForm: () => set({ productFormOpen: false, editingProductId: null }),
}))
