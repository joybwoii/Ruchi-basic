
import { User, FoodSpot, Review, FoodType, GuideLevel } from '../types';

export const mockUser: User = {
  userId: 'user_fresh',
  name: 'New Explorer',
  email: '',
  profileImage: 'https://ui-avatars.com/api/?name=Explorer&background=065F46&color=fff',
  ruchiPoints: 0,
  guideLevel: GuideLevel.NEW_EXPLORER,
  totalReviews: 0,
  totalSpotsAdded: 0,
  createdAt: Date.now(),
  isAdmin: true,
  socialLinks: []
};

export const mockAuthors: Record<string, { points: number, level: GuideLevel }> = {};

export const mockFoodSpots: FoodSpot[] = [];

export const mockReviews: Review[] = [];
