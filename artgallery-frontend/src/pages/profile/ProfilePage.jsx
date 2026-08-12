import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    getProfile,
    updateProfile
} from "../../services/profileService";


function ProfilePage() {

    const navigate = useNavigate();

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    useEffect(() => {

        loadProfile();

    }, []);


    const loadProfile = async () => {

        try {

            const data =
                await getProfile();

            setProfile(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to load profile."
            );

        } finally {

            setLoading(false);

        }

    };


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setProfile(prev => ({
            ...prev,
            [name]: value
        }));

    };


    const saveProfile = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {

            const updated =
                await updateProfile({

                    name: profile.name,

                    phone: profile.phone,

                    address: profile.address,

                    city: profile.city,

                    state: profile.state,

                    pincode: profile.pincode,

                    country: profile.country

                });


            setProfile(updated);

            // Keep navbar name updated
            localStorage.setItem(
                "userName",
                updated.name
            );


            toast.success(
                "Profile updated successfully."
            );


        } catch (error) {

            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to update profile.";

            toast.error(
                typeof message === "string"
                    ? message
                    : "Unable to update profile."
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (

            <div className="loading-screen">

                <div className="load-mark">
                    ✦
                </div>

                <div className="load-text">
                    Loading profile...
                </div>

            </div>

        );

    }


    if (!profile) {

        return null;

    }


    return (

        <div className="profile-page">

            <div className="profile-card">


                {/* HEADER */}

                <div className="profile-header">

                    <div className="profile-avatar">

                        {profile.name
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>

                    <div>

                        <div className="profile-eyebrow">
                            YOUR ACCOUNT
                        </div>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your personal
                            information
                        </p>

                    </div>

                </div>


                <div className="profile-divider" />


                {/* FORM */}

                <form
                    onSubmit={saveProfile}
                    className="profile-form"
                >


                    {/* PERSONAL INFORMATION */}

                    <div className="profile-section">

                        <h2>
                            Personal Information
                        </h2>

                        <div className="profile-grid">


                            <div className="field-wrap">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        profile.name || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="field-wrap">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={
                                        profile.email || ""
                                    }
                                    disabled
                                />

                                <small>
                                    Email cannot be changed here.
                                </small>

                            </div>


                            <div className="field-wrap">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        profile.phone || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* ADDRESS */}

                    <div className="profile-section">

                        <h2>
                            Address
                        </h2>


                        <div className="field-wrap">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                rows="3"
                                value={
                                    profile.address || ""
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="House number, street, area..."
                            />

                        </div>


                        <div className="profile-grid">


                            <div className="field-wrap">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        profile.city || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="field-wrap">

                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        profile.state || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="field-wrap">

                                <label>
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={
                                        profile.pincode || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="field-wrap">

                                <label>
                                    Country
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={
                                        profile.country || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="profile-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default ProfilePage;