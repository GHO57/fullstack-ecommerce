import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, Paper, CircularProgress } from '@mui/material';
import { updateAddress, updateFullName } from '../../../features/user/userThunks';
import { Loader } from '../../../layouts';

const MyAccount = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user[0]);
    const { loading, error } = useSelector((state) => state.user);
    const deliveryAddresses = useSelector((state) => state.user.deliveryAddress);

    const calculateAccountAge = () => {
      const createdDate = new Date(user.createdAt);
      const currentDate = new Date();
    
      let years = currentDate.getFullYear() - createdDate.getFullYear();
      let months = currentDate.getMonth() - createdDate.getMonth();
      let days = currentDate.getDate() - createdDate.getDate();
    
      if (days < 0) {
        months--;
        days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      }
    
      if (months < 0) {
        years--;
        months += 12;
      }
    
      return { years, months, days };
    };
    const accountAge = user ? calculateAccountAge() : null;
    const [fullname, setFullname] = useState(user.fullname);
    const [fullnameChanged, setFullnameChanged] = useState(false);
    const [email] = useState(user.email);

    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [formValues, setFormValues] = useState({
        fullname: '',
        mobile_number: '',
        alternate_phone_number: '',
        pincode: '',
        state: '',
        city: '',
        landmark: '',
        address: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (deliveryAddresses.length > 0 && selectedAddressId) {
            const selectedAddress = deliveryAddresses.find(addr => addr.id === selectedAddressId);
            setFormValues({
                fullname: selectedAddress.fullname,
                mobile_number: selectedAddress.mobile_number,
                alternate_phone_number: selectedAddress.alternate_phone_number,
                pincode: selectedAddress.pincode,
                state: selectedAddress.state,
                city: selectedAddress.city,
                landmark: selectedAddress.landmark,
                address: selectedAddress.address
            });
            setIsEditing(true);
            setHasUnsavedChanges(false);
        } else {
            setFormValues({
                fullname: '',
                mobile_number: '',
                alternate_phone_number: '',
                pincode: '',
                state: '',
                city: '',
                landmark: '',
                address: ''
            });
            setIsEditing(false);
            setHasUnsavedChanges(false);
        }
    }, [selectedAddressId, deliveryAddresses]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setHasUnsavedChanges(true);
    };

    const handleFullNameChange = (e) => {
      setFullname(e.target.value);
      setFullnameChanged(true)
  };

    const getChangedFields = (initial, current) => {
        return Object.keys(current).reduce((acc, key) => {
            if (initial[key] !== current[key]) {
                acc[key] = current[key];
            }
            return acc;
        }, {});
    };

    const handleSave = () => {
        const selectedAddress = deliveryAddresses.find(addr => addr.id === selectedAddressId);
        const changedFields = getChangedFields(selectedAddress, formValues);

        if (Object.keys(changedFields).length > 0) {
            const updatedFormData = new FormData();
            Object.keys(changedFields).forEach(key => {
                updatedFormData.set(key, changedFields[key]);
            });
            updatedFormData.set('id', selectedAddress.id);  
            // console.log(updatedFormData);
            dispatch(updateAddress(updatedFormData)).then(() => {
                setSelectedAddressId('');  
                setHasUnsavedChanges(false);
            });
        }
    };

    const handleSaveFullName = () => {
      setFullnameChanged(false)
      dispatch(updateFullName({ email, fullname }));
  };

    const handleBack = () => {
        setSelectedAddressId('');
        setIsEditing(false);
        setHasUnsavedChanges(false);
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className='flex justify-center w-full px-[5rem] py-[3rem]'>
                    <div className='w-full flex flex-col gap-[1rem]'>
                        <Typography variant="h4" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', color: '#111' }}>My Details</Typography>
                        <Paper className="px-6 py-4 border-[1px] border-lightGray3">
                            <TextField
                                    label="Full Name"
                                    name="fullname"
                                    value={fullname}
                                    onChange={handleFullNameChange}
                                    fullWidth
                                    margin="normal"
                                />              
                                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '17px', fontWeight: 600 }}>Email: {email}</Typography>
                            {accountAge && (
                                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '17px', fontWeight: 600 }}>
                                Account Age: {accountAge.years} years, {accountAge.months} months, {accountAge.days} days
                                </Typography>
                            )}
                            { fullnameChanged && (
                                <Button variant="contained" color="primary" onClick={handleSaveFullName} sx={{ mt: '13px' }}>Save Details</Button>            

                            )

                            }
                        </Paper>
                        <Typography variant="h5" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', color: '#111', mt: '1rem' }}>Modify Address:</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Select an Address</InputLabel>
                            <Select
                                value={selectedAddressId}
                                onChange={(e) => setSelectedAddressId(e.target.value)}
                            >
                                {deliveryAddresses.map((address) => (
                                    <MenuItem key={address.id} value={address.id}>
                                        {address.address}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {isEditing && (
                            <form>
                                <TextField
                                    label="Full Name"
                                    name="fullname"
                                    value={formValues.fullname}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Phone Number"
                                    name="mobile_number"
                                    value={formValues.mobile_number}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Alternate Phone Number"
                                    name="alternate_phone_number"
                                    value={formValues.alternate_phone_number}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Pincode"
                                    name="pincode"
                                    value={formValues.pincode}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="State"
                                    name="state"
                                    value={formValues.state}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="City"
                                    name="city"
                                    value={formValues.city}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Landmark"
                                    name="landmark"
                                    value={formValues.landmark}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={formValues.address}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <div className='mt-[1.5rem]'>
                                    <Button variant="contained" color="primary" onClick={handleSave}>
                                        Save
                                    </Button>
                                    <Button variant="contained" onClick={handleBack} style={{ marginLeft: '10px' }}>
                                        Back
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MyAccount;
