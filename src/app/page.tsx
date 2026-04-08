'use client'

import { useEffect, useRef, FormEvent } from 'react'
import Link from 'next/link'
import './landing.css'

const LOOPS_ENDPOINT = 'https://app.loops.so/api/newsletter-form/cmn3tos2006xo0i1em866kgxu'

export default function HomePage() {
  const heroSuccessRef = useRef<HTMLParagraphElement>(null)
  const ctaSuccessRef = useRef<HTMLParagraphElement>(null)
  const heroFormRef = useRef<HTMLFormElement>(null)
  const ctaFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80)
          }
        })
      },
      { threshold: 0.1 }
    )
    reveals.forEach((el) => observer.observe(el))

    // Animate score bars on scroll
    const scoreObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('.score-bar').forEach((bar) => {
              const width = bar.style.width
              bar.style.width = '0%'
              setTimeout(() => { bar.style.width = width }, 300)
            })
          }
        })
      },
      { threshold: 0.3 }
    )
    document.querySelectorAll('.score-card').forEach((el) => scoreObserver.observe(el))

    return () => {
      observer.disconnect()
      scoreObserver.disconnect()
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>, target: 'hero' | 'cta') {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email') as string

    try {
      await fetch(LOOPS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}`,
      })
    } catch (err) {
      console.log('Submission error:', err)
    }

    if (target === 'hero') {
      heroFormRef.current!.style.display = 'none'
      heroSuccessRef.current!.classList.add('show')
    } else {
      ctaFormRef.current!.style.display = 'none'
      ctaSuccessRef.current!.classList.add('show')
    }
  }

  return (
    <div className="landing-page">
      {/* NAV */}
      <nav>
        <div className="logo">
          <div className="logo-dot" />
          <div className="logo-text">
            <div className="logo-x">X</div>
            <div className="logo-rail">
              RAIL<span>GUARD</span>
            </div>
          </div>
        </div>
        <div className="nav-links">
          <Link href="/login" className="nav-signin">
            Sign In
          </Link>
          <a href="#waitlist" className="nav-cta">
            Get Early Access
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="status-bar">Actively monitoring AI agent threats</div>
        <h1>
          Your AI.
          <span>On a Leash.</span>
          Finally.
        </h1>
        <p className="hero-sub">
          RailGuardX is the{' '}
          <strong>first behavioral guardrail for AI agents</strong> — monitoring,
          auditing, and blocking autonomous actions before they cause damage to
          your business, users, or reputation.
        </p>
        <form
          className="email-form"
          ref={heroFormRef}
          onSubmit={(e) => handleSubmit(e, 'hero')}
        >
          <input
            type="email"
            placeholder="your@email.com"
            name="email"
            required
          />
          <button type="submit">Get Early Access →</button>
        </form>
        <p className="form-note">
          {'// Free during beta. No credit card required. Join 200+ teams on the waitlist.'}
        </p>
        <p className="success-msg" ref={heroSuccessRef}>
          ✓ You&apos;re on the list. We&apos;ll be in touch soon.
        </p>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat reveal">
          <div className="stat-num">8.5</div>
          <div className="stat-label">
            {'// Pain score — validated by 2,000+ real complaints'}
          </div>
        </div>
        <div className="stat reveal">
          <div className="stat-num">2</div>
          <div className="stat-label">
            {'// Direct competitors in the market right now'}
          </div>
        </div>
        <div className="stat reveal">
          <div className="stat-num">$0</div>
          <div className="stat-label">
            {'// Cost to join the early access waitlist today'}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="problem">
        <div className="reveal">
          <div className="section-label">{'// The Problem'}</div>
          <h2>AI AGENTS DON&apos;T COME WITH A LEASH. WE BUILT ONE.</h2>
          <p>
            You gave your AI agent access to your systems. Now it&apos;s opening
            pull requests you didn&apos;t approve, posting content you didn&apos;t
            write, sending emails you didn&apos;t authorize, and accessing data it
            shouldn&apos;t touch.
          </p>
          <p>
            <strong>By the time you notice, the damage is done.</strong> A
            competitor has your data. A customer got a wrong message. A rogue agent
            committed code to production.
          </p>
          <p>
            Companies are deploying AI agents faster than they can monitor them.
            That&apos;s not a feature — it&apos;s a liability.
          </p>
        </div>
        <div className="terminal reveal">
          <div className="terminal-bar">
            <div className="terminal-dot td-red" />
            <div className="terminal-dot td-yellow" />
            <div className="terminal-dot td-green" />
            <div className="terminal-title">railguardx — agent_monitor.log</div>
          </div>
          <div className="terminal-body">
            <div className="t-line t-grey">
              {'// [09:14:02] monitoring agent: sales_bot_v2'}
            </div>
            <div className="t-line t-white">
              → action: email_send to 4,200 contacts
            </div>
            <div className="t-line t-orange">
              ⚠ policy_violation: bulk_send not authorized
            </div>
            <div className="t-line t-red">✗ action BLOCKED before execution</div>
            <div className="t-line t-grey">
              {'// [09:14:03] alert sent to admin'}
            </div>
            <div className="t-line t-grey">
              ────────────────────────────────
            </div>
            <div className="t-line t-white">
              → action: repo_commit to main branch
            </div>
            <div className="t-line t-red">
              ✗ BLOCKED — requires human approval
            </div>
            <div className="t-line t-green">
              ✓ 2 threats neutralized this session
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-inner">
          <div className="section-label reveal">{'// What It Does'}</div>
          <h2 className="reveal">THE LEASH YOUR AI AGENTS NEVER HAD.</h2>
          <div className="features-grid">
            <div className="feature-card reveal">
              <span className="feature-icon">👁</span>
              <h3>Real-Time Monitoring</h3>
              <p>
                Watch every action your AI agents take across all systems — APIs,
                databases, email, code repositories, and third-party tools — in
                real time.
              </p>
              <span className="feature-tag">Live</span>
            </div>
            <div className="feature-card reveal">
              <span className="feature-icon">🛡</span>
              <h3>Policy Enforcement</h3>
              <p>
                Define exactly what your agents are allowed to do. AI Guardrails
                automatically blocks anything outside your approved policy before
                it executes.
              </p>
              <span className="feature-tag">Automated</span>
            </div>
            <div className="feature-card reveal">
              <span className="feature-icon">📋</span>
              <h3>Full Audit Trail</h3>
              <p>
                Every agent action is logged with a complete tamper-proof audit
                trail — what happened, when, why, and what was stopped. Built for
                compliance.
              </p>
              <span className="feature-tag">Compliance Ready</span>
            </div>
            <div className="feature-card reveal">
              <span className="feature-icon">🚨</span>
              <h3>Instant Alerts</h3>
              <p>
                Get notified the moment an agent tries something it shouldn&apos;t.
                Slack, email, or webhook — your team knows before damage occurs.
              </p>
              <span className="feature-tag">Multi-Channel</span>
            </div>
            <div className="feature-card reveal">
              <span className="feature-icon">🔐</span>
              <h3>Access Control</h3>
              <p>
                Set granular permissions per agent, per tool, per data source. Give
                agents exactly the access they need — nothing more.
              </p>
              <span className="feature-tag">Zero Trust</span>
            </div>
            <div className="feature-card reveal">
              <span className="feature-icon">⚡</span>
              <h3>Human-in-the-Loop</h3>
              <p>
                For high-risk actions, require human approval before execution.
                Your agents stay autonomous — until they shouldn&apos;t be.
              </p>
              <span className="feature-tag">HITL</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALIDATION */}
      <section className="validation">
        <div className="section-label reveal">{'// Market Validation'}</div>
        <h2 className="reveal">THE MARKET IS SCREAMING FOR THIS.</h2>
        <div className="score-card reveal">
          <div>
            <div className="score-source">
              {'// Source: Hacker News — 2,015 upvotes · 803 comments'}
            </div>
            <div className="score-quote">
              &ldquo;A platform that tracks and audits AI agent activities across
              repositories and systems, alerting maintainers when agents take
              suspicious actions like opening PRs, publishing content, or engaging
              in social manipulation.&rdquo;
            </div>
          </div>
          <div className="scores-list">
            <div className="score-item">
              <span className="score-name">Pain Level</span>
              <div className="score-bar-wrap">
                <div className="score-bar" style={{ width: '85%' }} />
              </div>
              <span className="score-val">8.5</span>
            </div>
            <div className="score-item">
              <span className="score-name">Market Trend</span>
              <div className="score-bar-wrap">
                <div className="score-bar" style={{ width: '82%' }} />
              </div>
              <span className="score-val">8.2</span>
            </div>
            <div className="score-item">
              <span className="score-name">Revenue Potential</span>
              <div className="score-bar-wrap">
                <div className="score-bar" style={{ width: '80%' }} />
              </div>
              <span className="score-val">8.0</span>
            </div>
            <div className="score-item">
              <span className="score-name">Competition</span>
              <div className="score-bar-wrap">
                <div
                  className="score-bar"
                  style={{ width: '20%', background: '#28C840' }}
                />
              </div>
              <span className="score-val" style={{ color: '#28C840' }}>
                LOW
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="waitlist">
        <h2>YOUR AI. YOUR RULES. YOUR LEASH.</h2>
        <p>
          Join the waitlist. Be first to deploy RailGuardX when we launch. Free
          during beta.
        </p>
        <form
          className="email-form-cta"
          ref={ctaFormRef}
          onSubmit={(e) => handleSubmit(e, 'cta')}
        >
          <input
            type="email"
            placeholder="your@company.com"
            name="email"
            required
          />
          <button type="submit">SECURE MY SPOT</button>
        </form>
        <p
          className="success-msg"
          ref={ctaSuccessRef}
          style={{ color: 'var(--black)', marginTop: '16px' }}
        >
          ✓ You&apos;re on the list. We&apos;ll be in touch soon.
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">RAILGUARDX © 2026</div>
        <div className="footer-copy">{'// Your AI on a leash.'}</div>
      </footer>
    </div>
  )
}
