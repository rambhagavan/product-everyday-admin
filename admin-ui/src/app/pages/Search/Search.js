import React from 'react'

const Search = () => {
    return (
        <div className='container'>
            <div class="row mt-5">
                <div className='col d-flex justify-content-center'>
                    <input id="search-input me-2" type="search" class="form form-control" />
                    <button id="search-button" type="button" class="btn btn-primary">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Search