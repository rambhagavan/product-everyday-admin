import React, { Fragment, useState, useEffect } from 'react'
import {
    Button,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getPublicIdFromImageUrl } from '../../../core/utils';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { getUserData, post, get, remove, uploadImage } from '../../../services/Common';
import { showSnackBar } from '../../../redux/actions/snackBarActions';
import SaveIcon from '@mui/icons-material/Save';
import { BACKEND_URL } from '../../../core/constants';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ImageListItem from '@mui/material/ImageListItem';
import ConfirmDialog from '../../../components/Dialogs/ConfirmDialog';

const createPayload = {
    "restaurantId": "",
    "name": "",
    "description": "",
    "image": "https://res.cloudinary.com/dw3qovmta/image/upload/v1701789862/image8-1024x849_s4kmef.jpg",
    "images": [],
    "address": "",
    "isActive": true,
    "isVeg": false,
    "categories": [],
    "price": 0,
}

const Item = ({ restaurantId, setloading }) => {
    const dispatch = useDispatch()
    const [restauranItemtPayload, setrestauranItemtPayload] = useState(createPayload)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [category, setcategory] = useState(null)
    const [tab, settab] = React.useState('1');
    const [restaurantItems, setrestaurantItems] = useState([])
    const [totalrestaurantItems, settotalrestaurantItems] = useState(0)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRestaurantItem, setselectedRestaurantItem] = useState(null)
    const [editflag, seteditflag] = useState(false)
    console.log(restaurantId)

    useEffect(() => {
        fetchRestaurantItems()
    }, [])

    const fetchRestaurantItems = async (sortOrder = false, page = 1, limit = 10) => {
        setloading(true);
        const url = BACKEND_URL + '/restaurantItem/list/restrauntitems'
        const params = {
            restaurantId: restaurantId,
            sortOrder: sortOrder,
            page: page,
            limit: limit
        }
        const data = await get(url, params)
        if (data && data?.success === true) {
            setrestaurantItems(data?.data?.restaurantItems)
            settotalrestaurantItems(data?.data?.count)
            // dispatch(showSnackBar({ msg: "Get Restaurant Success", type: "success" }))
        } else {
            dispatch(showSnackBar({ msg: `Get Restaurant Fail ${data.exception_reason}`, type: "error" }))
        }
        setloading(false);
    }

    const handleChangeTab = (event, newValue) => {
        settab(newValue);
    };

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive' || e.target.name === 'isVeg') {
            setrestauranItemtPayload({ ...restauranItemtPayload, [e.target.name]: e.target.checked })
        }
        else if (e.target.name === 'price') {
            setrestauranItemtPayload({ ...restauranItemtPayload, [e.target.name]: Number(e.target.value) })
        }
        else if (e.target.name === 'categories' || e.target.name === 'cuisines') {
            let stringlist = e.target.value
            setrestauranItemtPayload({ ...restauranItemtPayload, [e.target.name]: stringlist.split(',') })
        }
        else {
            setrestauranItemtPayload({ ...restauranItemtPayload, [e.target.name]: e.target.value })
        }
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
    const handleCreateRestaurantItem = async () => {
        setloading(true);
        const image_data = await handleImageUpload()
        let payload = restauranItemtPayload
        if (selectedFiles && !image_data) {
            dispatch(showSnackBar({ msg: `Error in Upload Image`, type: "error" }))
            return
        } else if (selectedFiles && image_data) {
            setSelectedFiles(null)
            setrestauranItemtPayload({ ...restauranItemtPayload, 'image': image_data[0]['url'] });
            payload = { ...restauranItemtPayload, 'image': image_data[0]['url'] }
        }
        const url = BACKEND_URL + '/restaurantItem/add'
        payload.restaurantId = restaurantId
        const data = await post(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Created Restaurant Item", type: "success" }))
            fetchRestaurantItems()
        } else {
            dispatch(showSnackBar({ msg: `Create Restaurant Item Fail ${data.exception_reason}`, type: "error" }))
        }
        setloading(false);
    }

    const handleDeleteRestaurantItem = async () => {
        setloading(true);
        const url = BACKEND_URL + '/restaurantItem/' + selectedRestaurantItem._id
        const data = await remove(url)
        if (data && data?.success === true) {
            fetchRestaurantItems()
            dispatch(showSnackBar({ msg: "Delete Restaurant Success", type: "success" }))
        } else {
            dispatch(showSnackBar({ msg: `Delete Restaurant Fail ${data.exception_reason}`, type: "error" }))
        }
        setloading(false);
    }

    const handleOpenDialog = (item) => {
        setDialogOpen(true);
        setselectedRestaurantItem(item);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setselectedRestaurantItem(null);
    };

    const handleConfirm = () => {
        handleDeleteRestaurantItem()
        fetchRestaurantItems()
        setDialogOpen(false);
        setselectedRestaurantItem(null);
    };

    return (
        <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
            <Grid item xs={12}>
                <ConfirmDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    onConfirm={handleConfirm}
                    title="Delete Restaurant"
                    content="Are you sure you want to perform this action?"
                />
                <h6 className='fw-bold'>Items</h6>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                <Tab label="List" icon={<ListAltIcon />} iconPosition="start" value="1" />
                                <Tab label="Add" icon={<AddIcon />} iconPosition="start" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <div className='row'>
                                <div class={`${editflag ? 'col-xxl-6' : 'col-xxl-12'} mb-3 pl-md-2`}>
                                    <div className='row'>
                                        {
                                            restaurantItems.map((item, index) => (
                                                <div class={`col-md-6 ${editflag ? 'col-xxl-6' : 'col-xxl-3'} mb-3 pl-md-2`}>
                                                    <div class="card h-md-100">
                                                        <div class="card-header d-flex flex-between-center pb-0">
                                                            <h6 class="mb-0 fw-bold">{item.name}</h6>
                                                            <div>
                                                                <IconButton aria-label="delete" size="small" onClick={() => handleOpenDialog(item)}>
                                                                    <DeleteIcon className='text-danger' />
                                                                </IconButton>
                                                                <IconButton aria-label="delete" size="small">
                                                                    <EditIcon className='text-primary' onClick={() => { seteditflag(true); setselectedRestaurantItem(item) }} />
                                                                </IconButton>
                                                            </div>

                                                        </div>
                                                        <div class="card-body pt-2">
                                                            <div class="row no-gutters h-100 align-items-center">
                                                                <div class="col">
                                                                    <div class="media align-items-center"><img class="mr-3" src="../assets/img/icons/weather-icon.png" alt="" height="60" />
                                                                        <div class="media-body">
                                                                            <ImageListItem key={item.image}>
                                                                                <img
                                                                                    srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                                                                    src={`${item.image}?w=248&fit=crop&auto=format`}
                                                                                    alt={item.title}
                                                                                    loading="lazy"
                                                                                />
                                                                            </ImageListItem>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-auto pl-2">
                                                                    <div class="fs-4 font-weight-normal text-sans-serif text-primary mb-1 line-height-1">₹ {item.price}</div>
                                                                    <div class="fs--1 text-800">
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Switch
                                                                                    size="small"
                                                                                    label="Active"
                                                                                    name='isActive'
                                                                                    checked={item.isActive}
                                                                                    onChange={(e) => onChangeForm(e)}
                                                                                    value={item.isActive ? "off" : "on"}
                                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                                />
                                                                            }
                                                                            label="Active"
                                                                        /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                {editflag ?
                                    <div class="col-md-6 col-xxl-6 mb-3 pl-md-2">
                                        <div class="card h-md-100">
                                            <div class="card-header d-flex flex-between-center pb-1">
                                                <h6 class="mb-0 fw-bold">Edit</h6>
                                                <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close" onClick={() => seteditflag(false)}></button>
                                            </div>
                                            <div class="card-body pt-2">
                                                <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Name"
                                                            size="small"
                                                            name='name'
                                                            value={selectedRestaurantItem.name}
                                                            fullWidth
                                                            onChange={(e) => onChangeForm(e)}
                                                            InputProps={{ sx: { borderRadius: 0 } }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Description"
                                                            size="small"
                                                            name='name'
                                                            rows={4}
                                                            multiline
                                                            fullWidth
                                                            onChange={(e) => onChangeForm(e)}
                                                            InputProps={{ sx: { borderRadius: 0 } }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Price"
                                                            size="small"
                                                            name='price'
                                                            fullWidth
                                                            onChange={(e) => onChangeForm(e)}
                                                            InputProps={{ sx: { borderRadius: 0 } }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Stack direction="row" spacing={1}>
                                                            <TextField
                                                                label="Categories"
                                                                size="small"
                                                                name='categories'
                                                                className='mb-1'
                                                                onChange={(e) => setcategory(e.target.value)}
                                                                InputProps={{ sx: { borderRadius: 0 } }}
                                                            />
                                                            <Button size='small' disabled={category === null || category.length === 0} onClick={() => setrestauranItemtPayload(
                                                                {
                                                                    ...restauranItemtPayload,
                                                                    categories: restauranItemtPayload.categories.includes(category) ? [...restauranItemtPayload?.categories]
                                                                        : [...restauranItemtPayload?.categories, String(category).trim()]
                                                                })}><AddIcon /></Button>
                                                        </Stack>
                                                        <Stack direction="row" spacing={1}>
                                                            {
                                                                restauranItemtPayload?.categories.map((item, key) => {
                                                                    return <Chip
                                                                        label={item}
                                                                        className='bg-warning text-white'
                                                                        size='small'
                                                                        onDelete={() => {
                                                                            let arr = restauranItemtPayload.categories;
                                                                            arr.splice(arr.indexOf(item), 1);
                                                                            setrestauranItemtPayload({
                                                                                ...restauranItemtPayload,
                                                                                categories: arr
                                                                            })
                                                                        }}
                                                                    />
                                                                })
                                                            }

                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    size="small"
                                                                    label="Active"
                                                                    name='isActive'
                                                                    checked={restauranItemtPayload.isActive}
                                                                    onChange={(e) => onChangeForm(e)}
                                                                    value={restauranItemtPayload.isActive ? "off" : "on"}
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
                                                                    label="isVeg"
                                                                    name='isVeg'
                                                                    checked={restauranItemtPayload.isVeg}
                                                                    onChange={(e) => onChangeForm(e)}
                                                                    value={restauranItemtPayload.isVeg ? "off" : "on"}
                                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                                />
                                                            }
                                                            label="Veg Only"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <input type="file" className='upload-list-inline' onChange={handleFileChange} />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="contained"
                                                            size='medium'
                                                            color="primary"
                                                            className='bg-blue-outline border-0'
                                                            onClick={() => handleCreateRestaurantItem()}
                                                            disabled={restauranItemtPayload.name.length === 0}
                                                            startIcon={<SaveIcon />}
                                                        >
                                                            Add Item
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </div>
                                    </div> :
                                    <></>
                                }

                            </div>

                        </TabPanel>
                        <TabPanel value="2">
                            <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Name"
                                        size="small"
                                        name='name'
                                        fullWidth
                                        onChange={(e) => onChangeForm(e)}
                                        InputProps={{ sx: { borderRadius: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        size="small"
                                        name='name'
                                        rows={4}
                                        multiline
                                        fullWidth
                                        onChange={(e) => onChangeForm(e)}
                                        InputProps={{ sx: { borderRadius: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Price"
                                        size="small"
                                        name='price'
                                        fullWidth
                                        onChange={(e) => onChangeForm(e)}
                                        InputProps={{ sx: { borderRadius: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            label="Categories"
                                            size="small"
                                            name='categories'
                                            className='mb-1'
                                            onChange={(e) => setcategory(e.target.value)}
                                            InputProps={{ sx: { borderRadius: 0 } }}
                                        />
                                        <Button size='small' disabled={category === null || category.length === 0} onClick={() => setrestauranItemtPayload(
                                            {
                                                ...restauranItemtPayload,
                                                categories: restauranItemtPayload.categories.includes(category) ? [...restauranItemtPayload?.categories]
                                                    : [...restauranItemtPayload?.categories, String(category).trim()]
                                            })}><AddIcon /></Button>
                                    </Stack>
                                    <Stack direction="row" spacing={1}>
                                        {
                                            restauranItemtPayload?.categories.map((item, key) => {
                                                return <Chip
                                                    label={item}
                                                    className='bg-warning text-white'
                                                    size='small'
                                                    onDelete={() => {
                                                        let arr = restauranItemtPayload.categories;
                                                        arr.splice(arr.indexOf(item), 1);
                                                        setrestauranItemtPayload({
                                                            ...restauranItemtPayload,
                                                            categories: arr
                                                        })
                                                    }}
                                                />
                                            })
                                        }

                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                size="small"
                                                label="Active"
                                                name='isActive'
                                                checked={restauranItemtPayload.isActive}
                                                onChange={(e) => onChangeForm(e)}
                                                value={restauranItemtPayload.isActive ? "off" : "on"}
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
                                                label="isVeg"
                                                name='isVeg'
                                                checked={restauranItemtPayload.isVeg}
                                                onChange={(e) => onChangeForm(e)}
                                                value={restauranItemtPayload.isVeg ? "off" : "on"}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        }
                                        label="Veg Only"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <input type="file" className='upload-list-inline' onChange={handleFileChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        size='medium'
                                        color="primary"
                                        className='bg-blue-outline border-0'
                                        onClick={() => handleCreateRestaurantItem()}
                                        disabled={restauranItemtPayload.name.length === 0}
                                        startIcon={<SaveIcon />}
                                    >
                                        Add Item
                                    </Button>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Item