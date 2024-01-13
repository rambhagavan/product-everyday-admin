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

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const createPayload = {
    "email": "",
    "firstName": "",
    "lastName": "",
    "password": "",
    "phoneNumber": "",
    "active": true,
    "verified": true,
    "avatar": "https://res.cloudinary.com/dw3qovmta/image/upload/v1700228745/rydqhyqyz0ay8abghhdk.png",
    "role": "MEMBER"
}


const CreateForm = ({ setloading, fetchAllUsers }) => {
    const dispatch = useDispatch()
    const [userPayload, setuserPayload] = useState(createPayload)
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'active' || e.target.name === 'verified') {
            setuserPayload({ ...userPayload, [e.target.name]: e.target.checked })
        }
        else {
            setuserPayload({ ...userPayload, [e.target.name]: e.target.value })
        }
    }

    const handleCreateUser = async () => {
        setloading(true);
        const image_data = await handleImageUpload()
        let payload = userPayload
        if (selectedFiles && !image_data) {
            dispatch(showSnackBar({ msg: `Error in Upload Image`, type: "error" }))
            return
        } else if (selectedFiles && image_data) {
            setSelectedFiles(null)
            setuserPayload({ ...userPayload, 'image': image_data[0]['url'] });
            payload = { ...userPayload, 'image': image_data[0]['url'] }
        }
        const url = BACKEND_URL + '/user/add'
        const data = await post(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Create User Success", type: "success" }))
            fetchAllUsers()
        } else {
            dispatch(showSnackBar({ msg: `Create User Fail ${data.exception_reason}`, type: "error" }))
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
                        label="Email"
                        size="small"
                        name='email'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="First Name"
                        size="small"
                        name='firstName'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Last Name"
                        size="small"
                        name='lastName'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Password"
                        type='password'
                        size="small"
                        name='password'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Phone Number"
                        size="small"
                        name='phoneNumber'
                        fullWidth
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
                                name='active'
                                checked={userPayload.active}
                                onChange={(e) => onChangeForm(e)}
                                value={userPayload.active ? "off" : "on"}
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
                                label="Verified"
                                name='verified'
                                checked={userPayload.verified}
                                onChange={(e) => onChangeForm(e)}
                                value={userPayload.verified ? "off" : "on"}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Verified"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">User Type</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={userPayload.role}
                            name='role'
                            label="User Type"
                            onChange={onChangeForm}
                        >
                            <MenuItem value={"MEMBER"}>MEMBER</MenuItem>
                            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                            <MenuItem value={"STAFF"}>STAFF</MenuItem>
                            <MenuItem value={"SELLER"}>SELLER</MenuItem>
                            <MenuItem value={"STAFF"}>STAFF</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        className='bg-blue'
                        onClick={() => handleCreateUser()}
                        disabled={userPayload.firstName.length == 0 || userPayload.email.length == 0 || userPayload.password == 0}
                        startIcon={<SaveIcon />}
                    >
                        Add User
                    </Button>
                </Grid>

            </Grid>
        </Fragment>
    )
}

export default CreateForm