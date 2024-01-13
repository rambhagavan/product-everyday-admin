const successResponse = (status=200,data=null,msg=null) =>{
    return {
        status: status,
        success: true,
        exception_reason: null,
        msg: msg,
        data:data
    }
}

const errorResponse = (status=500,err=null,msg=null) => {
    return{
        status: status,
        success: false,
        exception_reason: err,
        msg:msg,
        data:null
    }
}

module.exports = {
    successResponse,
    errorResponse
}