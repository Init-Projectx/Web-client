"use client";

import { useState, useEffect } from 'react';
import { getUser, updateUser } from '@/modules/fetch/fetchUser.js';
import { searchCities } from '@/modules/fetch/fetchCity.js';
import { searchProvince } from '@/modules/fetch/fetchProvince.js';
import FileUpload from "@/components/ui/FileUpload";
import Button from "@/components/ui/Button";
import {jwtDecode} from "jwt-decode";

const Profile = () => {
    const [userData, setUserData] = useState({
        username: '',
        city_id: '',
        zipCode: '',
        phoneNumber: '',
        province_id: '',
        address: '',
        photo: null
    });
    const [loggedUser, setLoggedUser] = useState(null);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [provinceSuggestions, setProvinceSuggestions] = useState([]);
    const [cityInput, setCityInput] = useState('');
    const [provinceInput, setProvinceInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = jwtDecode(token);
                setLoggedUser(user);

                const data = await getUser(user.id);
                setUserData({
                    username: data.username || '',
                    city_id: data.city_id || '',
                    zipCode: data.zipCode || '',
                    phoneNumber: data.phoneNumber || '',
                    province_id: data.province_id || '',
                    address: data.address || '',
                    photo: data.photo || null
                });

                setCityInput(data.city_name || '');
                setProvinceInput(data.province_name || '');
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));

        if (name === 'cityInput') {
            setCityInput(value);
            if (value.length >= 3) {
                searchCities(value).then(setCitySuggestions);
            } else {
                setCitySuggestions([]);
            }
        }

        if (name === 'provinceInput') {
            setProvinceInput(value);
            if (value.length >= 3) {
                searchProvince(value).then(setProvinceSuggestions);
            } else {
                setProvinceSuggestions([]);
            }
        }
    };

    const handleSelect = (type, item) => {
        setUserData(prevState => ({ ...prevState, [`${type}_id`]: item.id }));
        type === 'city' ? setCityInput(item.name) : setProvinceInput(item.name);
        type === 'city' ? setCitySuggestions([]) : setProvinceSuggestions([]);
    };

    const handleFileDrop = (acceptedFiles) => {
        setUserData(prevState => ({
            ...prevState,
            photo: acceptedFiles[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: userData.username,
            phoneNumber: userData.phoneNumber,
            city_id: userData.city_id,
            province_id: userData.province_id,
            zipCode: userData.zipCode,
            address: userData.address,
            photo: userData.photo
        };

        try {
            await updateUser(data, userData.photo);
            alert('User updated successfully');
        } catch (error) {
            console.error("Error updating user data:", error);
            alert('Failed to update user');
        }
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="w-5/6 h-full shadow-lg my-10 flex flex-col text-xl">
                <div className="flex justify-center">
                    <h1 className="font-semibold text-2xl">USER PROFILE</h1>
                </div>
                <div className="flex justify-center">
                    <div className="grid grid-cols-2 w-4/6 flex flex-col justify-end">
                        <div className="w-full flex flex-col">
                            <label className="text-sm ms-9 mt-4" htmlFor="username">Username</label>
                            <input 
                                id="username" 
                                name="username" 
                                value={userData.username} 
                                onChange={handleChange} 
                                className="w-5/6 rounded-lg ms-9 mb-4 border-2 border-slate-950 p-2" 
                                required 
                            />
                            <label className="text-sm ms-9" htmlFor="cityInput">City</label>
                            <input 
                                id="cityInput" 
                                name="cityInput" 
                                value={cityInput} 
                                onChange={handleChange} 
                                className="w-5/6 rounded-lg ms-9 mb-4 border-2 border-slate-950 p-2" 
                                required 
                            />
                            {citySuggestions.length > 0 && (
                                <ul className="ms-9 border border-slate-950 rounded-lg w-5/6 bg-white z-10">
                                    {citySuggestions.map(city => (
                                        <li 
                                            key={city.id} 
                                            onClick={() => handleSelect('city', city)} 
                                            className="cursor-pointer p-2 hover:bg-gray-200"
                                        >
                                            {city.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <label className="text-sm ms-9" htmlFor="zipCode">Zip code</label>
                            <input 
                                id="zipCode" 
                                name="zipCode" 
                                value={userData.zipCode} 
                                onChange={handleChange} 
                                className="w-5/6 rounded-lg ms-9 mb-4 border-2 border-slate-950 p-2" 
                                required 
                            />
                        </div>
                        <div className="w-full flex flex-col">
                            <label className="text-sm ms-7 mt-4" htmlFor="phoneNumber">Phone number</label>
                            <input 
                                id="phoneNumber" 
                                name="phoneNumber" 
                                value={userData.phoneNumber} 
                                onChange={handleChange} 
                                className="w-5/6 rounded-lg ms-7 mb-4 border-2 border-slate-950 p-2" 
                                required 
                            />
                            <label className="text-sm ms-7" htmlFor="provinceInput">Province</label>
                            <input 
                                id="provinceInput" 
                                name="provinceInput" 
                                value={provinceInput} 
                                onChange={handleChange} 
                                className="w-5/6 rounded-lg ms-7 mb-4 border-2 border-slate-950 p-2" 
                                required 
                            />
                            {provinceSuggestions.length > 0 && (
                                <ul className="ms-7 border border-slate-950 rounded-lg w-5/6 bg-white z-10">
                                    {provinceSuggestions.map(province => (
                                        <li 
                                            key={province.id} 
                                            onClick={() => handleSelect('province', province)} 
                                            className="cursor-pointer p-2 hover:bg-gray-200"
                                        >
                                            {province.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="w-full">
                            <div className="mb-5">
                                <label className="text-sm ms-7" htmlFor="address">Address</label>
                                <textarea 
                                    id="address" 
                                    name="address" 
                                    value={userData.address} 
                                    onChange={handleChange} 
                                    cols="70" 
                                    rows="6" 
                                    className="ms-9 rounded-lg border-2 border-slate-950 p-2"
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-3/5 mx-auto mb-10 text-sm">
                    <p>Photo</p>
                    <FileUpload onDrop={handleFileDrop} className="flex justify-center mt-2 text-lg" />
                </div>
                <div className="w-3/5 flex justify-evenly items-center mx-auto mb-8">
                    <Button type="button" className="w-20 bg-amber-100 rounded-lg h-8 flex items-center text-sm text-yellow-500 hover:bg-red-300 hover:text-slate-950">
                        Cancel
                    </Button>
                    <Button type="submit" className="w-20 bg-amber-100 rounded-lg h-8 flex items-center text-sm text-yellow-500 hover:bg-red-300 hover:text-slate-950">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
