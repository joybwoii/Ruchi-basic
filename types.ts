
export enum FoodType {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg',
  SEAFOOD = 'Seafood',
  TEA_SNACKS = 'Tea and Snacks',
  COOL_DRINKS = 'Cool Drinks'
}

export enum GuideLevel {
  NEW_EXPLORER = 'New Explorer',
  LOCAL_FOODIE = 'Local Foodie',
  TASTE_GUIDE = 'Taste Guide',
  RUCHI_EXPERT = 'Ruchi Expert',
  MASTER_FOOD_GUIDE = 'Master Food Guide'
}

export interface SocialLink {
  platform: 'Instagram' | 'Facebook' | 'Twitter' | 'YouTube' | 'Website';
  url: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  profileImage: string;
  ruchiPoints: number;
  guideLevel: GuideLevel;
  totalReviews: number;
  totalSpotsAdded: number;
  createdAt: number;
  isAdmin?: boolean;
  socialLinks?: SocialLink[];
}

export interface FoodSpot {
  spotId: string;
  name: string;
  description: string;
  speciality: string;
  foodTypes: FoodType[];
  location: {
    lat: number;
    lng: number;
  };
  district: string;
  area: string;
  address: string;
  images: string[];
  addedBy: string; // User ID
  isApproved: boolean;
  viewsCount: number;
  likesCount: number;
  avgRating: number;
  reviewCount: number;
  createdAt: number;
  mapLink?: string; // Optional Google Maps link
}

export interface Review {
  reviewId: string;
  spotId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  createdAt: number;
}
