import React, { Fragment, useState } from 'react'
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
    "address": "",
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

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive' || e.target.name === 'isVegOnly') {
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: e.target.checked })
        }
        else if (e.target.name === 'categories' || e.target.name === 'cuisines') {
            let stringlist = e.target.value
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: stringlist.split(',') })
        }
        else {
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: e.target.value })
        }
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
            // console.log(position.coords)
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
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('images', selectedFiles[i]);
            }
            const url = BACKEND_URL + '/upload/'
            const data = await uploadImage(url, formData);
            if (data.success === true) {
                return data?.data
            } else {
                console.log(data)
                return null
            }
        }
    }

    return (
        <Fragment>
            <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
                <Grid item xs={12}>
                    <TextField InputProps={{ sx: { borderRadius: 0 } }}
                        label="Restaurant Name"
                        size="small"
                        name='name'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    {/* <ReactQuill theme="snow"
                        // value={value}
                        name='description'
                        label='Description'
                        onChange={(e) => onChangeForm(e)} /> */}
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
                        disabled={restaurantPayload.name.length == 0}
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