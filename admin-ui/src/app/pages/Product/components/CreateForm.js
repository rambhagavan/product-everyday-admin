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
import { get,post, uploadImage } from '../../../services/Common';
import SaveIcon from '@mui/icons-material/Save';
import { BACKEND_URL } from '../../../core/constants';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useSelector} from 'react-redux'
import  { useEffect} from 'react'
import {addCategoryList} from '../../../redux/actions/categoryListDataActions'




const createPayload = {
    "name": "",
    "description": "",
    "quantity": 0,
    "price": 0,
    "weight": 0,
    "image": "",
    "taxable": false,
    "isActive": true,
    "category": "",
}


const CreateForm = ({ setloading, fetchAllProducts }) => {
    const dispatch = useDispatch()

   

    const [productPayload, setproductPayload] = useState(createPayload)
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [selectedCategoryData, setSelectedCategory] = useState('')
    
    useEffect(() => {
        fetchAllCategories()
      }, [])
    
      const fetchAllCategories = async (sortOrder = false, page = 1, limit = 10) => {
        const url = BACKEND_URL + '/category'
        const params = {
          sortOrder: sortOrder,
          page: page,
          limit: limit
        }
    
        const data = await get(url, params)
        
        if (data && data?.success === true) {
          console.log(data);  
          dispatch(addCategoryList(data))
          
      } 
    }

    const categories = useSelector((state)=>state.categoryListDataReducer.categoryList.data.categories);
    

    // categories.map((categoryName)=>
    // (console.log(categoryName.name)))

    // const handleChange = (event) => {
    //     setSelectedCategory(event.target.value);
    // };
     
   
   //console.log(categories[0].name)
    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive' || e.target.name === 'taxable'  ) {
            setproductPayload({ ...productPayload, [e.target.name]: e.target.checked })
        }
        else {
            setproductPayload({ ...productPayload, [e.target.name]: e.target.value })
        }
        if(e.target.name==='category')
        {
          setproductPayload({...productPayload , [e.target.name]: e.target.value})
          setSelectedCategory(e.target.value)
        }

        
          
    }
    // const onChangeForm = (e) => {
    //     console.log(e.target.name)
    //     if (e.target.name === 'isActive' || e.target.name === 'taxable') {
    //         setproductPayload({ ...productPayload, [e.target.name]: e.target.checked });
    //     } else if (e.target.name === 'category') {
    //         setSelectedCategory(e.target.value);
    //         setproductPayload({ ...productPayload, 'category': e.target.value });
    //     } else {
    //         setproductPayload({ ...productPayload, [e.target.name]: e.target.value });
    //     }
    // };


    const handleCreateProduct = async () => {
        setloading(true); 
        
        const image_data = await handleImageUpload()
        let payload = productPayload
        console.log(selectedCategoryData)
        if (selectedCategoryData)
        {
            console.log(selectedCategoryData)
            
        }
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
        console.log(productPayload)
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

    const handleCategorySelect = (e) => {
        const selectedCategory = e.target.value;
        // Assuming you have a function to update the payload with the selected category
        setSelectedCategory(selectedCategory);
      };
    

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
                {/* <Grid item xs={4}>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Category</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={selectedCategoryData}
                            label="Category"
                            onChange={(e)=>onChangeForm(e)}
                            displayEmpty 
                        >
                             
                            {categories.map((categoryName)=>(
                            <MenuItem key={categoryName.id}  
                            onClick={() => handleCategoryClick(categoryName)}>{categoryName.name}</MenuItem>))}
                            
                            
                        </Select>
                    </FormControl>
                </Grid> */}
                 {/* <Grid item xs={4}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Category</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectedCategoryData}
                        label="Category"
                        onChange={(e) => onChangeForm(e)}
                        displayEmpty
                    >
                        {categories.map((categoryName) => (
                            <MenuItem key={categoryName.id} value={categoryName.name}
                            onClick={handleCategoryClick}>
                                {categoryName.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid> */}
                 <Grid item xs={4}>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Category</InputLabel>
                       <Select
                          labelId="demo-select-small-label"
                           id="demo-select-small"
                           value={selectedCategoryData}
                           name='category'
                          label="Category"
                          onChange={(e) => onChangeForm(e)}
                           displayEmpty
                             >
                              {categories.map((categoryName) => (
                        <MenuItem key={categoryName.id} value={categoryName.name}>
                                  {categoryName.name}
                        </MenuItem>
                           ))}
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