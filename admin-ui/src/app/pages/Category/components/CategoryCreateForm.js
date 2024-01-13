import React, { Fragment, useEffect, useState } from 'react'
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

const createCategoryBody = {
    "name": "",
    "description": "",
    "image": "",
    "isActive": true,
}

const CategoryCreateForm = ({ setloading, fetchAllCategories }) => {
    const dispatch = useDispatch()
    const [categoryPayload, setcategoryPayload] = useState(createCategoryBody)
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive') {
            setcategoryPayload({ ...categoryPayload, [e.target.name]: e.target.checked })
        }
        else {
            setcategoryPayload({ ...categoryPayload, [e.target.name]: e.target.value })
        }
    }

    const handleCreateCategory = async () => {
        setloading(true);
        const image_data = await handleImageUpload()
        let payload = categoryPayload
        if (selectedFiles && !image_data) {
            dispatch(showSnackBar({ msg: `Error in Upload Image`, type: "error" }))
            return
        }else if(selectedFiles && image_data){
            setSelectedFiles(null)
            setcategoryPayload({ ...categoryPayload, 'image': image_data[0]['url'] });
            payload = { ...categoryPayload, 'image': image_data[0]['url'] }
        }
        const url = BACKEND_URL + '/category/add'
        const data = await post(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Create Category Success", type: "success" }))
            fetchAllCategories()
        } else {
            dispatch(showSnackBar({ msg: `Create Category Fail ${data.exception_reason}`, type: "error" }))
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
            const data  = await uploadImage(url,formData);
            if (data.success === true) {
                return data?.data
            }else{
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
                        label="Category Name"
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
                                checked={categoryPayload.isActive}
                                onChange={(e) => onChangeForm(e)}
                                value={categoryPayload.isActive ? "off" : "on"}
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
                        onClick={() => handleCreateCategory()}
                        disabled={categoryPayload.name.length == 0}
                        startIcon={<SaveIcon/>}
                    >
                        Add Category
                    </Button>
                </Grid>

            </Grid>
        </Fragment>
    )
}

export default CategoryCreateForm