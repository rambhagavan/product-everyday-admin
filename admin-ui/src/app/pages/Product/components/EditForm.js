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

const EditForm = ({ product, setloading, fetchAllProducts }) => {
    const dispatch = useDispatch()
    const [productPayload, setproductPayload] = useState(product)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [deleteImgUrl, setdeleteImgUrl] = useState(null)

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive') {
            setproductPayload({ ...productPayload, [e.target.name]: e.target.checked })
        }
        else {
            setproductPayload({ ...productPayload, [e.target.name]: e.target.value })
        }
    }

    const handleUpdateProduct = async () => {
        setloading(true);
        const deletedimage = await handleDeleteImage()
        console.log(deletedimage)
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
        const url = BACKEND_URL + '/product/' + payload._id
        const data = await put(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Update Product Success", type: "success" }))
            fetchAllProducts()
        } else {
            dispatch(showSnackBar({ msg: `Update Product Fail ${data.exception_reason}`, type: "error" }))
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

    const handleDeleteImage = async () => {
        if (deleteImgUrl) {
            let id = getPublicIdFromImageUrl(deleteImgUrl)
            const url = BACKEND_URL + '/upload/' + id
            const data = await remove(url);
            if (data.success === true) {
                return true
            } else {
                console.log(data)
                return false
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
                        disabled={true}
                        name='name'
                        fullWidth
                        value={productPayload.name}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Product Description"
                        size="small"
                        name='description'
                        fullWidth
                        multiline
                        rows={4}
                        value={productPayload.description}
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    {
                        productPayload.image == "" ?
                            <input type="file" className='upload-list-inline' onChange={handleFileChange} /> :
                            <div className=''>
                                <Image
                                    width={100}
                                    src={productPayload.image}
                                    className='me-5'
                                />
                                <IconButton aria-label="delete" size="small">
                                    <DeleteIcon className='text-danger' onClick={() => {
                                        setdeleteImgUrl(productPayload.image);
                                        setproductPayload({ ...productPayload, image: "" })
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
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        className='bg-blue'
                        onClick={() => handleUpdateProduct()}
                        disabled={productPayload.name.length == 0}
                        startIcon={<SaveAsIcon />}
                    >
                        Update Product
                    </Button>
                </Grid>

            </Grid>
        </Fragment>
    )
}

export default EditForm