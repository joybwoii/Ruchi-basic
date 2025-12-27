
import React, { useState, useEffect, useMemo } from 'react';
import { User, FoodSpot, Review, FoodType, GuideLevel } from './types';
import { COLORS, POINTS_RULES, LEVEL_THRESHOLDS, ICONS, KERALA_DISTRICTS } from './constants';
import Home from './pages/Home';
import SpotDetail from './pages/SpotDetail';
import AddSpot from './pages/AddSpot';
import Profile from './pages/Profile';
import AdminApproval from './pages/AdminApproval';
import SplashScreen from './pages/SplashScreen';
import Auth from './pages/Auth';
import { mockReviews, mockUser, mockAuthors } from './services/mockData';

type View = 'splash' | 'auth' | 'home' | 'favorites' | 'history' | 'profile' | 'add' | 'detail' | 'admin';

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
    // For production, normally we'd fetch from Firebase. 
    // Here we simulate a fresh login with just the email provided name.
    const nameFromEmail = email.split('@')[0];
    const user: User = {
      ...mockUser,
      email: email,
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      ruchiPoints: 0,
      totalReviews: 0,
      totalSpotsAdded: 0
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
      isAdmin: true // For demo purposes, every new user is an admin to see all pages
    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
              headers: { 'Accept-Language': 'en' }
            });
            const data = await response.json();
            const addr = data.address || {};
            const detectedDistrict = addr.state_district || addr.city || addr.county || '';
            
            const matchedDistrict = KERALA_DISTRICTS.find(d => 
              detectedDistrict.toLowerCase().includes(d.toLowerCase())
            );
            
            if (matchedDistrict) {
              setUserLocation(matchedDistrict);
            } else {
              setUserLocation('Ernakulam');
            }
          } catch (error) {
            console.error("Geocoding failed", error);
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          alert('Location access denied.');
        }
      );
    }
  };

  const calculateGuideLevel = (points: number): GuideLevel => {
    for (const threshold of LEVEL_THRESHOLDS) {
      if (points >= threshold.points) {
        return threshold.level as GuideLevel;
      }
    }
    return GuideLevel.NEW_EXPLORER;
  };

  const updateUserPoints = (pointsDelta: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      if (!prev) return null;
      const newPoints = prev.ruchiPoints + pointsDelta;
      return {
        ...prev,
        ruchiPoints: newPoints,
        guideLevel: calculateGuideLevel(newPoints)
      };
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToHistory = (id: string) => {
    setHistoryIds(prev => {
      const filtered = prev.filter(hid => hid !== id);
      return [id, ...filtered].slice(0, 20);
    });
  };

  const sortedAndFilteredSpots = useMemo(() => {
    return spots
      .filter(s => s.isApproved && s.district === userLocation)
      .sort((a, b) => b.createdAt - a.createdAt); // Fresher spots first
  }, [spots, userLocation]);

  const handleAddSpot = (newSpot: Omit<FoodSpot, 'spotId' | 'isApproved' | 'viewsCount' | 'likesCount' | 'avgRating' | 'reviewCount' | 'createdAt'>) => {
    const spot: FoodSpot = {
      ...newSpot,
      spotId: Math.random().toString(36).substr(2, 9),
      isApproved: false, 
      viewsCount: 0,
      likesCount: 0,
      avgRating: 0,
      reviewCount: 0,
      createdAt: Date.now(),
    };
    setSpots(prev => [spot, ...prev]);
    updateUserPoints(POINTS_RULES.ADD_SPOT);
    setCurrentView('profile');
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

    updateUserPoints(POINTS_RULES.ADD_REVIEW);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'splash':
        return <SplashScreen />;
      case 'auth':
        return <Auth onLogin={handleLogin} onSignUp={handleSignUp} />;
      case 'home':
        return (
          <Home 
            title={isLocating ? "Locating..." : `Flavors in ${userLocation}`}
            spots={sortedAndFilteredSpots} 
            onSelectSpot={(id) => { setSelectedSpotId(id); addToHistory(id); setCurrentView('detail'); }}
            location={isLocating ? "Locating..." : userLocation}
            onLocationRequest={requestLocation}
            onChangeLocation={(loc) => setUserLocation(loc)}
          />
        );
      case 'favorites':
        return (
          <Home 
            title="My Saved Gems"
            spots={spots.filter(s => favoriteIds.has(s.spotId))} 
            onSelectSpot={(id) => { setSelectedSpotId(id); addToHistory(id); setCurrentView('detail'); }}
            location={userLocation}
          />
        );
      case 'history':
        const historySpots = historyIds.map(hid => spots.find(s => s.spotId === hid)).filter(Boolean) as FoodSpot[];
        return (
          <Home 
            title="Recent Journeys"
            spots={historySpots} 
            onSelectSpot={(id) => { setSelectedSpotId(id); addToHistory(id); setCurrentView('detail'); }}
            location={userLocation}
          />
        );
      case 'detail':
        const spot = spots.find(s => s.spotId === selectedSpotId);
        if (!spot) return <Home spots={[]} onSelectSpot={() => {}} />;
        return (
          <SpotDetail 
            spot={spot} 
            isFavorite={favoriteIds.has(spot.spotId)}
            onToggleFavorite={() => toggleFavorite(spot.spotId)}
            reviews={reviews.filter(r => r.spotId === spot.spotId)}
            onBack={() => setCurrentView('home')}
            onAddReview={(r, c) => handleAddReview(spot.spotId, r, c)}
          />
        );
      case 'add':
        return (
          <AddSpot 
            onBack={() => setCurrentView('profile')} 
            onSubmit={handleAddSpot}
            userId={currentUser?.userId || ''}
          />
        );
      case 'profile':
        if (!currentUser) return <Auth onLogin={handleLogin} onSignUp={handleSignUp} />;
        return (
          <Profile 
            user={currentUser} 
            spots={spots.filter(s => s.addedBy === currentUser.userId)}
            reviews={reviews.filter(r => r.userId === currentUser.userId)}
            onNavigateAdmin={() => setCurrentView('admin')}
            onAddSpot={() => setCurrentView('add')}
            onUpdateProfile={updateProfile}
            onLogout={() => { setIsLoggedIn(false); setCurrentUser(null); setCurrentView('auth'); }}
          />
        );
      case 'admin':
        return (
          <AdminApproval 
            pendingSpots={spots.filter(s => !s.isApproved)} 
            onBack={() => setCurrentView('profile')}
            onApprove={(id) => {
               setSpots(prev => prev.map(s => s.spotId === id ? { ...s, isApproved: true } : s));
               updateUserPoints(POINTS_RULES.SPOT_APPROVED);
            }}
            onReject={(id) => setSpots(prev => prev.filter(s => s.spotId !== id))}
          />
        );
      default:
        return <Home spots={[]} onSelectSpot={() => {}} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button 
      onClick={() => {
        if (isLoggedIn) setCurrentView(view);
        else setCurrentView('auth');
      }}
      className={`flex flex-col items-center justify-center space-y-1 w-full py-4 transition-all duration-300 ${
        currentView === view || (view === 'home' && (currentView === 'detail' || currentView === 'add')) 
          ? 'text-[#065F46]' 
          : 'text-gray-400'
      }`}
    >
      <div className={`transition-transform duration-500 ${currentView === view ? 'scale-110' : 'scale-100'}`}>
        <Icon fill={currentView === view && (view === 'favorites') ? '#065F46' : 'none'} />
      </div>
      <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="app-container flex flex-col min-h-screen bg-white shadow-2xl overflow-hidden selection:bg-[#065F46] selection:text-white">
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[#FDF5E6] scrollbar-hide">
        {renderContent()}
      </main>

      {currentView !== 'splash' && currentView !== 'auth' && (
        <nav className="bg-white/95 backdrop-blur-lg border-t border-gray-100 flex items-center justify-around safe-area-inset-bottom z-50 px-2">
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
