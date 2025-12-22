"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import componentStyles from '../../../../styles/components.module.scss';
import Header from '../../../../components/header';
import Loading from '../../../../components/loading';
import Button from '../../../../components/Button';
import InputFields from '../../../../components/Inputfield';
import Selectdropdown from '../../../../components/Selectdropdown';
import Checkbox from '../../../../components/Checkbox';
import { GetLoggedInUserStatus, GetAdminStatus } from '../../../../function/VerificationCheck';
import { debounceAsync } from '../../../../function/debounce';
import { api } from '../../../../lib/Api';
import type { UpdateAdminRequest, UpdateAdminResponse, GetAdminsResponse } from '../../../../dto';

function EditAdminContent() {
    const navigate = useRouter();
    const searchParams = useSearchParams();
    const adminID = searchParams.get('adminID');
    const userLoggedIn = GetLoggedInUserStatus();
    const userIsAdmin = GetAdminStatus();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [statusMessage, setStatusMessage] = useState<string>('');
    
    const [formData, setFormData] = useState({
        adminID: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'admin' as 'root' | 'admin' | 'manager',
        isActive: true
    });

    const roleOptions = [
        { value: 'root', label: 'Root Administrator' },
        { value: 'admin', label: 'Administrator' },
        { value: 'manager', label: 'Manager' }
    ];

    useEffect(() => {
        if (!userLoggedIn) {
            const previousUrl = encodeURIComponent(location.pathname);
            navigate.push(`/Login?previousUrl=${previousUrl}`);
        } else if (!userIsAdmin) {
            navigate.push('/');
        } else if (adminID) {
            fetchAdminData();
        } else {
            navigate.push('/Admin/manageAdmins');
        }
    }, [userLoggedIn, userIsAdmin, adminID]);

    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            const response = await api<GetAdminsResponse>('post', '/admin/getAllAdmins', {});
            if (response.statusCode === 200) {
                const admin = response.admins.find(a => a.adminID === parseInt(adminID!));
                if (admin) {
                    setFormData({
                        adminID: admin.adminID,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        email: admin.email,
                        phone: admin.phone || '',
                        role: admin.role,
                        isActive: admin.isActive
                    });
                } else {
                    setStatusMessage('Admin not found');
                }
            } else {
                throw new Error(response.serverMessage || 'Failed to fetch admin data');
            }
        } catch (error) {
            setStatusMessage(String(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): string | null => {
        if (!formData.firstName.trim()) return 'First name is required';
        if (!formData.lastName.trim()) return 'Last name is required';
        if (!formData.email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Invalid email format';
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
            const requestData: UpdateAdminRequest = {
                adminID: formData.adminID,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || undefined,
                role: formData.role,
                isActive: formData.isActive
            };

            const response = await api<UpdateAdminResponse>('post', '/admin/updateAdmin', requestData);
            
            if (response.statusCode === 200) {
                setStatusMessage('Admin updated successfully!');
                setTimeout(() => navigate.push('/Admin/manageAdmins'), 2000);
            } else {
                throw new Error(response.serverMessage || 'Failed to update admin');
            }
        } catch (error) {
            setStatusMessage(String(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Head>
                <title>Edit Admin - BMetrics</title>
            </Head>
            <div className={componentStyles.pageBody}>
                <main>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <form className={componentStyles.bodyBlock} onSubmit={(e) => { e.preventDefault(); debounceAsync(handleSubmit, 300)(); }}>
                            <h1 className={componentStyles.pageHeader}>Edit Admin</h1>
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
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    requiring={true}
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                                
                                <InputFields
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone (Optional)"
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
                                
                                <div className={componentStyles.checkboxContainer}>
                                    <Checkbox
                                        nameOfClass=""
                                        label="Active Status"
                                        isChecked={formData.isActive}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        disabled={false}
                                    />
                                    <span>Account is {formData.isActive ? 'Active' : 'Archived'}</span>
                                </div>
                                
                                <Button 
                                    nameOfClass='submitButton' 
                                    placeholder='Update Admin' 
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
}

function EditAdmin() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditAdminContent />
        </Suspense>
    );
}

export default EditAdmin;