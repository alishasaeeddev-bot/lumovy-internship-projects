import { useEffect, useRef, useState } from "react";
import api from "../api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [statistics, setStatistics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, statisticsResponse] = await Promise.all([
          api.get("/auth/me"),
          api.get("/tasks/statistics")
        ]);

        const currentUser = userResponse.data.user;

        setUser(currentUser);
        setName(currentUser.name || "");
        setEmail(currentUser.email || "");
        setStatistics(statisticsResponse.data.statistics);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/auth/profile", {
        name: name.trim(),
        email: email.trim()
      });

      setUser(response.data.user);
      setName(response.data.user.name);
      setEmail(response.data.user.email);
      setSuccess("Profile updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");
    setImageSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError(
        "Please select a JPG, PNG, or WebP image."
      );
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setImageError(
        "Image size must be 5 MB or less."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await api.put(
        "/auth/profile/image",
        formData
      );

      setUser(response.data.user);

      setImageSuccess(
        "Profile picture updated successfully"
      );
    } catch (error) {
      setImageError(
        error.response?.data?.message ||
          "Failed to upload profile picture"
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleDeleteImage = async () => {
    if (!user.profileImage) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your profile picture?"
    );

    if (!confirmed) {
      return;
    }

    setImageError("");
    setImageSuccess("");

    try {
      setDeletingImage(true);

      const response = await api.delete(
        "/auth/profile/image"
      );

      setUser(response.data.user);

      setImageSuccess(
        "Profile picture deleted successfully"
      );
    } catch (error) {
      setImageError(
        error.response?.data?.message ||
          "Failed to delete profile picture"
      );
    } finally {
      setDeletingImage(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "All password fields are required"
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match"
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword
        }
      );

      setPasswordSuccess(
        response.data.message ||
          "Password changed successfully"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-message">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-message profile-error">
          <p>{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  const isGoogleAccount = Boolean(user.googleId);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <p className="profile-label">ACCOUNT</p>
          <h1>My Profile</h1>
          <p className="profile-subtitle">
            Manage your account information and security settings.
          </p>
        </div>
      </div>

      <div className="profile-sections">

        <section className="profile-card profile-main-card">
          <div className="profile-avatar-section">

            <div className="profile-avatar">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.name}'s profile`}
                  className="profile-image"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="profile-default-icon"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M4.5 20a7.5 7.5 0 0 1 15 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            <div className="profile-avatar-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>

              <div className="profile-avatar-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  hidden
                />

                <button
                  type="button"
                  className="profile-upload-button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploadingImage ||
                    deletingImage
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 16V4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="m7 9 5-5 5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 20h14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>

                  {uploadingImage
                    ? "Uploading..."
                    : user.profileImage
                    ? "Change Picture"
                    : "Upload Picture"}
                </button>

                {user.profileImage && (
                  <button
                    type="button"
                    className="profile-delete-button"
                    onClick={handleDeleteImage}
                    disabled={
                      uploadingImage ||
                      deletingImage
                    }
                  >
                    {deletingImage
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {(imageError || imageSuccess) && (
            <div
              className={`profile-image-message ${
                imageError
                  ? "profile-image-error"
                  : "profile-image-success"
              }`}
            >
              {imageError || imageSuccess}
            </div>
          )}

          <form
            className="profile-form"
            onSubmit={handleProfileSubmit}
          >
            <div className="profile-section-header">
              <div>
                <h2>Profile Information</h2>
                <p>
                  Update your personal account information.
                </p>
              </div>
            </div>

            <div className="profile-fields-grid">
              <div className="profile-field">
                <label htmlFor="profile-name">
                  Name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="profile-email">
                  Email
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="account-created">
              <span>Account Created</span>
              <strong>
                {new Date(
                  user.createdAt
                ).toLocaleDateString()}
              </strong>
            </div>

            {error && (
              <div className="profile-alert profile-error">
                {error}
              </div>
            )}

            {success && (
              <div className="profile-alert profile-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12.5 9.5 17 19 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Save Changes
                </>
              )}
            </button>
          </form>
        </section>

        {statistics && (
          <section className="profile-statistics">
            <div className="statistics-header">
              <div>
                <p className="statistics-label">
                  PRODUCTIVITY
                </p>

                <h2>Task Statistics</h2>

                <p>
                  A summary of your task activity and productivity.
                </p>
              </div>

              <div className="completion-rate">
                <span>Completion Rate</span>

                <strong>
                  {statistics.completionRate}%
                </strong>
              </div>
            </div>

            <div className="statistics-grid">
              <div className="statistic-card">
                <span className="statistic-title">
                  Total Tasks
                </span>

                <strong>
                  {statistics.totalTasks}
                </strong>
              </div>

              <div className="statistic-card statistic-completed">
                <span className="statistic-title">
                  Completed
                </span>

                <strong>
                  {statistics.completedTasks}
                </strong>
              </div>

              <div className="statistic-card statistic-progress">
                <span className="statistic-title">
                  In Progress
                </span>

                <strong>
                  {statistics.inProgressTasks}
                </strong>
              </div>

              <div className="statistic-card statistic-pending">
                <span className="statistic-title">
                  Pending
                </span>

                <strong>
                  {statistics.todoTasks}
                </strong>
              </div>

              <div className="statistic-card statistic-high">
                <span className="statistic-title">
                  High Priority
                </span>

                <strong>
                  {statistics.highPriorityTasks}
                </strong>
              </div>

              <div className="statistic-card statistic-overdue">
                <span className="statistic-title">
                  Overdue
                </span>

                <strong>
                  {statistics.overdueTasks}
                </strong>
              </div>
            </div>
          </section>
        )}

        {isGoogleAccount ? (
          <section className="profile-card security-card">
            <div className="profile-card-icon profile-google-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M21.35 12.27c0-.72-.06-1.25-.2-1.8H12v3.4h5.37a4.58 4.58 0 0 1-1.99 3v2.5h3.22c1.88-1.73 2.75-4.28 2.75-7.1Z"
                  fill="currentColor"
                />
                <path
                  d="M12 21.75c2.7 0 4.96-.9 6.61-2.44l-3.22-2.5c-.9.6-2.04.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.06v2.58A9.98 9.98 0 0 0 12 21.75Z"
                  fill="currentColor"
                  opacity="0.85"
                />
                <path
                  d="M6.39 13.64A5.98 5.98 0 0 1 6.08 12c0-.57.1-1.13.31-1.64V7.78H3.06A9.98 9.98 0 0 0 2 12c0 1.61.39 3.13 1.06 4.22l3.33-2.58Z"
                  fill="currentColor"
                  opacity="0.7"
                />
                <path
                  d="M12 6.23c1.47 0 2.79.5 3.83 1.49l2.87-2.87C16.96 3.26 14.7 2.25 12 2.25a9.98 9.98 0 0 0-8.94 5.53l3.33 2.58C7.18 7.99 9.39 6.23 12 6.23Z"
                  fill="currentColor"
                  opacity="0.6"
                />
              </svg>
            </div>

            <div className="security-content">
              <div className="profile-section-header">
                <div>
                  <h2>Google Sign-In</h2>
                  <p>
                    Your account is secured through Google.
                  </p>
                </div>
              </div>

              <div className="security-status">
                <span className="security-status-dot"></span>

                <div>
                  <strong>
                    Google authentication enabled
                  </strong>

                  <p>
                    Password management for this account is handled by Google.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="profile-card security-card">
            <div className="profile-card-icon profile-security-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="15"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </div>

            <form
              className="profile-form"
              onSubmit={handlePasswordSubmit}
            >
              <div className="profile-section-header">
                <div>
                  <h2>Change Password</h2>
                  <p>
                    Keep your account secure by updating your password.
                  </p>
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="current-password">
                  Current Password
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter current password"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="new-password">
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter new password"
                />

                <small className="password-hint">
                  Minimum 6 characters
                </small>
              </div>

              <div className="profile-field">
                <label htmlFor="confirm-password">
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <div className="profile-alert profile-error">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="profile-alert profile-success">
                  {passwordSuccess}
                </div>
              )}

              <button
                type="submit"
                className="profile-save-button"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  "Changing..."
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12.5 9.5 17 19 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    Change Password
                  </>
                )}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default Profile;