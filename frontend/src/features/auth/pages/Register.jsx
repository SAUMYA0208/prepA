import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password || !username) {
            alert("Please fill all fields")
            return
        }

        try {
            await handleRegister({ username, email, password })
            navigate('/')
        } catch (err) {
            alert(err?.response?.data?.message || "Register failed")
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
                    <h1>Create your account ✨</h1>
                    <p>Join PrepAI to start your personalized interview preparation journey.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text" id="username" name='username' placeholder='Enter username' value={username} />
                        </div>
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

                        <button className='button primary-button' type='submit'>Register</button>
                    </form>

                    <p className="auth-switch">Already have an account? <Link to={"/login"} >Login</Link> </p>
                </div>

                <div className="auth-panel auth-panel--visual">
                    <div className="visual-card">
                        <h2>Start strong with PrepAI</h2>
                        <p>Build your confidence with tailored mock interviews and actionable guidance.</p>
                        <ul>
                            <li>Plan your interview strategy</li>
                            <li>Practice with realistic questions</li>
                            <li>Track your progress over time</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register