// MVP with i18n and Firebase – Plain HTML (No extra UI dependencies)

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import hr from './locales/hr.json';

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

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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
    setAiResponse(t('searching_jobs') || 'Searching for jobs...');
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
      const resultText = `🔍 ${t('top_job_matches') || 'Top job matches'}\n${jobList}\n\n🤖 ${t('ai_suggests') || 'AI suggests:'}\n${result.choices[0].message.content}`;
      setAiResponse(resultText);
      setBookmarks([...bookmarks, { query: jobQuery, result: resultText, time: new Date().toISOString() }]);
    } catch (error) {
      setAiResponse(t('error_fetching') || 'Error fetching jobs or AI suggestions.');
    }
    setLoading(false);
  };

  const handleResumeReview = async () => {
    setLoading(true);
    setAiResponse(t('analyzing_resume') || 'Analyzing resume...');
    try {
      let content = resumeInput;
      if (!resumeInput && resumeFile) {
        content = await resumeFile.text();
      }
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
      setAiResponse(`✅ ${t('resume_feedback') || 'Resume feedback:'}\n${result.choices[0].message.content}`);
    } catch (error) {
      setAiResponse(t('error_analyzing') || 'Error analyzing resume.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>FirstJob.ai</h1>
        <select onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="hr">Hrvatski</option>
        </select>
      </div>

      <p style={{ color: "#4B5563", textAlign: "center" }}>{t('tagline') || "Your career starts here!"}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {signedIn ? (
          <>
            <button onClick={handleLogout}>{t('sign_out') || 'Sign out'}</button>
            <span style={{ fontSize: "0.9rem", color: "#6B7280" }}>{t('bookmarks') || 'Bookmarks'}: {bookmarks.length}</span>
          </>
        ) : (
          <button onClick={handleGuestLogin}>{t('try_guest') || 'Try as Guest'}</button>
        )}
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <div style={{ marginBottom: "1rem" }}>
        <label>
          {t('search_jobs') || 'Search for jobs:'}
          <input
            type="text"
            value={jobQuery}
            onChange={e => setJobQuery(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
          />
        </label>
        <button onClick={handleSearch} disabled={loading} style={{ marginLeft: "1rem" }}>
          {loading ? (t('loading') || 'Loading...') : (t('search') || 'Search')}
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          {t('paste_resume') || 'Paste your resume:'}
          <textarea
            value={resumeInput}
            onChange={e => setResumeInput(e.target.value)}
            rows={6}
            style={{ display: "block", width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
            placeholder="Paste your resume text here..."
          />
        </label>
        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={e => setResumeFile(e.target.files[0])}
          />
        </div>
        <button onClick={handleResumeReview} disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? (t('analyzing') || 'Analyzing...') : (t('review_resume') || 'Review Resume')}
        </button>
      </div>

      {aiResponse && (
        <div style={{ background: "#F9FAFB", marginTop: "1.5rem", padding: "1rem", borderRadius: "0.5rem" }}>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {aiResponse}
          </pre>
        </div>
      )}
    </div>
  );
}
