import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScholarshipList } from './components/ScholarshipList';
import { EssayAssistant } from './components/EssayAssistant';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { Tutorials } from './components/Tutorials/Tutorials';
import { AuthProvider, useAuth } from './context/AuthContext';
import { searchScholarships } from './services/scholarshipApi';
import { setGeminiApiKey } from './services/geminiApi';
import { getProfile } from './services/profileService';
import { getAppliedScholarships, markScholarshipAsApplied, removeAppliedScholarship, getHiddenScholarships, markScholarshipAsHidden, removeHiddenScholarship } from './services/userScholarshipService';
import { ConfirmationModal } from './components/ConfirmationModal';
import type { Scholarship } from './types';
import { GraduationCap, CheckCircle, List, LogOut, Settings, XCircle, BookOpen } from 'lucide-react';


const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    {children}
  </div>
);



function AppContent() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  // New state for tabs and applied scholarships
  const [activeTab, setActiveTab] = useState<'available' | 'completed' | 'hidden'>('available');
  const [appliedScholarships, setAppliedScholarships] = useState<string[]>([]);
  const [hiddenScholarships, setHiddenScholarships] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const [savedScholarships, setSavedScholarships] = useState<Scholarship[]>([]);

  // Load API key and applied scholarships from profile when user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const profile = await getProfile(user.uid);
        if (profile?.gemini_api_key) {
          setGeminiApiKey(profile.gemini_api_key);
        }

        // Load applied scholarships
        const applied = await getAppliedScholarships(user.uid);
        setAppliedScholarships(applied);

        // Load hidden scholarships
        const hidden = await getHiddenScholarships(user.uid);
        setHiddenScholarships(hidden);
      } else {
        // Fallback to localStorage if no user (or clear it)
        const localKey = localStorage.getItem('gemini_api_key');
        if (localKey) setGeminiApiKey(localKey);
        setAppliedScholarships([]);
        setHiddenScholarships([]);
      }
    };

    loadUserData();

    // Refetch on window focus to keep in sync with other devices
    const onFocus = () => {
      if (user) {
        loadUserData();
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user]);

  // Load scholarships on mount
  useEffect(() => {
    loadScholarships(1);
  }, []);

  // Fetch saved scholarships when tab changes or IDs change
  useEffect(() => {
    const fetchSaved = async () => {
      if (activeTab === 'completed' && appliedScholarships.length > 0) {
        setIsLoading(true);
        const data = await import('./services/scholarshipApi').then(m => m.getScholarshipsByIds(appliedScholarships));
        setSavedScholarships(data);
        setIsLoading(false);
      } else if (activeTab === 'hidden' && hiddenScholarships.length > 0) {
        setIsLoading(true);
        const data = await import('./services/scholarshipApi').then(m => m.getScholarshipsByIds(hiddenScholarships));
        setSavedScholarships(data);
        setIsLoading(false);
      } else if (activeTab === 'available') {
        // Ensure we have the main list loaded (might have been cleared or we just want to be sure)
        if (scholarships.length === 0) {
          loadScholarships(1);
        }
      }
    };
    fetchSaved();
  }, [activeTab, appliedScholarships, hiddenScholarships]);

  const loadScholarships = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { scholarships: results, count } = await searchScholarships(page, 20);
      setScholarships(results);
      setTotalCount(count);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch scholarships. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    loadScholarships(newPage);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApply = async (scholarshipId: string) => {
    if (!user) {
      alert('Please log in to save scholarships.');
      return;
    }

    const isCurrentlyApplied = appliedScholarships.includes(scholarshipId);

    if (!isCurrentlyApplied) {
      // Open confirmation modal
      setModalConfig({
        isOpen: true,
        title: 'Mark as Completed?',
        message: 'Are you sure you want to mark this scholarship as completed? It will be moved to the Completed tab.',
        onConfirm: async () => {
          const success = await markScholarshipAsApplied(user.uid, scholarshipId);
          if (success) {
            setAppliedScholarships(prev => [...prev, scholarshipId]);
            // If it was hidden, remove from hidden
            if (hiddenScholarships.includes(scholarshipId)) {
              await removeHiddenScholarship(user.uid, scholarshipId);
              setHiddenScholarships(prev => prev.filter(id => id !== scholarshipId));
            }
          }
        }
      });
    } else {
      // Unmarking is instant
      const success = await removeAppliedScholarship(user.uid, scholarshipId);
      if (success) {
        setAppliedScholarships(prev => prev.filter(id => id !== scholarshipId));
      }
    }
  };

  const handleHide = async (scholarshipId: string) => {
    if (!user) {
      alert('Please log in to hide scholarships.');
      return;
    }

    const isCurrentlyHidden = hiddenScholarships.includes(scholarshipId);

    if (!isCurrentlyHidden) {
      setModalConfig({
        isOpen: true,
        title: 'Mark as Not Doing?',
        message: 'Are you sure you want to hide this scholarship? It will be moved to the Not Doing tab.',
        onConfirm: async () => {
          const success = await markScholarshipAsHidden(user.uid, scholarshipId);
          if (success) {
            setHiddenScholarships(prev => [...prev, scholarshipId]);
            // If it was applied, remove from applied
            if (appliedScholarships.includes(scholarshipId)) {
              await removeAppliedScholarship(user.uid, scholarshipId);
              setAppliedScholarships(prev => prev.filter(id => id !== scholarshipId));
            }
          }
        }
      });
    } else {
      const success = await removeHiddenScholarship(user.uid, scholarshipId);
      if (success) {
        setHiddenScholarships(prev => prev.filter(id => id !== scholarshipId));
      }
    }
  };



  // Filter scholarships based on active tab
  // Filter scholarships based on active tab, category, and search query
  const filteredScholarships = (activeTab === 'available' ? scholarships : savedScholarships).filter(s => {
    const isApplied = appliedScholarships.includes(s.id);
    const isHidden = hiddenScholarships.includes(s.id);

    // Search filter
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeTab === 'completed') return isApplied;
    if (activeTab === 'hidden') return isHidden;

    // Available tab shows scholarships that are NEITHER applied NOR hidden
    return !isApplied && !isHidden;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6 md:mb-8 gap-4">
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity shrink-0">
            <div className="p-2 md:p-3 bg-primary/10 rounded-xl">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white">ScholarshipFinder</h1>
              <p className="text-slate-400 text-sm hidden md:block">Find funding for your education</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/tutorials" className="text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-2 p-2 md:p-0 bg-white/5 md:bg-transparent rounded-lg md:rounded-none">
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Tutorials</span>
            </Link>

            <div className="flex items-center gap-2 md:gap-4">
              {user ? (
                <div className="flex items-center gap-2 md:gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-dark-lighter hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-colors border border-white/5"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden md:inline">Settings</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut();
                      window.location.href = '/'; // Force a hard refresh to clear any lingering state
                    }}
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/10"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 md:gap-3">
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white font-medium text-xs md:text-sm transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs md:text-sm font-medium transition-colors shadow-lg shadow-primary/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={
            <PageTransition>
              <div className="space-y-6">
                {/* Search and Tabs Row */}
                <div className="glass-card p-4 rounded-2xl">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Search Box */}
                    <div className="flex-1 w-full md:w-auto">
                      <input
                        type="text"
                        placeholder="Search scholarships by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setActiveTab('available')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${activeTab === 'available'
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <List className="w-4 h-4" />
                        Available
                      </button>
                      <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${activeTab === 'completed'
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </button>
                      <button
                        onClick={() => setActiveTab('hidden')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${activeTab === 'hidden'
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Not Doing
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scholarship List */}
                {!isLoading && (
                  <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {error ? (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                        {error}
                      </div>
                    ) : (
                      <ScholarshipList
                        scholarships={filteredScholarships}
                        onSelect={setSelectedScholarship}
                        isLoading={isLoading}
                        appliedScholarships={appliedScholarships}
                        onToggleApply={handleApply}
                        hiddenScholarships={hiddenScholarships}
                        onToggleHide={handleHide}
                        totalCount={totalCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        title={
                          activeTab === 'completed' ? 'Completed Scholarships' :
                            activeTab === 'hidden' ? 'Not Doing' :
                              'Available Scholarships'
                        }
                        hideCount={activeTab !== 'available'}
                      />
                    )}
                  </div>
                )}
                {isLoading && (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />
          <Route path="/signup" element={
            <PageTransition>
              <SignUp />
            </PageTransition>
          } />
          <Route path="/profile" element={
            <PageTransition>
              <ProfileSettings />
            </PageTransition>
          } />
          <Route path="/tutorials" element={
            <PageTransition>
              <Tutorials />
            </PageTransition>
          } />
        </Routes>
      </div>

      {selectedScholarship && (
        <EssayAssistant
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          isApplied={appliedScholarships.includes(selectedScholarship.id)}
          onToggleApply={() => handleApply(selectedScholarship.id)}
        />
      )}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Confirm"
        type="info"
      />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
