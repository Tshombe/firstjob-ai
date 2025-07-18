// MVP with i18n Initialized – FirstJob.ai
// Includes i18next config and language resources

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';
import hr from '../locales/hr.json';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';

// i18n Initialization
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: { en: { translation: en }, es: { translation: es }, hr: { translation: hr } },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
}

const firebaseConfig = {
  apiKey: "AIzaSyAw1US8m8FkkcI0ys9y6ZEl2_bfwpyYKgc",
  authDomain: "first-job-d35d2.firebaseapp.com",
  projectId: "first-job-d35d2",
  storageBucket: "first-job-d35d2.firebasestorage.app",
  messagingSenderId: "399344260470",
  appId: "1:399344260470:web:d8b24f6f5feb7a5ba8d657",
  measurementId: "G-5B4JCVD7PS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const tips = [
  "Customize every resume for the job you're applying to.",
  "Use LinkedIn to connect with professionals in your desired field.",
  "Don’t fear rejection—each interview is practice.",
  "Mention real projects, even personal or school ones.",
];

export default function FirstJobAI() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [jobQuery, setJobQuery] = useState('');
  const [resumeInput, setResumeInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('jobBookmarks')) || []);

  const OPENAI_API_KEY = 'your-openai-api-key';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setSignedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('jobBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleGuestLogin = () => {
    signInAnonymously(auth).then(() => console.log('Signed in as guest')).catch(console.error);
  };

  const handleLogout = () => signOut(auth);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleSearch = async () => {
    setLoading(true);
    setAiResponse(t('searching_jobs'));
    try {
      const response = await fetch(`https://remotive.io/api/remote-jobs?search=${encodeURIComponent(jobQuery)}`);
      const data = await response.json();
      const jobs = data.jobs.slice(0, 3);
      const jobList = jobs.map((job, index) => `#${index + 1}: ${job.title} at ${job.company_name} – ${job.candidate_required_location}`).join('\n');

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful career assistant.' },
            { role: 'user', content: `Here are some job options:\n${jobList}.\nWhich is best for someone with no experience but strong coding skills?` }
          ]
        })
      });
      const result = await openaiResponse.json();
      const resultText = `🔍 ${t('top_job_matches')}\n${jobList}\n\n🤖 ${t('ai_suggests')}\n${result.choices[0].message.content}`;
      setAiResponse(resultText);
      setBookmarks([...bookmarks, { query: jobQuery, result: resultText, time: new Date().toISOString() }]);
    } catch (error) {
      setAiResponse(t('error_fetching'));
    }
    setLoading(false);
  };

  const handleResumeReview = async () => {
    setLoading(true);
    setAiResponse(t('analyzing_resume'));
    try {
      const content = resumeInput || (await resumeFile.text());
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a professional resume coach.' },
            { role: 'user', content: `Please review this resume and suggest improvements:\n${content}` }
          ]
        })
      });
      const result = await openaiResponse.json();
      setAiResponse(`✅ ${t('resume_feedback')}\n${result.choices[0].message.content}`);
    } catch (error) {
      setAiResponse(t('error_analyzing'));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">FirstJob.ai</h1>
        <select onChange={(e) => handleLanguageChange(e.target.value)} className="border p-2 rounded">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="hr">Hrvatski</option>
        </select>
      </div>

      <p className="text-gray-600 text-center">{t('tagline')}</p>

      <div className="flex justify-between items-center">
        {signedIn ? (
          <>
            <Button onClick={handleLogout}>{t('sign_out')}</Button>
            <span className="text-sm text-gray-500">{t('bookmarks')}: {bookmarks.length}</span>
          </>
        ) : (
          <Button onClick={handleGuestLogin}>{t('try_guest')}</Button>
        )}
      </div>

      {/* Tabs, Resume, Coaching, Bookmark and AI response UI here */}

      {aiResponse && (
        <Card className="bg-gray-50">
          <CardContent className="pt-4 whitespace-pre-wrap font-mono">
            {aiResponse}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
