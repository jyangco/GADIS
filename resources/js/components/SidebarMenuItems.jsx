import CryptoJS from 'crypto-js'

var UserRole  = CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('auth')).role, 'gadisgood').toString(CryptoJS.enc.Utf8)

const SidebarMenuItems = [
    {
        id: 1,
        name: 
            <button>
                <i className="fas fa-folder-tree me-3"></i>
                GADES
            </button>,
        to: "/GADES",
        className: "no-underline"
    },
    {
        id: 2,
        name: 
            <button>
                <i className="fas fa-bullseye me-3"></i>
                GAD Agenda
            </button>,
        to: "/GAD-agenda",
        className: "no-underline"
    },
]

export default SidebarMenuItems