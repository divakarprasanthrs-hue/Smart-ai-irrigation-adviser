import React, { useState, useEffect } from 'react';
import { Language, UserProfile } from './types';
import { localEncrypt, localDecrypt } from './data';
import WelcomeScreen from './components/WelcomeScreen';
import RegistrationScreen from './components/RegistrationScreen';
import MainDashboard from './components/MainDashboard';

export default function App() {
  const [step, setStep] = useState<'welcome' | 'register' | 'dashboard'>('welcome');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load encrypted profile on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem('enc_profile');
      if (stored) {
        const decryptedStr = localDecrypt(stored);
        if (decryptedStr) {
          const loadedProfile = JSON.parse(decryptedStr);
          if (loadedProfile && loadedProfile.name) {
            setProfile(loadedProfile);
            setStep('dashboard');
          }
        }
      }
      
      const storedLang = localStorage.getItem('selected_lang');
      if (storedLang) {
        setCurrentLanguage(storedLang as Language);
      }
    } catch (e) {
      console.error('Failed to restore secure offline profile:', e);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('selected_lang', lang);
  };

  const handleRegister = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      const encryptedStr = localEncrypt(JSON.stringify(newProfile));
      localStorage.setItem('enc_profile', encryptedStr);
    } catch (e) {
      console.error(e);
    }
    setStep('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('enc_profile');
    setProfile(null);
    setStep('welcome');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    try {
      const encryptedStr = localEncrypt(JSON.stringify(updatedProfile));
      localStorage.setItem('enc_profile', encryptedStr);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {step === 'welcome' && (
        <WelcomeScreen
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onNext={() => setStep('register')}
        />
      )}

      {step === 'register' && (
        <RegistrationScreen
          currentLanguage={currentLanguage}
          onRegister={handleRegister}
          initialProfile={profile || undefined}
        />
      )}

      {step === 'dashboard' && profile && (
        <MainDashboard
          profile={profile}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
