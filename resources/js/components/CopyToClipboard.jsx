import React from 'react'
import Swal from 'sweetalert2'

const CopyToClipboard = ({ text }) => {
    const handleCopyClick = () => {
        navigator.clipboard.writeText(text)
        .then(() => {
            Swal.fire({
                position: 'top-end',
                text: 'Text copied to clipboard',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                toast: true
            })
        })
        .catch((error) => {
            Swal.fire({
                position: 'top-end',
                text: (error),
                showConfirmButton: false,
                timer: 2000,
                icon: 'error',
                toast: true
            })
        })
    }

    return (
        <div className='m-0 p-0'>
            <button className="text-success" onClick={handleCopyClick}> <i className="fas fa-clipboard text-3xl"> </i></button>
        </div>
    )
}

export default CopyToClipboard
