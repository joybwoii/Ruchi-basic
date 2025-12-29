
import React, { useState, useEffect, useMemo } from 'react';
import { User, FoodSpot, Review, FoodType, GuideLevel } from './types';
import { COLORS, POINTS_RULES, LEVEL_THRESHOLDS, ICONS, KERALA_DISTRICTS } from './constants';
import Home from './pages/Home';
import SpotDetail from './pages/SpotDetail';
import AddSpot from './pages/AddSpot';
import Profile from './pages/Profile';
import SplashScreen from './pages/SplashScreen';
import Auth from './pages/Auth';
import ChatBot from './pages/ChatBot';
import AdminApproval from './pages/AdminApproval';

type View = 'splash' | 'auth' | 'home' | 'favorites' | 'history' | 'profile' | 'add' | 'detail' | 'chat' | 'admin';

const DISTRICT_ALIASES: Record<string, string> = {
  'trivandrum': 'Thiruvananthapuram',
  'alleppey': 'Alappuzha',
  'quilon': 'Kollam',
  'trichur': 'Thrissur',
  'palghat': 'Palakkad',
  'calicut': 'Kozhikode',
  'cochin': 'Ernakulam',
  'cannannore': 'Kannur'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('splash');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [spots, setSpots] = useState<FoodSpot[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState('Ernakulam'); 
  const [isLocating, setIsLocating] = useState(false);
  
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [historyIds, setHistoryIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        setCurrentView('home');
      } else {
        setCurrentView('auth');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const handleLogin = (email: string, pass: string) => {
    const isAdmin = email === 'adminrs2026@gmail.com' && pass === 'rusps@main';
    const nameFromEmail = email.split('@')[0];
    
    const user: User = {
      userId: 'user_' + Math.random().toString(36).substr(2, 5),
      name: isAdmin ? 'Ruchi Admin' : (nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)),
      email: email,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(isAdmin ? 'Admin' : nameFromEmail)}&background=065F46&color=fff`,
      ruchiPoints: isAdmin ? 9999 : 0,
      guideLevel: isAdmin ? GuideLevel.MASTER_FOOD_GUIDE : GuideLevel.NEW_EXPLORER,
      totalReviews: 0,
      totalSpotsAdded: 0,
      createdAt: Date.now(),
      socialLinks: [],
      isAdmin: isAdmin 
    };
    
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleSignUp = (name: string, email: string, pass: string) => {
    const newUser: User = {
      userId: 'user_' + Math.random().toString(36).substr(2, 5),
      name,
      email,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=065F46&color=fff`,
      ruchiPoints: 0,
      guideLevel: GuideLevel.NEW_EXPLORER,
      totalReviews: 0,
      totalSpotsAdded: 0,
      createdAt: Date.now(),
      socialLinks: [],
      isAdmin: false 
    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
            headers: { 'Accept-Language': 'en', 'User-Agent': 'RuchiSpots/1.2' }
          });
          
          if (!response.ok) throw new Error('Geocoding service unavailable');
          
          const data = await response.json();
          const addr = data.address || {};
          
          // Collect all potential district-related fields
          const candidates = [
            addr.state_district,
            addr.county,
            addr.district,
            addr.city,
            addr.town,
            addr.village
          ].filter(Boolean).map(v => String(v).toLowerCase());

          let matchedDistrict = '';
          
          // Try to match against the canonical list or aliases
          outer: for (const cand of candidates) {
            // Check direct match
            const directMatch = KERALA_DISTRICTS.find(d => 
              cand.includes(d.toLowerCase()) || d.toLowerCase().includes(cand)
            );
            if (directMatch) {
              matchedDistrict = directMatch;
              break;
            }
            
            // Check aliases
            for (const [alias, canonical] of Object.entries(DISTRICT_ALIASES)) {
              if (cand.includes(alias)) {
                matchedDistrict = canonical;
                break outer;
              }
            }
          }

          if (matchedDistrict) {
            setUserLocation(matchedDistrict);
          } else {
            console.log('Address components:', addr);
            alert(`Detected: ${candidates[0] || 'Unknown'}. Please select your Kerala district manually.`);
          }
        } catch (error) {
          console.error("Geocoding failed", error);
          alert('Could not determine your district. Please select manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        const msgs: Record<number, string> = {
          1: 'Location permission denied.',
          2: 'Location position unavailable.',
          3: 'Location request timed out.'
        };
        alert(msgs[error.code] || 'Could not access location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const calculateGuideLevel = (points: number): GuideLevel => {
    const sortedThresholds = [...LEVEL_THRESHOLDS].sort((a, b) => b.points - a.points);
    for (const threshold of sortedThresholds) {
      if (points >= threshold.points) return threshold.level as GuideLevel;
    }
    return GuideLevel.NEW_EXPLORER;
  };

  const updateUserPoints = (userId: string, pointsDelta: number) => {
    if (currentUser && currentUser.userId === userId) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const newPoints = prev.ruchiPoints + pointsDelta;
        return {
          ...prev,
          ruchiPoints: newPoints,
          guideLevel: calculateGuideLevel(newPoints)
        };
      });
    }
  };

  const sortedAndFilteredSpots = useMemo(() => {
    return spots
      .filter(s => s.isApproved && s.district === userLocation)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [spots, userLocation]);

  const handleAddSpot = (newSpot: Omit<FoodSpot, 'spotId' | 'isApproved' | 'viewsCount' | 'likesCount' | 'avgRating' | 'reviewCount' | 'createdAt'>) => {
    const spot: FoodSpot = {
      ...newSpot,
      spotId: Math.random().toString(36).substr(2, 9),
      isApproved: false, // Default to pending
      viewsCount: 0,
      likesCount: 0,
      avgRating: 0,
      reviewCount: 0,
      createdAt: Date.now(),
    };
    setSpots(prev => [spot, ...prev]);
    setCurrentView('home');
    alert("Spot submitted! It will appear after Admin review.");
  };

  const handleApproveSpot = (id: string) => {
    const spot = spots.find(s => s.spotId === id);
    if (spot) {
      setSpots(prev => prev.map(s => s.spotId === id ? { ...s, isApproved: true } : s));
      updateUserPoints(spot.addedBy, POINTS_RULES.ADD_SPOT);
    }
  };

  const handleDeleteSpot = (id: string) => {
    setSpots(prev => prev.filter(s => s.spotId !== id));
  };

  const handleAddReview = (spotId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      reviewId: Math.random().toString(36).substr(2, 9),
      spotId,
      userId: currentUser.userId,
      userName: currentUser.name,
      userImage: currentUser.profileImage,
      rating,
      comment,
      createdAt: Date.now(),
    };
    setReviews(prev => [newReview, ...prev]);
    setSpots(prev => prev.map(s => {
      if (s.spotId === spotId) {
        const newCount = s.reviewCount + 1;
        const newAvg = (s.avgRating * s.reviewCount + rating) / newCount;
        return { ...s, reviewCount: newCount, avgRating: Number(newAvg.toFixed(1)) };
      }
      return s;
    }));
    updateUserPoints(currentUser.userId, POINTS_RULES.ADD_REVIEW);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'splash': return <SplashScreen />;
      case 'auth': return <Auth onLogin={handleLogin} onSignUp={handleSignUp} />;
      case 'admin':
        return (
          <AdminApproval 
            pendingSpots={spots.filter(s => !s.isApproved)} 
            onBack={() => setCurrentView('profile')}
            onApprove={handleApproveSpot}
            onReject={handleDeleteSpot}
          />
        );
      case 'home':
        return (
          <Home 
            title={isLocating ? "Finding your district..." : `Flavors in ${userLocation}`}
            spots={sortedAndFilteredSpots} 
            onSelectSpot={(id) => { setSelectedSpotId(id); setCurrentView('detail'); }}
            location={isLocating ? "Locating..." : userLocation}
            onLocationRequest={requestLocation}
            onChangeLocation={(loc) => setUserLocation(loc)}
            onOpenChat={() => setCurrentView('chat')}
          />
        );
      case 'chat': return <ChatBot onBack={() => setCurrentView('home')} />;
      case 'favorites':
        return (
          <Home 
            title="Saved Gems"
            spots={spots.filter(s => favoriteIds.has(s.spotId) && s.isApproved)} 
            onSelectSpot={(id) => { setSelectedSpotId(id); setCurrentView('detail'); }}
            location={userLocation}
            onOpenChat={() => setCurrentView('chat')}
          />
        );
      case 'history':
        return (
          <Home 
            title="Recently Viewed"
            spots={historyIds.map(hid => spots.find(s => s.spotId === hid)).filter(s => s && s.isApproved) as FoodSpot[]} 
            onSelectSpot={(id) => { setSelectedSpotId(id); setCurrentView('detail'); }}
            location={userLocation}
            onOpenChat={() => setCurrentView('chat')}
          />
        );
      case 'detail':
        const spot = spots.find(s => s.spotId === selectedSpotId);
        if (!spot) return null;
        return (
          <SpotDetail 
            spot={spot} 
            isFavorite={favoriteIds.has(spot.spotId)}
            onToggleFavorite={() => setFavoriteIds(prev => {
                const next = new Set(prev);
                if (next.has(spot.spotId)) next.delete(spot.spotId);
                else next.add(spot.spotId);
                return next;
            })}
            reviews={reviews.filter(r => r.spotId === spot.spotId)}
            onBack={() => setCurrentView('home')}
            onAddReview={(r, c) => handleAddReview(spot.spotId, r, c)}
          />
        );
      case 'add': return <AddSpot onBack={() => setCurrentView('home')} onSubmit={handleAddSpot} userId={currentUser?.userId || ''} />;
      case 'profile':
        if (!currentUser) return <Auth onLogin={handleLogin} onSignUp={handleSignUp} />;
        return (
          <Profile 
            user={currentUser} 
            spots={spots.filter(s => s.addedBy === currentUser.userId)}
            reviews={reviews.filter(r => r.userId === currentUser.userId)}
            onAddSpot={() => setCurrentView('add')}
            onUpdateProfile={(upd) => setCurrentUser(prev => prev ? ({...prev, ...upd}) : null)}
            onLogout={() => { setIsLoggedIn(false); setCurrentUser(null); setCurrentView('auth'); }}
            onNavigateAdmin={() => setCurrentView('admin')}
          />
        );
      default: return null;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button 
      onClick={() => { if (isLoggedIn) setCurrentView(view); }}
      className={`flex flex-col items-center justify-center space-y-0.5 w-full py-3 transition-all duration-300 ${
        currentView === view || (view === 'home' && (currentView === 'detail' || currentView === 'add' || currentView === 'chat')) 
          ? 'text-[#065F46]' 
          : 'text-gray-400'
      }`}
    >
      <Icon className="w-4.5 h-4.5" fill={currentView === view && (view === 'favorites') ? '#065F46' : 'none'} />
      <span className="text-[7.5px] font-black uppercase tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="app-container flex flex-col min-h-screen bg-white shadow-2xl overflow-hidden selection:bg-[#065F46] selection:text-white">
      <main className="flex-1 overflow-y-auto relative bg-[#FDF5E6] scrollbar-hide">
        {renderContent()}
      </main>
      {isLoggedIn && currentView !== 'auth' && currentView !== 'splash' && (
        <nav className="bg-white/95 backdrop-blur-lg border-t border-gray-100 flex items-center justify-around safe-area-inset-bottom z-50 px-1">
          <NavItem view="home" icon={ICONS.Home} label="Explore" />
          <NavItem view="favorites" icon={ICONS.Favorites} label="Gems" />
          <NavItem view="history" icon={ICONS.History} label="History" />
          <NavItem view="profile" icon={ICONS.Profile} label="Profile" />
        </nav>
      )}
    </div>
  );
};

export default App;
