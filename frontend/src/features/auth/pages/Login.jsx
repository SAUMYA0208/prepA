import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            alert("Please fill all fields")
            return
        }

        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (error) {
            alert(error?.response?.data?.message || "Login failed")
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <h1>Loading.......</h1>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-panel auth-panel--content">
                    <span className="auth-badge">AI Interview Prep</span>
                    <h1>Hey, welcome back 👋</h1>
                    <p>Sign in to PrepAI and continue your interview practice with confidence.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email" id="email" name='email' placeholder='Enter email address' value={email} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password" id="password" name='password' placeholder='Enter password' value={password} />
                        </div>
                        <button className='button primary-button' type='submit'>Login</button>
                    </form>

                    <p className="auth-switch">Don't have an account? <Link to={"/register"} >Register</Link></p>
                </div>

                <div className="auth-panel auth-panel--visual">
                    <div className="visual-card">
                        <h2>Welcome to PrepAI</h2>
                        <p>Practice smarter with mock interviews, instant feedback, and a clear path to improve.</p>
                        <ul>
                            <li>Real-time interview questions</li>
                            <li>Confidence-building feedback</li>
                            <li>Track your progress easily</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login