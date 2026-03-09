import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, CheckCircle, AlertCircle, Save, Camera, Lock, Eye, Upload, X } from 'lucide-react';
import { updateProfile } from '../services/api';
import Navbar from '../components/Navbar';

const C = {
    navy:   '#0d1f4f',
    navyL:  '#1a2d6b',
    orange: '#e8610a',
    green:  '#16a34a',
    red:    '#dc2626',
    bg:     '#f0f2f6',
    white:  '#ffffff',
    border: '#e2e8f0',
    muted:  '#64748b',
    faint:  '#94a3b8',
    subtle: '#f8fafc',
};

/* ── Toast ───────────────────────────────────────── */
const Toast = ({ message, type = 'success', visible }) => (
    <div style={{
        position: 'fixed', bottom: '1.75rem', left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: 9999,
        background: type === 'success' ? '#0d1f4f' : '#dc2626',
        color: '#fff',
        padding: '0.7rem 1.25rem',
        borderRadius: 12,
        fontSize: '0.84rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
    }}>
        {type === 'success'
            ? <CheckCircle size={15} color="#4ade80" />
            : <AlertCircle size={15} color="#fca5a5" />
        }
        {message}
    </div>
);

/* ── Form Field ──────────────────────────────────── */
const Field = ({ label, name, value, onChange, type = 'text', placeholder, readOnly }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.75rem', fontWeight: 700, color: C.navy,
                marginBottom: '0.45rem', letterSpacing: '0.4px', textTransform: 'uppercase',
            }}>
                {label}
                {readOnly && <Lock size={10} color={C.faint} />}
            </label>
            <input
                type={type} name={name} value={value}
                onChange={onChange} placeholder={placeholder}
                readOnly={readOnly}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: '100%', padding: '0.72rem 1rem',
                    border: `1.5px solid ${readOnly ? '#e8ecf0' : focused ? C.orange : C.border}`,
                    borderRadius: 11, fontSize: '0.9rem',
                    color: readOnly ? C.faint : C.navy,
                    outline: 'none',
                    background: readOnly ? '#f4f6f9' : C.white,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    boxShadow: focused && !readOnly ? `0 0 0 3px ${C.orange}18` : 'none',
                    cursor: readOnly ? 'default' : 'text',
                    fontFamily: 'inherit',
                }}
            />
            {readOnly && (
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: C.faint }}>
                    This field cannot be changed
                </p>
            )}
        </div>
    );
};

