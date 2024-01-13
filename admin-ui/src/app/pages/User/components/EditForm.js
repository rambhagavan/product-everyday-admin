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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EditForm = ({ user, setloading, fetchAllUsers }) => {
    const dispatch = useDispatch()
    const [userPayload, setuserPayload] = useState(user)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [deleteImgUrl, setdeleteImgUrl] = useState(null)

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

    const handleUpdateUser = async () => {
        setloading(true);
        const deletedimage = await handleDeleteImage()
        console.log(deletedimage)
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
        const url = BACKEND_URL + '/user/' + payload._id
        const data = await put(url, payload)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Update User Success", type: "success" }))
            fetchAllUsers()
        } else {
            dispatch(showSnackBar({ msg: `Update User Fail ${data.exception_reason}`, type: "error" }))
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
            <Grid container spacing={2} marginBottom={2} sx={{ backgroundColor: 'white', }}>
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        size="small"
                        name='email'
                        disabled={true}
                        value={userPayload.email}
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
                        value={userPayload.firstName}
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Last Name"
                        size="small"
                        name='lastName'
                        fullWidth
                        value={userPayload.lastName}
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                {/* <Grid item xs={12}>
                    <TextField
                        label="Password"
                        type='password'
                        size="small"
                        name='password'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid> */}
                <Grid item xs={12}>
                    <TextField
                        label="Phone Number"
                        size="small"
                        name='phoneNumber'
                        fullWidth
                        value={userPayload.phoneNumber}
                        onChange={(e) => onChangeForm(e)}
                    />
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
                    {
                        userPayload.avatar == "" ?
                            <input type="file" className='upload-list-inline' onChange={handleFileChange} /> :
                            <div className=''>
                                <Image
                                    width={100}
                                    src={userPayload.avatar}
                                    className='me-5'
                                />
                                <IconButton aria-label="delete" size="small">
                                    <DeleteIcon className='text-danger' onClick={() => {
                                        setdeleteImgUrl(userPayload.image);
                                        setuserPayload({ ...userPayload, image: "" })
                                    }} />
                                </IconButton>
                            </div>
                    }

                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        size='small'
                        color="primary"
                        className='bg-blue'
                        onClick={() => handleUpdateUser()}
                        disabled={userPayload.firstName.length == 0}
                        startIcon={<SaveAsIcon />}
                    >
                        Update User
                    </Button>
                </Grid>
            </Grid>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>User Address</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                size="small"
                                name='address'
                                fullWidth
                                multiline
                                rows={4}
                                value={""}
                                onChange={(e) => onChangeForm(e)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="LandMark"
                                size="small"
                                name='landmark'
                                fullWidth
                                value={userPayload.lastName}
                                onChange={(e) => onChangeForm(e)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="State"
                                size="small"
                                name='state'
                                fullWidth
                                value={userPayload.lastName}
                                onChange={(e) => onChangeForm(e)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="City"
                                size="small"
                                name='city'
                                fullWidth
                                value={userPayload.lastName}
                                onChange={(e) => onChangeForm(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                size='small'
                                color="primary"
                                className='bg-blue'
                                onClick={() => handleUpdateUser()}
                                disabled={userPayload.firstName.length == 0}
                                startIcon={<SaveAsIcon />}
                            >
                                Add Address
                            </Button>
                        </Grid>
                        </Grid>

                </AccordionDetails>
            </Accordion>


        </Fragment>
    )
}

export default EditForm