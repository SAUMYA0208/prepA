import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import './navbar.scss';

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleSignOut = async () => {
        try {
            await handleLogout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="main-navbar">
            <div className="navbar-container">
                {/* Brand / Logo */}
                <div className="navbar-brand" onClick={() => navigate('/')}>
                    <div className="brand-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <span className="brand-name">Prep<span className="brand-highlight">AI</span></span>
                </div>

                {/* Navigation Links / User profile */}
                {user && (
                    <div className="navbar-actions">
                        <button className="nav-link-btn" onClick={() => navigate('/')}>
                            Dashboard
                        </button>
                        
                        <div className="user-profile">
                            <div className="user-avatar" title={user.username || user.email}>
                                {getInitials(user.username || user.email)}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user.username || 'User'}</span>
                                <span className="user-email">{user.email}</span>
                            </div>
                        </div>

                        <button className="button secondary-button signout-btn" onClick={handleSignOut}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                            </svg>
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
