export interface BusinessCardLink {
  id: number;
  title: string;
  url: string;
  linkType?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface BusinessCard {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
  themeId?: number;
  themeName?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  qrCode?: string;
  links: BusinessCardLink[];
}

export interface CreateBusinessCard {
  title: string;
  description: string;
  phone: string;
  email: string;
  themeId: number | null;
  links: CreateBusinessCardLink[];
}

export interface CreateBusinessCardLink {
  title: string;
  url: string;
  linkType: string;
  displayOrder: number;
  isActive: boolean;
}