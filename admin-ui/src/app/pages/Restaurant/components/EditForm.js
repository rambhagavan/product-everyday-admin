import React, { Fragment, useState } from 'react'
import {
    Button,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import { showSnackBar } from '../../../redux/actions/snackBarActions';
import { put, remove, uploadImage } from '../../../services/Common';
import { Image } from 'antd';
import { BACKEND_URL } from '../../../core/constants';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPublicIdFromImageUrl } from '../../../core/utils';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import RestaurantItem from './Item';


const EditForm = ({ restaurant, setloading, fetchAllRestaurants }) => {
    const dispatch = useDispatch()
    const [restaurantPayload, setrestaurantPayload] = useState(restaurant)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [deleteImgUrl, setdeleteImgUrl] = useState(null)
    const [cusine, setcusine] = useState(null)
    const [category, setcategory] = useState(null)

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive' || e.target.name === 'isVegOnly') {
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: e.target.checked })
        }
        else {
            setrestaurantPayload({ ...restaurantPayload, [e.target.name]: e.target.value })
        }
    }

    const handleUpdateRestaurant = async () => {
        setloading(true);
        const deletedimage = await handleDeleteImage()
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
        const url = BACKEND_URL + '/restaurant/' + payload._id
        const data = await put(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Update Restaurant Success", type: "success" }))
            fetchAllRestaurants()
        } else {
            dispatch(showSnackBar({ msg: `Update Restaurant Fail ${data.exception_reason}`, type: "error" }))
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
                return null
            }
        }
    }

    const handleDeleteImage = async () => {
        if (deleteImgUrl) {
            let id = getPublicIdFromImageUrl(deleteImgUrl)
            const url = BACKEND_URL + '/upload/' + id
            const data = await remove(url);
            if (data.success === true) {
                return true
            } else {
                return false
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
                        disabled={true}
                        name='name'
                        fullWidth
                        value={restaurantPayload.name}

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
                        value={restaurantPayload.description}
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
                    {
                        restaurantPayload.image === "" ?
                            <input type="file" className='upload-list-inline' onChange={handleFileChange} /> :
                            <div className=''>
                                <Image
                                    width={100}
                                    src={restaurantPayload.image}
                                    className='me-5'
                                />
                                <IconButton aria-label="delete" size="small">
                                    <DeleteIcon className='text-danger' onClick={() => {
                                        setdeleteImgUrl(restaurantPayload.image);
                                        setrestaurantPayload({ ...restaurantPayload, image: "" })
                                    }} />
                                </IconButton>
                            </div>
                    }

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
                        onClick={() => handleUpdateRestaurant()}
                        disabled={restaurantPayload.name.length === 0}
                        startIcon={<SaveAsIcon />}
                    >
                        Update Restaurant
                    </Button>
                </Grid>

            </Grid>
            <hr />
            <RestaurantItem restaurantId={restaurant._id} setloading={setloading} />
        </Fragment>
    )
}

export default EditForm