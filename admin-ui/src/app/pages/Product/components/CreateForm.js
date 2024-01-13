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
import { post, uploadImage } from '../../../services/Common';
import SaveIcon from '@mui/icons-material/Save';
import { BACKEND_URL } from '../../../core/constants';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const createPayload = {
    "name": "",
    "description": "",
    "quantity": 0,
    "price": 0,
    "weight": 0,
    "image": "",
    "taxable": false,
    "isActive": true
}

const CreateForm = ({ setloading, fetchAllProducts }) => {
    const dispatch = useDispatch()
    const [productPayload, setproductPayload] = useState(createPayload)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive' || e.target.name === 'taxable') {
            setproductPayload({ ...productPayload, [e.target.name]: e.target.checked })
        }
        else {
            setproductPayload({ ...productPayload, [e.target.name]: e.target.value })
        }
    }

    const handleCreateProduct = async () => {
        setloading(true);
        const image_data = await handleImageUpload()
        let payload = productPayload
        if (selectedFiles && !image_data) {
            dispatch(showSnackBar({ msg: `Error in Upload Image`, type: "error" }))
            return
        } else if (selectedFiles && image_data) {
            setSelectedFiles(null)
            setproductPayload({ ...productPayload, 'image': image_data[0]['url'] });
            payload = { ...productPayload, 'image': image_data[0]['url'] }
        }
        const url = BACKEND_URL + '/product/add'
        const data = await post(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Create Product Success", type: "success" }))
            fetchAllProducts()
        } else {
            dispatch(showSnackBar({ msg: `Create Product Fail ${data.exception_reason}`, type: "error" }))
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
                    <TextField
                        label="Product Name"
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
                    <TextField
                        label="Product Description"
                        size="small"
                        name='description'
                        fullWidth
                        multiline
                        rows={4}
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Product Price"
                        size="small"
                        name='price'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Product Quantity"
                        size="small"
                        name='quantity'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Product Weight"
                        size="small"
                        name='weight'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <input type="file" className='upload-list-inline' onChange={handleFileChange} />
                </Grid>
                <Grid item xs={4}>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Catgory</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={age}
                            label="Category"
                            onChange={(e)=>onChangeForm(e)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                label="Active"
                                name='isActive'
                                checked={productPayload.isActive}
                                onChange={(e) => onChangeForm(e)}
                                value={productPayload.isActive ? "off" : "on"}
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
                                label="Taxable"
                                name='taxable'
                                checked={productPayload.taxable}
                                onChange={(e) => onChangeForm(e)}
                                value={productPayload.taxable ? "off" : "on"}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Taxable"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        className='bg-blue'
                        onClick={() => handleCreateProduct()}
                        disabled={productPayload.name.length == 0}
                        startIcon={<SaveIcon />}
                    >
                        Add Product
                    </Button>
                </Grid>

            </Grid>
        </Fragment>
    )
}

export default CreateForm