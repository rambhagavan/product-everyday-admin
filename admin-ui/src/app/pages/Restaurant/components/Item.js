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
import EditDialog from '../../../components/Dialogs/EditDialog';
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
    const [selectedRestaurantItem, setselectedRestaurantItem] = useState(createPayload)
    const [editflag, seteditflag] = useState(false)
    const [price, setprice] = useState("")    //   to set the price of the item only numeric in input field
    const [editdialogOpen, seteditdialogOpen] = useState(false);



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
            dispatch(showSnackBar({ msg: "Get Restaurant Success", type: "success" }))
        } else {
            dispatch(showSnackBar({ msg: `Get Restaurant Fail ${data.exception_reason}`, type: "error" }))
        }
        setloading(false);
    }

    const handleChangeTab = (event, newValue) => {
        setrestauranItemtPayload(createPayload)
        setprice("");
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
            const priceOfitem = e.target.value.replace(/[^0-9]/g, '');
            setprice(priceOfitem)
            setrestauranItemtPayload({ ...restauranItemtPayload, [e.target.name]: priceOfitem })
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
    const handleEditOpenDialog = (item) => {                                   // handling edit button of a item 
        seteditdialogOpen(true)
        setselectedRestaurantItem(item);

    }
    const handleEditCloseDialog = () => {                                      // for close the edit form of the item
        seteditdialogOpen(false)
        fetchRestaurantItems()
    }
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleConfirm = () => {
        handleDeleteRestaurantItem()
        fetchRestaurantItems()
        setDialogOpen(false);
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
                <EditDialog open={editdialogOpen}
                    onClose={handleEditCloseDialog}
                    Item={selectedRestaurantItem}
                    setItem={setselectedRestaurantItem}
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
                                        <div class="card-body p-0">
                                            <div class="falcon-data-table">
                                                <table class="table table-sm mb-0 table-striped table-dashboard fs--1 data-table border-bottom border-200" data-options='{"searching":false,"responsive":false,"info":false,"lengthChange":false,"sWrapper":"falcon-data-table-wrapper","dom":"<&#39;row mx-1&#39;<&#39;col-sm-12 col-md-6&#39;l><&#39;col-sm-12 col-md-6&#39;f>><&#39;table-responsive&#39;tr><&#39;row no-gutters px-1 py-3 align-items-center justify-content-center&#39;<&#39;col-auto&#39;p>>","language":{"paginate":{"next":"<span class=\"fas fa-chevron-right\"></span>","previous":"<span class=\"fas fa-chevron-left\"></span>"}}}'>
                                                    <thead class="bg-200 text-900">
                                                        <tr>
                                                            <th class="py-2 align-middle whitespace-nowrap flex items-center m">Name</th>
                                                            <th class="align-middle sort">Description</th>
                                                            <th class="align-middle sort ">Price</th>
                                                            <th class="align-middle sort text-center">Active</th>
                                                            <th class="no-sort">Actions</th>
                                                        </tr>
                                                    </thead>



                                                    <tbody id="restaurants">
                                                        {
                                                            restaurantItems.map((item) => (
                                                                <tr class="btn-reveal-trigger">
                                                                    <td class="py-2 align-middle whitespace-nowrap flex items-center">
                                                                        <img src={item.image} height={'75px'} width={'75px'} class='mr-3' />
                                                                        <strong>{item.name}</strong>
                                                                    </td>
                                                                    <td class="py-2 align-middle">{item.description}</td>
                                                                    <td class="py-2 align-middle">{item.price}</td>
                                                                    <td class="py-2 align-middle text-center fs-0 font-weight-medium">
                                                                        {item.isActive ? <span class="badge badge-success rounded-pill d-inline">Active</span> :
                                                                            <span class="badge badge-danger rounded-pill d-inline">Not Active</span>
                                                                        }</td>
                                                                    <td class="py-2 align-middle white-space-nowrap">
                                                                        <div class="dropdown">
                                                                            <IconButton aria-label="Edit" size="small" onClick={() => { handleEditOpenDialog(item) }} >
                                                                                <EditIcon fontSize="small" />
                                                                            </IconButton>
                                                                            <IconButton aria-label="delete" size="small">
                                                                                <DeleteIcon className='text-danger' onClick={() => { handleOpenDialog(item) }} />
                                                                            </IconButton>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>

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
                                                            value={restauranItemtPayload.name}
                                                            fullWidth
                                                            onChange={(e) => onChangeForm(e, setselectedRestaurantItem)}
                                                            InputProps={{ sx: { borderRadius: 0 } }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Description"
                                                            size="small"
                                                            name='description'
                                                            value={restauranItemtPayload.description}
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
                                                            value={restauranItemtPayload.price}
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
                                        name='description'
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
                                        value={price}
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