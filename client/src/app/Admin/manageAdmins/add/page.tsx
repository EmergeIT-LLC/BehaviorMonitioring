"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import componentStyles from '../../../../styles/components.module.scss';
import Header from '../../../../components/header';
import Loading from '../../../../components/loading';
import Button from '../../../../components/Button';
import InputFields from '../../../../components/Inputfield';
import Selectdropdown from '../../../../components/Selectdropdown';
import { GetLoggedInUserStatus, GetAdminStatus, GetLoggedInUser } from '../../../../function/VerificationCheck';
import { debounceAsync } from '../../../../function/debounce';
import { api } from '../../../../lib/Api';
import type { CreateAdminRequest, CreateAdminResponse } from '../../../../dto';

const AddAdmin: React.FC = () => {
    const navigate = useRouter();
    const userLoggedIn = GetLoggedInUserStatus();
    const userIsAdmin = GetAdminStatus();
    const loggedInUser = GetLoggedInUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'admin' as 'root' | 'admin' | 'manager',
        companyID: 1 // Default, will be set from logged in user
    });

    useEffect(() => {
        if (!userLoggedIn) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);
        } else if (!userIsAdmin) {
            navigate.push('/');
        }
    }, [userLoggedIn, userIsAdmin]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): string | null => {
        if (!formData.firstName.trim()) return 'First name is required';
        if (!formData.lastName.trim()) return 'Last name is required';
        if (!formData.username.trim()) return 'Username is required';
        if (formData.username.length < 3) return 'Username must be at least 3 characters';
        if (!formData.email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
        if (!formData.password) return 'Password is required';
        if (formData.password.length < 8) return 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setStatusMessage(validationError);
            return;
        }

        setIsLoading(true);
        setStatusMessage('');

        try {
            const requestData: CreateAdminRequest = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                username: formData.username.trim().toLowerCase(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim() || undefined,
                password: formData.password,
                role: formData.role,
                companyID: formData.companyID
            };

            const response = await api<CreateAdminResponse>('post', '/admin/createAdmin', requestData);
            
            if (response.statusCode === 200) {
                setStatusMessage('Admin created successfully!');
                setTimeout(() => navigate.push('/Admin/manageAdmins'), 2000);
            } else {
                throw new Error(response.serverMessage || 'Failed to create admin');
            }
        } catch (error) {
            setStatusMessage(String(error));
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' },
        { value: 'root', label: 'Root' }
    ];

    return (
        <>
            <Header />
            <Head>
                <title>Add Admin - BMetrics</title>
            </Head>
            <div className={componentStyles.pageBody}>
                <main>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <form className={componentStyles.bodyBlock} onSubmit={(e) => { e.preventDefault(); debounceAsync(handleSubmit, 300)(); }}>
                            <h1 className={componentStyles.pageHeader}>Add New Admin</h1>
                            <div className={componentStyles.tbHRSButtons}>
                                <Button nameOfClass='tbBackButton' placeholder='Back' btnType='button' isLoading={isLoading} onClick={() => navigate.back()} />
                            </div>
                            
                            <div className={componentStyles.innerForm}>
                                <h2>Admin Information</h2>
                                
                                <InputFields
                                    name="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    requiring={true}
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                />
                                
                                <InputFields
                                    name="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    requiring={true}
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                />
                                
                                <InputFields
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    requiring={true}
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                />
                                
                                <InputFields
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    requiring={true}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                                
                                <InputFields
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number (Optional)"
                                    requiring={false}
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                                
                                <Selectdropdown
                                    name="role"
                                    options={roleOptions}
                                    value={formData.role}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                    requiring={true}
                                />
                                
                                <h2>Security</h2>
                                
                                <InputFields
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    requiring={true}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                />
                                
                                <InputFields
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    requiring={true}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                />
                                
                                <Button 
                                    nameOfClass='submitButton' 
                                    placeholder='Create Admin' 
                                    btnType='submit' 
                                    isLoading={isLoading}
                                    onClick={(e) => { e.preventDefault(); }}
                                />
                                
                                <p className={componentStyles.statusMessage}>{statusMessage}</p>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
};

export default AddAdmin;
