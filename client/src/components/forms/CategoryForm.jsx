import React from 'react'

export default function CategoryForm({value, setValue, handleSubmit, buttonText="Submit", handleDelete}) {
  return (
    <div className='p-3'>
        <form onSubmit={handleSubmit}>
            <input 
            type="text" 
            className='form-control value'
            placeholder='Write category value'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            />
            <div className='d-flex justify-content-between'>
              <button type='submit' className='btn btn-primary mt-3'>
              {buttonText}
              </button>
              {handleDelete && (
                <button onClick={handleDelete} className='btn btn-danger mt-3'>
                  Delete
                </button>
              )}
            </div>
        </form>
    </div>
  )
}
