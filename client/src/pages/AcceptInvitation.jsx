import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const AcceptInvitation = () => {
  const { token } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  // Fetch invitation details
  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await axios.get(`/workspaces/invitations/${token}`);
        setInvitation(response.data.invitation);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  // Handle accept invitation
  const handleAccept = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/accept-invitation/${token}`);
      return;
    }

    // Check if email matches
    if (user.email !== invitation.email) {
      setError(`This invitation was sent to ${invitation.email}. Please log in with that account.`);
      return;
    }

    setAccepting(true);
    setError('');

    try {
      const response = await axios.post(`/workspaces/invitations/${token}/accept`);
      
      // Success! Redirect to workspace
      navigate(`/workspaces/${response.data.workspace.id}`, {
        state: { message: 'Welcome to the workspace!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation');
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-muted">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-dark-text mb-2">Invalid Invitation</h1>
            <p className="text-dark-muted mb-6">{error}</p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-bg via-dark-sidebar to-dark-bg px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-purple bg-clip-text text-transparent mb-2">
            📋 ProjectHub
          </h1>
          <p className="text-dark-muted">Workspace Invitation</p>
        </div>

        {/* Invitation Card */}
        <div className="card">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold text-dark-text mb-2">
              You're Invited!
            </h2>
          </div>

          {invitation && (
            <div className="space-y-4">
              <div className="bg-dark-sidebar p-4 rounded-lg">
                <p className="text-sm text-dark-muted mb-1">Workspace</p>
                <p className="text-lg font-semibold text-dark-text">
                  {invitation.workspace.name}
                </p>
              </div>

              <div className="bg-dark-sidebar p-4 rounded-lg">
                <p className="text-sm text-dark-muted mb-1">Invited by</p>
                <p className="text-lg font-semibold text-dark-text">
                  {invitation.invitedBy.name}
                </p>
              </div>

              <div className="bg-dark-sidebar p-4 rounded-lg">
                <p className="text-sm text-dark-muted mb-1">Your role</p>
                <p className="text-lg font-semibold text-dark-text capitalize">
                  {invitation.role.toLowerCase()}
                </p>
              </div>

              <div className="bg-dark-sidebar p-4 rounded-lg">
                <p className="text-sm text-dark-muted mb-1">Invited as</p>
                <p className="text-lg font-semibold text-dark-text">
                  {invitation.email}
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-dark-muted text-center">
                    You need to be logged in to accept this invitation
                  </p>
                  <button
                    onClick={handleAccept}
                    className="btn btn-primary w-full"
                  >
                    Sign In to Accept
                  </button>
                  <p className="text-xs text-dark-muted text-center">
                    Don't have an account?{' '}
                    <Link 
                      to={`/register?redirect=/accept-invitation/${token}`}
                      className="text-primary-400 hover:text-primary-300"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              ) : user.email !== invitation.email ? (
                <div className="space-y-3">
                  <p className="text-sm text-yellow-400 text-center">
                    You're logged in as {user.email}, but this invitation was sent to {invitation.email}
                  </p>
                  <Link to="/logout" className="btn btn-secondary w-full">
                    Switch Account
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="btn btn-primary w-full"
                >
                  {accepting ? 'Accepting...' : 'Accept Invitation'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