/* ── Profile ─────────────────────────────────────── */
const Profile = () => {
    const { user, updateUser } = useAuth();
    const fileRef = useRef(null);

    const [form, setForm]             = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview]       = useState(user?.avatar || null);
    const [saving, setSaving]         = useState(false);
    const [toast, setToast]           = useState({ visible: false, message: '', type: 'success' });
    const [error, setError]           = useState('');
    const [avatarHovered, setAvatarHovered] = useState(false);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const [viewingPhoto, setViewingPhoto] = useState(false);

    const isDirty = form.fullName !== (user?.fullName || '') ||
                    form.phone    !== (user?.phone    || '') ||
                    !!avatarFile;

    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
    };

    const handleChange = e => {
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleAvatarChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }
        setAvatarFile(file);
        setPreview(URL.createObjectURL(file));
        setError('');
    };

    const handleSubmit = async () => {
        if (!form.fullName.trim()) return setError('Full name is required.');
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('fullName', form.fullName);
            formData.append('phone', form.phone);
            if (avatarFile) formData.append('avatar', avatarFile);
            const res = await updateProfile(formData);
            updateUser(res.data.data);
            setAvatarFile(null);
            showToast('Profile updated successfully');
        } catch {
            setError('Failed to save profile. Please try again.');
            showToast('Failed to save profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes ddMenuIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin   { to { transform: rotate(360deg); } }
                .p-card  { animation: fadeUp 0.3s ease both; }
                .p-card2 { animation: fadeUp 0.3s ease both; animation-delay: 0.07s; }
                .p-card3 { animation: fadeUp 0.3s ease both; animation-delay: 0.14s; }
                .save-btn:not(:disabled):hover { transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(13,31,79,0.22) !important; }
                .save-btn:not(:disabled):active { transform: translateY(0) !important; }
                .back-link:hover { color: ${C.navy} !important; }
            `}</style>

            <Navbar />
            <Toast {...toast} />

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1rem 4rem' }}>

                {/* Header */}
                <div className="p-card" style={{ marginBottom: '1.75rem' }}>
                    <Link to="/dashboard" className="back-link"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: C.faint, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', marginBottom: '1rem', transition: 'color 0.15s' }}>
                        <ChevronLeft size={14} /> Back to Dashboard
                    </Link>
                    <h1 style={{ fontWeight: 900, color: C.navy, fontSize: '1.55rem', margin: '0 0 0.25rem', letterSpacing: '-0.4px' }}>My Profile</h1>
                    <p style={{ color: C.faint, margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
                        Manage your personal information and account photo
                    </p>
                </div>

                {/* Avatar card */}
                <div className="p-card2" style={{
                    background: C.white, borderRadius: 16, padding: '1.5rem',
                    border: `1px solid ${C.border}`,
                    boxShadow: '0 1px 3px rgba(13,31,79,0.05), 0 6px 24px rgba(13,31,79,0.06)',
                    marginBottom: '1.1rem',
                    display: 'flex', alignItems: 'center', gap: '1.5rem',
                    position: 'relative', zIndex: 10,
                }}>
                    {/* Avatar with click menu */}
                    <div style={{ position: 'relative', flexShrink: 0 }}
                        onMouseEnter={() => setAvatarHovered(true)}
                        onMouseLeave={() => { setAvatarHovered(false); }}>
                        <div style={{
                            width: 84, height: 84, borderRadius: '50%', overflow: 'hidden',
                            border: `3px solid ${avatarHovered || avatarMenuOpen ? C.orange : C.border}`,
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            boxShadow: avatarHovered || avatarMenuOpen
                                ? `0 0 0 4px ${C.orange}20`
                                : '0 2px 12px rgba(13,31,79,0.1)',
                        }}>
                            {preview
                                ? <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${C.navy}, ${C.navyL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.75rem', color: '#fff' }}>
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                  </div>
                            }
                        </div>

                        {/* Click overlay */}
                        <button onClick={() => setAvatarMenuOpen(o => !o)} style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                background: 'rgba(13,31,79,0.6)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.15rem',
                                opacity: avatarHovered || avatarMenuOpen ? 1 : 0,
                                transition: 'opacity 0.2s',
                            }}>
                                <Camera size={17} color="#fff" />
                                <span style={{ fontSize: '0.5rem', color: '#fff', fontWeight: 700, letterSpacing: '0.5px' }}>EDIT</span>
                            </div>
                        </button>

                        {/* Dropdown menu */}
                        {avatarMenuOpen && (
                            <>
                                {/* Backdrop to close */}
                                <div onClick={() => setAvatarMenuOpen(false)}
                                    style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', left: 0,
                                    background: C.white,
                                    borderRadius: 12,
                                    border: `1px solid ${C.border}`,
                                    boxShadow: '0 8px 32px rgba(13,31,79,0.14)',
                                    overflow: 'hidden',
                                    zIndex: 200,
                                    minWidth: 160,
                                    animation: 'ddMenuIn 0.15s ease',
                                }}>
                                    {preview && (
                                        <button onClick={() => { setViewingPhoto(true); setAvatarMenuOpen(false); }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.7rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, color: C.navy, fontFamily: 'inherit', textAlign: 'left' }}
                                            onMouseEnter={e => e.currentTarget.style.background = C.bg}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                            <Eye size={15} color={C.muted} /> View Photo
                                        </button>
                                    )}
                                    <button onClick={() => { fileRef.current?.click(); setAvatarMenuOpen(false); }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.7rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, color: C.navy, fontFamily: 'inherit', textAlign: 'left', borderTop: preview ? `1px solid ${C.border}` : 'none' }}
                                        onMouseEnter={e => e.currentTarget.style.background = C.bg}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                        <Upload size={15} color={C.muted} /> Change Photo
                                    </button>
                                </div>
                            </>
                        )}

                        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} style={{ display: 'none' }} />
                    </div>

                    {/* Lightbox */}
                    {viewingPhoto && preview && (
                        <div onClick={() => setViewingPhoto(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', cursor: 'zoom-out' }}>
                            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                                <img src={preview} alt="Profile photo"
                                    style={{ width: 280, height: 280, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 16px 48px rgba(0,0,0,0.4)', display: 'block' }} />
                                <button onClick={() => setViewingPhoto(false)}
                                    style={{ position: 'absolute', top: -10, right: -10, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                    <X size={16} color={C.navy} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Name / email / button */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 800, color: C.navy, fontSize: '1.05rem', letterSpacing: '-0.2px' }}>{user?.fullName}</p>
                        <p style={{ margin: '0.15rem 0 0.8rem', fontSize: '0.82rem', color: C.faint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <button onClick={() => fileRef.current?.click()} style={{
                                fontSize: '0.76rem', fontWeight: 700,
                                color: avatarFile ? C.green : C.orange,
                                background: avatarFile ? '#f0fdf4' : `${C.orange}10`,
                                border: `1px solid ${avatarFile ? '#bbf7d0' : `${C.orange}30`}`,
                                borderRadius: 8, padding: '0.32rem 0.8rem',
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                transition: 'all 0.15s',
                            }}>
                                {avatarFile
                                    ? <><CheckCircle size={12} /> Photo selected</>
                                    : <><Camera size={12} /> Change Photo</>
                                }
                            </button>
                            <span style={{ fontSize: '0.7rem', color: C.faint }}>JPG, PNG or WebP · Max 5MB</span>
                        </div>
                    </div>
                </div>

                {/* Form card */}
                <div className="p-card3" style={{
                    background: C.white, borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    boxShadow: '0 1px 3px rgba(13,31,79,0.05), 0 6px 24px rgba(13,31,79,0.06)',
                    overflow: 'hidden',
                }}>
                    <div style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
                        <p style={{ margin: '0 0 1.3rem', fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                            Personal Details
                        </p>
                        <Field label="Full Name"     name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" />
                        <Field label="Email Address" name="email"    value={user?.email || ''} readOnly type="email" />
                        <Field label="Phone Number"  name="phone"    value={form.phone}    onChange={handleChange} placeholder="e.g. 08012345678" type="tel" />
                    </div>

                    <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: `1px solid ${C.border}`, background: C.subtle }}>
                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '0.65rem 0.9rem', marginBottom: '1rem' }}>
                                <AlertCircle size={14} color={C.red} />
                                <p style={{ margin: 0, fontSize: '0.8rem', color: C.red, fontWeight: 500 }}>{error}</p>
                            </div>
                        )}
                        <button
                            className="save-btn"
                            onClick={handleSubmit}
                            disabled={saving || !isDirty}
                            style={{
                                width: '100%', padding: '0.82rem',
                                borderRadius: 12, border: 'none',
                                background: saving || !isDirty ? '#e2e8f0' : C.navy,
                                color: saving || !isDirty ? '#94a3b8' : '#fff',
                                fontWeight: 700, fontSize: '0.92rem',
                                cursor: saving || !isDirty ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s',
                                boxShadow: saving || !isDirty ? 'none' : '0 2px 8px rgba(13,31,79,0.14)',
                                fontFamily: 'inherit',
                            }}>
                            {saving
                                ? <>
                                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                                    Saving...
                                  </>
                                : <><Save size={15} /> Save Changes</>
                            }
                        </button>
                        {!isDirty && !saving && (
                            <p style={{ margin: '0.6rem 0 0', textAlign: 'center', fontSize: '0.72rem', color: C.faint }}>
                                Make a change above to enable saving
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;