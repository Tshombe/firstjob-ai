// ...same imports and Firebase/i18n setup as before...

// Place this at the top of your component
const SECTION_TITLE_STYLE = {
  fontWeight: 700,
  fontSize: '1.3rem',
  marginBottom: '.4rem',
  display: 'flex',
  alignItems: 'center',
  gap: 8
};

export default function FirstJobAI() {
  // ...all your existing hooks and logic...

  // Check for error in aiResponse (very basic detection)
  const isError = typeof aiResponse === 'string' && (
    aiResponse.toLowerCase().includes("error") || aiResponse.toLowerCase().includes("no jobs found")
  );

  // (keep the rest of the function unchanged up to the return)

  return (
    <div style={{
      maxWidth: 720,
      margin: "0 auto",
      padding: "2.2rem 1.2rem",
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      background: palette.bg,
      minHeight: '100vh',
      transition: 'background 0.3s'
    }}>
      {/* HEADER */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 18, gap: 16
      }}>
        <h1 style={{
          fontSize: "2.4rem", fontWeight: 800,
          background: `linear-gradient(90deg, ${palette.blue}, ${palette.green})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
        }}>
          FirstJob.ai
        </h1>
        <div style={{ display: "flex", gap: 10, alignItems: 'center' }}>
          <select value={i18n.language} onChange={e => handleLanguageChange(e.target.value)}
            style={{
              borderRadius: 6, padding: '.4rem .8rem', border: `1px solid ${palette.border}`,
              background: palette.panel, color: palette.text, fontWeight: 600,
              outline: 'none', boxShadow: '0 1px 6px #0001'
            }}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="hr">Hrvatski</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
          </select>
          <button onClick={handleToggleDark} style={{
            border: 'none', borderRadius: 6, padding: '.4rem .8rem',
            background: palette.blue, color: "#fff", fontWeight: 700, cursor: "pointer",
            boxShadow: '0 1px 8px #0002'
          }} aria-label="Toggle dark mode" tabIndex={0}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
      <p style={{
        color: palette.text, textAlign: "center", fontSize: "1.15rem",
        margin: 0, marginBottom: 28, fontWeight: 400
      }}>
        {t('tagline') || "Your AI-powered career assistant for graduates"}
      </p>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20
      }}>
        {signedIn ? (
          <>
            <button onClick={handleLogout} style={{
              background: palette.green, color: '#fff', border: 'none', borderRadius: 8,
              padding: '0.45rem 1.2rem', fontWeight: 700, fontSize: '1.02rem', cursor: 'pointer',
              boxShadow: '0 1px 8px #0001'
            }}>
              {t('sign_out') || 'Sign out'}
            </button>
            <span style={{ fontSize: "0.98rem", color: palette.blue, fontWeight: 600 }}>
              {t('bookmarks') || 'Bookmarks'}: {bookmarks.length}
            </span>
          </>
        ) : (
          <button onClick={handleGuestLogin} style={{
            background: palette.blue, color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.45rem 1.2rem', fontWeight: 700, fontSize: '1.02rem', cursor: 'pointer',
            boxShadow: '0 1px 8px #0001'
          }}>
            {t('try_guest') || 'Try as Guest'}
          </button>
        )}
      </div>

      <hr style={{ margin: "1.5rem 0", border: 0, borderTop: `1.5px solid ${palette.border}` }} />

      {/* Job Search Section */}
      <div style={{
        marginBottom: "2rem",
        background: palette.lightBlue,
        borderRadius: 10,
        padding: "1.4rem 1rem 1.2rem 1rem",
        boxShadow: darkMode ? '0 1px 8px #0003' : '0 2px 10px #b8c5ff22'
      }}>
        <div style={SECTION_TITLE_STYLE}><span role="img" aria-label="search">🔎</span>{t('search_jobs') || 'Search for jobs:'}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 7 }}>
          <input
            id="jobQuery"
            type="text"
            value={jobQuery}
            onChange={e => setJobQuery(e.target.value)}
            placeholder={t('search_placeholder') || 'e.g. doctor zagreb'}
            style={{
              flex: 1,
              padding: '.6rem 1rem',
              borderRadius: 8,
              border: `1.2px solid ${palette.border}`,
              fontSize: '1rem',
              background: palette.panel,
              color: palette.text,
              outline: 'none',
              boxShadow: '0 1px 6px #0001',
              transition: 'background .2s, color .2s'
            }}
            onFocus={e => e.target.style.border = `2px solid ${palette.blue}`}
            onBlur={e => e.target.style.border = `1.2px solid ${palette.border}`}
          />
          <button onClick={handleSearch} disabled={loading}
            style={{
              background: palette.green, color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'opacity .2s, box-shadow .2s',
              opacity: loading ? 0.7 : 1, boxShadow: '0 1px 8px #0001'
            }}
            tabIndex={0}
          >
            {loading ? (t('loading') || 'Loading...') : (t('search') || 'Search')}
          </button>
        </div>
      </div>

      {/* Resume Review Section */}
      <div style={{
        marginBottom: "2rem",
        background: palette.lightGreen,
        borderRadius: 10,
        padding: "1.4rem 1rem 1.2rem 1rem",
        boxShadow: darkMode ? '0 1px 8px #0002' : '0 2px 10px #acf5d933'
      }}>
        <div style={SECTION_TITLE_STYLE}><span role="img" aria-label="resume">📄</span>{t('review_resume') || 'Paste your resume:'}</div>
        <textarea
          id="resume"
          value={resumeInput}
          onChange={e => setResumeInput(e.target.value)}
          rows={6}
          style={{
            display: "block", width: "100%", margin: "0.7rem 0", padding: ".9rem",
            borderRadius: 8, border: `1.2px solid ${palette.border}`,
            fontSize: "1rem", background: palette.panel, color: palette.text, fontFamily: "inherit",
            outline: 'none', boxShadow: '0 1px 6px #0001'
          }}
          placeholder={t('paste_resume_placeholder') || 'Paste your resume text here...'}
          onFocus={e => e.target.style.border = `2px solid ${palette.green}`}
          onBlur={e => e.target.style.border = `1.2px solid ${palette.border}`}
        />
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={e => setResumeFile(e.target.files[0])}
          style={{ marginBottom: '1rem', marginTop: '.4rem' }}
        />
        <button onClick={handleResumeReview} disabled={loading}
          style={{
            background: palette.blue, color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.6rem 1.4rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'opacity .2s, box-shadow .2s',
            opacity: loading ? 0.7 : 1, boxShadow: '0 1px 8px #0001'
          }}
          tabIndex={0}
        >
          {loading ? (t('analyzing') || 'Analyzing...') : (t('review_resume') || 'Review Resume')}
        </button>
      </div>

      {/* RESPONSE OUTPUT */}
      {aiResponse && (
        <div style={{
          background: isError ? '#fef2f2' : palette.panel,
          color: isError ? '#b91c1c' : palette.text,
          marginTop: "1.7rem",
          padding: "1.2rem",
          borderRadius: "0.8rem",
          minHeight: 70,
          fontFamily: "monospace",
          fontSize: "1.06rem",
          border: isError ? '1.5px solid #fca5a5' : `1.5px solid ${palette.border}`,
          boxShadow: darkMode ? '0 1px 10px #0002' : '0 1px 7px #83aaff18',
          transition: 'background .3s, color .3s'
        }}>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{aiResponse}</pre>
        </div>
      )}
      <footer style={{
        textAlign: 'center', color: palette.text, background: palette.panel, marginTop: 36,
        padding: '1.5rem 0 1.1rem', fontSize: '.98rem', borderTop: `1px solid ${palette.border}`
      }}>
        &copy; {new Date().getFullYear()} FirstJob.ai &mdash; <span style={{ color: palette.blue }}>Powered by AI</span>
        <br />
        <span style={{ color: palette.green, fontSize: "0.97rem" }}>{darkMode ? "Dark" : "Light"} mode</span>
      </footer>
    </div>
  );
}
