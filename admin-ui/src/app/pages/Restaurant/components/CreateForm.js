import React, { Fragment, useState, useEffect } from 'react'
import {
    Button,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { showSnackBar } from '../../../redux/actions/snackBarActions';
import { getUserData, post, uploadImage } from '../../../services/Common';
import SaveIcon from '@mui/icons-material/Save';
import { BACKEND_URL } from '../../../core/constants';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';

const createPayload = {
    "restaurantId": "",
    "user": "",
    "name": "",
    "geometry": {},
    "image": "https://res.cloudinary.com/dw3qovmta/image/upload/v1700294913/pearl-mary-oyster-bar-interior-by-bfurlong-1200x900px_uavaba.jpg",
    "description": "",
    "aadharNumber": "",
    "address": "",
    "panNumber": "",
    "accountNumber": "",
    "ifscCode": "",
    "fssaiRegistrationNumber": "",
    "contactNumber": "",
    "isActive": true,
    "isVegOnly": false,
    "categories": [],
    "cuisines": []
}

const CreateForm = ({ setloading, fetchAllRestaurants }) => {
    const dispatch = useDispatch()
    const [restaurantPayload, setrestaurantPayload] = useState(createPayload)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const user = getUserData()
    const [cusine, setcusine] = useState(null)
    const [category, setcategory] = useState(null)
    const [aadharNumber, setaadharNumber] = useState(null)
    const [contactNumber, setcontactNumber] = useState(null)           // adding contacts number
    const [accountNumber, setaccountNumber] = useState(null)  // adding Bank account number
    const [buttonVisibilty, setbuttonVisibilty] = useState(true)  // for disabled the button
    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files[0]);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive' || e.target.name === 'isVegOnly') {
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: e.target.checked })
        }
        else if (e.target.name === 'categories' || e.target.name === 'cuisines') {
            let stringlist = e.target.value
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: stringlist.split(',') })
        }
        else if (e.target.name === 'aadharNumber') {
            const aadharNumber = e.target.value.replace(/[^0-9]/g, '');          //validating the adhar_no only should be integer
            if (aadharNumber.length <= 12) {
                setaadharNumber(aadharNumber)                                    // validating adhar length should not be greater than 12
                setrestaurantPayload({ ...restaurantPayload, [e.target.name]: aadharNumber })
            }
        }
        else if (e.target.name === 'contactNumber') {
            const contactNumber = e.target.value.replace(/[^0-9]/g, '');          //validating the contact_no only should be interger
            if (contactNumber.length <= 10) {                                        // validating contactnumber length should not be greater than 10
                setcontactNumber(contactNumber)
                setrestaurantPayload({ ...restaurantPayload, [e.target.name]: contactNumber })
            }
        }
        else if (e.target.name === 'accountNumber') {
            const accountNumber = e.target.value.replace(/[^0-9]/g, '');
            setaccountNumber(accountNumber);
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: accountNumber })
        }
        else {
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: e.target.value })
        }
    }
    const handleAddRestaurant = () => {                                     //validating on mandatory input field for button visibilty
        if (restaurantPayload.name.length == 0 || restaurantPayload.aadharNumber.length < 12 || restaurantPayload.contactNumber.length < 10 || restaurantPayload.accountNumber.length == 0 || restaurantPayload.ifscCode.length == 0) {
            return true;
        }
        return false;
    }
    const handleCreateRestaurant = async () => {
        setloading(true);
        const image_data = await handleImageUpload()
        let payload = restaurantPayload
        if (selectedFiles && !image_data) {
            dispatch(showSnackBar({ msg: `Error in Upload Image`, type: "error" }))
            return
        } else if (selectedFiles && image_data) {
            setSelectedFiles(null)
            setrestaurantPayload({ ...restaurantPayload, 'image': image_data[0]['url'] });
            payload = { ...restaurantPayload, 'image': image_data[0]['url'] }
        }
        payload.user = user.id
        payload.email = user.email
        setloading(true)
        let coordinate = {
            latitude: '',
            longitude: ''
        }
        navigator.geolocation.getCurrentPosition((position) => {
            coordinate.latitude = position.coords.latitude
            coordinate.longitude = position.coords.longitude
            restaurantPayload.geometry = coordinate
        })
        const url = BACKEND_URL + '/restaurant/add'
        console.log(payload)
        const data = await post(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Create Restaurant Success", type: "success" }))
            fetchAllRestaurants()
        } else {
            dispatch(showSnackBar({ msg: `Create Restaurant Fail ${data.exception_reason}`, type: "error" }))
        }
        setloading(false);
    }

    const handleImageUpload = async () => {
        if (selectedFiles) {
            const formData = new FormData();
            formData.append('images', selectedFiles);
            console.log(formData, "   formdata");
            const url = BACKEND_URL + '/upload/'
            const data = await uploadImage(url, formData);
            if (data.success === true) {
                return data?.data
            } else {
                return null
            }
        }
    }
    useEffect(() => {                   //for button visibilty (add restaurant button)
        setbuttonVisibilty(handleAddRestaurant())
    }, [restaurantPayload.name, restaurantPayload.aadharNumber, restaurantPayload.contactNumber, restaurantPayload.accountNumber, restaurantPayload.ifscCode])
    return (
        <Fragment>
            <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Restaurant Name*"
                        size="small"
                        name='name'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>

                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Restaurant Description"
                        size="small"
                        name='description'
                        fullWidth
                        multiline
                        rows={4}
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                {/* adding pancard_number */}
                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Pan Number"
                        size="small"
                        name='panNumber'
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                {/* adhar number */}
                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Aadhar Number*"
                        size="small"
                        value={aadharNumber}
                        name='aadharNumber'
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                {/* Bank account Number */}
                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Bank Account Number*"
                        size="small"
                        value={accountNumber}
                        name='accountNumber'
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Bank IFSC Code*"
                        size="small"
                        name='ifscCode'
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="FSSAI Registration Number"
                        size="small"
                        name='fssaiRegistrationNumber'
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Contact Number*"
                        size="small"
                        value={contactNumber}
                        name='contactNumber'
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <TextField InputProps={{ sx: { borderRadius: 0 } }}
                            label="Categories"
                            size="small"
                            name='categories'
                            onChange={(e) => setcategory(e.target.value)}
                            className='mb-1'
                        />
                        <Button size='small' disabled={category === null || category.length === 0} onClick={() => setrestaurantPayload(
                            {
                                ...restaurantPayload,
                                categories: restaurantPayload.categories.includes(category) ? [...restaurantPayload?.categories]
                                    : [...restaurantPayload?.categories, String(category).trim()]
                            })}><AddIcon /></Button>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        {
                            restaurantPayload?.categories.map((item, key) => {
                                return <Chip
                                    label={item}
                                    className='bg-warning text-white'
                                    size='small'
                                    onDelete={() => {
                                        let arr = restaurantPayload.categories;
                                        arr.splice(arr.indexOf(item), 1);
                                        setrestaurantPayload({
                                            ...restaurantPayload,
                                            categories: arr
                                        })
                                    }}
                                />
                            })
                        }
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <TextField InputProps={{ sx: { borderRadius: 0 } }}
                            label="Cuisines"
                            size="small"
                            name='cuisines'
                            onChange={(e) => setcusine(e.target.value)}
                            className='mb-1'
                        />
                        <Button
                            size='small'
                            disabled={cusine === null || cusine.length === 0}
                            onClick={() => setrestaurantPayload(
                                {
                                    ...restaurantPayload,
                                    cuisines: restaurantPayload.cuisines.includes(cusine) ? [...restaurantPayload?.cuisines]
                                        : [...restaurantPayload?.cuisines, String(cusine).trim()]
                                })}><AddIcon /></Button>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        {
                            restaurantPayload?.cuisines.map((item, key) => {
                                return <Chip
                                    label={item}
                                    className='bg-green text-white'
                                    size='small'
                                    onDelete={
                                        () => {
                                            let arr = restaurantPayload.cuisines;
                                            arr.splice(arr.indexOf(item), 1);
                                            setrestaurantPayload({
                                                ...restaurantPayload,
                                                cuisines: arr
                                            })
                                        }
                                    }
                                />
                            })
                        }

                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <input type="file" className='upload-list-inline' onChange={handleFileChange} />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                label="Active"
                                name='isActive'
                                checked={restaurantPayload.isActive}
                                onChange={(e) => onChangeForm(e)}
                                value={restaurantPayload.isActive ? "off" : "on"}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Active"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                label="isVegOnly"
                                name='isVegOnly'
                                checked={restaurantPayload.isVegOnly}
                                onChange={(e) => onChangeForm(e)}
                                value={restaurantPayload.isVegOnly ? "off" : "on"}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Veg Only"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        className='bg-blue border-0'
                        onClick={() => handleCreateRestaurant()}
                        disabled={buttonVisibilty}
                        startIcon={<SaveIcon />}
                    >
                        Add Restaurant
                    </Button>

                </Grid>

            </Grid>
        </Fragment>
    )
}

export default CreateForm