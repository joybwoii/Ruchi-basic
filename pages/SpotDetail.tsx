
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
  const [showGallery, setShowGallery] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const displayImages = spot.images && spot.images.length > 0 
    ? spot.images 
    : [`https://images.unsplash.com/photo-1596797038530-2c39bb056bc7?auto=format&fit=crop&w=800&q=80&sig=${spot.speciality.split(' ')[0]}`];

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

  const openMap = () => {
    if (spot.mapLink) {
      window.open(spot.mapLink, '_blank');
    }
  };

  return (
    <div className="h-full bg-white pb-10 scrollbar-hide relative">
      {/* Header Image Carousel */}
      <div className="relative h-[400px]">
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-slate-100"
        >
          {displayImages.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-full h-full snap-start relative" onClick={() => setShowGallery(true)}>
              <img src={img} alt={`${spot.name} - ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>
          ))}
        </div>

        {displayImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 bg-black/10 backdrop-blur-md px-2 py-1 rounded-full">
                {displayImages.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1 rounded-full transition-all duration-300 ${activeImgIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
                    />
                ))}
            </div>
        )}

        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg text-[#0F172A] active:scale-90 transition-transform z-20"
        >
          <ICONS.ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={onToggleFavorite}
          className={`absolute top-6 right-6 w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all z-20 ${isFavorite ? 'text-red-600' : 'text-slate-400'}`}
        >
          <ICONS.Favorites fill={isFavorite ? "currentColor" : "none"} className="w-5 h-5" />
        </button>
      </div>

      <div className="p-8 -mt-16 bg-white rounded-t-[48px] relative shadow-2xl z-30">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <div className="flex items-center flex-wrap gap-1.5 mb-3">
               {spot.foodTypes.map(t => (
                 <span key={t} className="text-[7px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[#334155]">{t}</span>
               ))}
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] leading-tight tracking-tight">{spot.name}</h1>
            <div className="flex items-center space-x-2 mt-2 opacity-60">
              <ICONS.Location className="w-3.5 h-3.5 text-[#065F46]" />
              <span className="text-[10px] text-[#4B5563] font-black">{spot.address}</span>
            </div>
          </div>
          <div className="bg-[#D97706] px-3 py-2 rounded-2xl flex flex-col items-center min-w-[65px] shadow-lg border-2 border-white transform rotate-2">
            <span className="text-lg font-black text-white">{spot.avgRating || 'New'}</span>
            <span className="text-[6px] font-black text-white/80 uppercase tracking-widest mt-0.5">Rating</span>
          </div>
        </div>

        {spot.mapLink && (
            <button 
                onClick={openMap}
                className="w-full mb-6 bg-[#065F46] text-white py-3.5 rounded-2xl font-black text-[10px] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
                <ICONS.Location className="w-4 h-4" />
                VIEW ON MAP
            </button>
        )}

        <div className="bg-green-50/50 p-5 rounded-[32px] border border-green-100 flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-[#065F46] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 18H2L6 3Z"/><path d="M12 3v18"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black text-[#065F46] uppercase tracking-widest mb-0.5">Speciality</p>
              <p className="text-sm font-black text-[#0F172A] leading-tight">{spot.speciality}</p>
            </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[8px] font-black text-[#64748B] uppercase tracking-widest mb-2">The Story</h2>
          <p className="text-[#334155] text-xs leading-relaxed font-bold opacity-80">
            {spot.description}
          </p>
        </div>

        <div className="mb-20">
          <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
            <h2 className="text-[8px] font-black text-[#64748B] uppercase tracking-widest">Reviews</h2>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="text-[9px] font-black text-white uppercase tracking-widest bg-[#065F46] px-5 py-3 rounded-xl shadow-md active:scale-95"
            >
              Add
            </button>
          </div>

          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.reviewId} className="bg-slate-50/30 p-5 rounded-[24px] border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img src={review.userImage} alt={review.userName} className="w-10 h-10 rounded-xl shadow-md object-cover" />
                    <div>
                      <h4 className="text-[9px] font-black text-[#0F172A] uppercase">{review.userName}</h4>
                      <div className="flex space-x-0.5 mt-0.5">
                        {[1,2,3,4,5].map(i => (
                          <ICONS.Star key={i} filled={i <= review.rating} className="w-2.5 h-2.5" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed font-bold">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-[420px] rounded-[40px] p-8 animate-in slide-in-from-bottom shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#0F172A]">Rate Spot</h3>
              <button onClick={() => setShowReviewForm(false)} className="text-slate-300 p-2 bg-slate-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="flex space-x-3 mb-8 justify-center">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)} className="active:scale-125 transition-transform p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={i <= rating ? '#D97706' : "none"} stroke={i <= rating ? '#D97706' : "#E2E8F0"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              ))}
            </div>
            <textarea 
              rows={4}
              placeholder="Tell others about the food..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[20px] p-4 text-sm font-bold text-[#0F172A] focus:border-[#065F46] outline-none mb-6 shadow-inner resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button 
              onClick={handleSubmitReview}
              className="w-full bg-[#065F46] text-white py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 uppercase tracking-widest"
            >
              Post Review
            </button>
          </div>
        </div>
      )}

      {showGallery && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
              <button 
                onClick={() => setShowGallery(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white z-[110]"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <img src={displayImages[activeImgIndex]} alt="Gallery" className="max-w-full max-h-[70vh] object-contain" />
                <div className="mt-8 flex gap-2 overflow-x-auto p-4 w-full justify-center scrollbar-hide">
                    {displayImages.map((img, i) => (
                        <div key={i} onClick={() => setActiveImgIndex(i)} className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImgIndex === i ? 'border-[#065F46] scale-105' : 'border-white/10 opacity-50'}`}>
                            <img src={img} className="w-full h-full object-cover" alt={`t ${i}`} />
                        </div>
                    ))}
                </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SpotDetail;
