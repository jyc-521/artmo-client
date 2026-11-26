export interface DataResponse<T> {
  data: T;
}
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type UserType = 'user' | 'admin';
export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  provider: string;
  userType: UserType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Artwork {
  id: number;
  source: 'met' | 'aic' | 'sponsor';
  title: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl: string;
  sourceUrl: string;
  emotionTags: string[];
  description: string;
  isPublicDomain: boolean;
  isVisible: boolean;
}

export interface Recommendation {
  id: string;
  inputText: string;
  emotionTags: string[];
  interpretation: string;
  sharedCount: number;
  createdAt: string;
  isMine: boolean;
  artwork: Artwork | null;
}

export type CreateRecommendationResult =
  | { needsMoreDetail: true; hint: string }
  | ({ needsMoreDetail: false; support?: SupportInfo } & Recommendation);

export interface Sponsorship {
  id: number;
  userId: string;
  title: string;
  artistName: string;
  imageUrl: string;
  description: string;
  licenseAgreed: boolean;
  goodsConsent: boolean;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt: string | null;
  createdAt: string;
}

export interface ProviderState {
  email: boolean;
  google: boolean;
  naver: boolean;
}

// 위기 신호 문장에 서버가 그림과 함께 보내는 도움받을 곳 (contact는 전화번호 또는 https 주소)
export interface SupportInfo {
  message: string;
  resources: SupportResource[];
}
export interface SupportResource {
  name: string;
  contact: string;
  detail: string;
}
