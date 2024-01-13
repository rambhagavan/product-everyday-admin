import React, { useState } from 'react'
import { ContentBox } from '../../styles/AppStyles'

const DummyTest = () => {
    const [openLoader, setopenLoader] = useState(false)
    const handleOpenLoader = ()=>{
        console.log(openLoader)
        setopenLoader(!openLoader)
    }
    return (
        <ContentBox>
        </ContentBox>
    )
}

export default DummyTest