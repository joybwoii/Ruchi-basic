
import React, { useState, useRef } from 'react';
import { FoodSpot, Review, FoodType } from '../types';
import { ICONS, COLORS } from '../constants';

interface SpotDetailProps {
  spot: FoodSpot;
  reviews: Review[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onAddReview: (rating: number, comment: string) => void;
}

const SpotDetail: React.FC<SpotDetailProps> = ({ spot, reviews, isFavorite, onToggleFavorite, onBack, onAddReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fallback if no images are present
  const displayImages = spot.images.length > 0 ? spot.images : [`https://source.unsplash.com/featured/?kerala,food,${spot.speciality.split(' ')[0]}`];

  const handleSubmitReview = () => {
    if (comment.trim()) {
      onAddReview(rating, comment);
      setComment('');
      setRating(5);
      setShowReviewForm(false);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const index = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth);
      setActiveImgIndex(index);
    }
  };

  return (
    <div className="h-full bg-white pb-10 scrollbar-hide">
      {/* Header Image Carousel */}
      <div className="relative h-[480px]">
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-slate-100"
        >
          {displayImages.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-full h-full snap-start relative">
              <img src={img} alt={`${spot.name} - ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        {displayImages.length > 1 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {displayImages.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeImgIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>
        )}

        <button 
          onClick={onBack}
          className="absolute top-8 left-8 w-14 h-14 bg-white/95 backdrop-blur-md rounded-[24px] flex items-center justify-center shadow-2xl text-[#0F172A] active:scale-90 transition-transform border border-white/50 z-20"
        >
          <ICONS.ArrowLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={onToggleFavorite}
          className={`absolute top-8 right-8 w-14 h-14 bg-white/95 backdrop-blur-md rounded-[24px] flex items-center justify-center shadow-2xl active:scale-90 transition-all border border-white/50 z-20 ${isFavorite ? 'text-red-600' : 'text-slate-400'}`}
        >
          <ICONS.Favorites fill={isFavorite ? "currentColor" : "none"} className="w-7 h-7" />
        </button>
      </div>

      <div className="p-10 -mt-20 bg-white rounded-t-[64px] relative shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.15)] z-30">
        <div className="flex justify-between items-start mb-10">
          <div className="flex-1 pr-6">
            <div className="flex items-center flex-wrap gap-2 mb-4">
               {spot.foodTypes.map(t => (
                 <span key={t} className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-[#334155] shadow-sm">{t}</span>
               ))}
            </div>
            <h1 className="text-3xl font-black text-[#0F172A] leading-tight tracking-tight">{spot.name}</h1>
            <div className="flex items-center space-x-2 mt-4">
              <ICONS.Location className="w-5 h-5 text-[#065F46]" />
              <span className="text-sm text-[#4B5563] font-black">{spot.address}</span>
            </div>
          </div>
          <div className="bg-[#D97706] px-5 py-4 rounded-[32px] flex flex-col items-center min-w-[95px] shadow-2xl shadow-[#D97706]/20 border-4 border-white transform rotate-3">
            <span className="text-2xl font-black text-white">{spot.avgRating || 'New'}</span>
            <span className="text-[8px] font-black text-white/90 uppercase tracking-widest mt-1">Ruchi Scale</span>
          </div>
        </div>

        <div className="bg-green-50/70 p-8 rounded-[40px] border-2 border-green-100 flex items-center space-x-6 mb-12 shadow-sm">
            <div className="w-20 h-20 bg-[#065F46] rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-[#065F46]/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 18H2L6 3Z"/><path d="M12 3v18"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-[#065F46] uppercase tracking-[0.2em] mb-1.5">Chef's Signature</p>
              <p className="text-xl font-black text-[#0F172A] leading-tight">{spot.speciality}</p>
            </div>
        </div>

        <div className="mb-12">
          <h2 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.4em] mb-4">The Story</h2>
          <p className="text-[#334155] text-lg leading-relaxed font-bold opacity-90">
            {spot.description}
          </p>
        </div>

        {/* Gallery Preview if more than 1 image */}
        {displayImages.length > 1 && (
            <div className="mb-12">
                <h2 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.4em] mb-4">Full Gallery</h2>
                <div className="grid grid-cols-3 gap-3">
                    {displayImages.map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (carouselRef.current) {
                                carouselRef.current.scrollTo({
                                    left: idx * carouselRef.current.offsetWidth,
                                    behavior: 'smooth'
                                });
                            }
                          }}
                          className={`aspect-square rounded-3xl overflow-hidden border-4 transition-all active:scale-95 cursor-pointer ${activeImgIndex === idx ? 'border-[#065F46] shadow-xl' : 'border-slate-50 opacity-60'}`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`gallery-${idx}`} />
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="mb-24">
          <div className="flex items-center justify-between mb-10 border-b-2 border-slate-50 pb-6">
            <h2 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.4em]">Community Buzz</h2>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="text-[11px] font-black text-white uppercase tracking-widest bg-[#065F46] px-8 py-5 rounded-[24px] shadow-2xl shadow-[#065F46]/40 active:scale-95 transition-all"
            >
              Add Review
            </button>
          </div>

          <div className="space-y-8">
            {reviews.map(review => (
              <div key={review.reviewId} className="bg-slate-50/50 p-8 rounded-[48px] border-2 border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img src={review.userImage} alt={review.userName} className="w-16 h-16 rounded-[24px] shadow-xl ring-4 ring-white object-cover" />
                    <div>
                      <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-tight">{review.userName}</h4>
                      <div className="flex space-x-1 mt-1.5">
                        {[1,2,3,4,5].map(i => (
                          <ICONS.Star key={i} filled={i <= review.rating} className="w-4 h-4" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[9px] text-[#64748B] font-black uppercase tracking-widest">Verified Explorer</span>
                  </div>
                </div>
                <p className="text-lg text-[#334155] leading-relaxed font-bold">"{review.comment}"</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="py-24 text-center border-4 border-dashed border-slate-50 rounded-[56px] bg-slate-50/20">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em]">Be the first to share a story</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[420px] rounded-[64px] p-12 animate-in slide-in-from-bottom duration-400 mb-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Write a Review</h3>
              <button onClick={() => setShowReviewForm(false)} className="text-slate-300 active:scale-90 transition-transform p-3 bg-slate-50 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.25em] mb-8 text-center">Rate the Experience</p>
            <div className="flex space-x-5 mb-14 justify-center">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)} className="active:scale-125 transition-transform duration-200 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill={i <= rating ? '#D97706' : "none"} stroke={i <= rating ? '#D97706' : "#E2E8F0"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              ))}
            </div>

            <textarea 
              rows={5}
              placeholder="What made this dish special? Tell the community..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[40px] p-8 text-lg focus:ring-8 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none mb-12 font-bold text-[#0F172A] transition-all placeholder:text-slate-300 shadow-inner resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button 
              onClick={handleSubmitReview}
              className="w-full bg-[#065F46] text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-[#065F46]/40 active:scale-95 transition-all uppercase tracking-[0.2em]"
            >
              Share Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotDetail;
