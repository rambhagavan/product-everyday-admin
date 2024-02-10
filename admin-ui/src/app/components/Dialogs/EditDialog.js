// ConfirmDialog.js
import React, { Fragment, useState, useEffect } from 'react'
import {
    Button,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
} from '@mui/material';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import AddIcon from '@mui/icons-material/Add';
import { showSnackBar } from '../../redux/actions/snackBarActions';
import TabPanel from '@mui/lab/TabPanel';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ImageListItem from '@mui/material/ImageListItem';
import SaveIcon from '@mui/icons-material/Save';
import { BACKEND_URL } from '../../core/constants';
import { getUserData, put, get, remove, uploadImage } from '../../services/Common';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';



const createPayload = {
    "_id": "",
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




const EditItemDialog = ({ open, onClose, Item, setItem }) => {
    const dispatch = useDispatch()
    const [category, setcategory] = useState(null)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [newprice, setnewprice] = useState(Item.price);
    const onChangeForm = (e) => {
        if (e.target.name === 'isActive' || e.target.name === 'isVeg') {
            setItem({ ...Item, [e.target.name]: e.target.checked })
        }
        else if (e.target.name === 'price') {
            const priceOfitem = e.target.value.replace(/[^0-9]/g, '');
            setnewprice(priceOfitem);
            setItem({ ...Item, [e.target.name]: priceOfitem })
        }
        else if (e.target.name === 'categories' || e.target.name === 'cuisines') {
            let stringlist = e.target.value
            setItem({ ...Item, [e.target.name]: stringlist.split(',') })
        }
        else {
            setItem({ ...Item, [e.target.name]: e.target.value })
        }
    }

    const handleCreateRestaurantItem = async () => {
        const image_data = await handleImageUpload()
        let payload = Item
        if (selectedFiles && !image_data) {
            dispatch(showSnackBar({ msg: `Error in Upload Image`, type: "error" }))
            return
        } else if (selectedFiles && image_data) {
            setSelectedFiles(null)
            setItem({ ...Item, 'image': image_data[0]['url'] });
            payload = { ...Item, 'image': image_data[0]['url'] }
        }
        payload.restaurantId = Item.restaurantId
        const id = Item._id;
        const url = BACKEND_URL + '/restaurantItem/' + id
        const data = await put(url, payload)
        console.log(data);
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Created Restaurant Item", type: "success" }))
            onClose();
        } else {
            dispatch(showSnackBar({ msg: `Create Restaurant Item Fail ${data.exception_reason}`, type: "error" }))
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


    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };
    return (
        <Dialog open={open} onClose={onClose}>

            <DialogActions>
                <div >
                    <div class="card h-md-100">
                        <div class="card-header d-flex flex-between-center pb-1">
                            <h6 class="mb-0 fw-bold">Edit</h6>
                        </div>
                        <div class="card-body pt-2">
                            <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Name"
                                        size="small"
                                        name='name'
                                        value={Item.name}
                                        fullWidth
                                        onChange={(e) => onChangeForm(e)}
                                        InputProps={{
                                            sx: { borderRadius: 0 }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        size="small"
                                        name='description'
                                        value={Item.description}
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
                                        value={Item.price}
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
                                        <Button size='small' disabled={category === null || category.length === 0} onClick={() => setItem(
                                            {
                                                ...Item,
                                                categories: Item?.categories.includes(category) ? [...Item?.categories]
                                                    : [...Item?.categories, String(category).trim()]
                                            })}><AddIcon /></Button>
                                    </Stack>
                                    <Stack direction="row" spacing={1}>
                                        {
                                            Item?.categories.map((item, key) => {
                                                return <Chip
                                                    label={item}
                                                    className='bg-warning text-white'
                                                    size='small'
                                                    onDelete={() => {
                                                        let arr = Item?.categories;
                                                        arr.splice(arr.indexOf(item), 1);
                                                        setItem({

                                                            ...Item,
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
                                                checked={Item.isActive}
                                                onChange={(e) => onChangeForm(e)}
                                                value={Item.isActive ? "off" : "on"}
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
                                                checked={Item.isVeg}
                                                onChange={(e) => onChangeForm(e)}
                                                value={Item.isVeg ? "off" : "on"}
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
                                        onClick={onClose}
                                        style={{ marginRight: "8px", marginTop: "3px" }}
                                    >
                                        cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size='medium'
                                        color="primary"
                                        className='bg-blue-outline border-0'
                                        onClick={() => handleCreateRestaurantItem()}
                                        disabled={Item.name.length === 0}
                                        startIcon={<SaveIcon />}
                                        style={{ marginLeft: "290px" }}
                                    >
                                        update Item
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>


            </DialogActions>
        </Dialog>
    );
};

export default EditItemDialog;
