import { create } from 'zustand';
import type { TemplateId } from '@/types/template';

interface TemplateStore {
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templateId: 'classic',
  setTemplateId: (id) => set({ templateId: id }),
}));
