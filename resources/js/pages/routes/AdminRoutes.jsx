//ADMIN
import AdminIndex from '../admin/Index'
import AdminAgenda from '../admin/pages/Agenda'
import AdminAnnexB from '../admin/pages/AnnexB'
import AdminPPAs from '../admin/pages/PPAs'
import AdminSinglePPA from '../admin/pages/SinglePPA'
import AdminReports from '../admin/pages/Reports'
import AdminResPubs from '../admin/pages/ResourcesPublications'
import AdminGallery from '../admin/pages/Gallery'
import UserManagement from "../admin/pages/UserManagement"
import EmployeeManagement from "../admin/pages/EmployeeManagement"

import Index from '../Index'
import NotFound from './NotFound'

const adminRoutes = [
//LOGIN
    { path: "/", exact: true, name: "Login", component: Index },

//ADMIN
    { path:"/Admin/Dashboard", exact: true,  name: "Admin", component: AdminIndex },
    { path:"/Admin/Agenda", exact: true,  name: "Admin", component: AdminAgenda },
    { path:"/Admin/Agenda/:id/AnnexB", exact: true,  name: "Admin", component: AdminAnnexB },
    { path:"/Admin/PPAs", exact: true,  name: "Admin", component: AdminPPAs },
    { path:"/Admin/PPAs/:id", exact: true,  name: "Admin", component: AdminSinglePPA },
    { path:"/Admin/Reports", exact: true,  name: "Admin", component: AdminReports },
    { path:"/Admin/Resources-and-Publications", exact: true,  name: "Admin", component: AdminResPubs },
    { path:"/Admin/Gallery", exact: true,  name: "Admin", component: AdminGallery },
    { path:"/Admin/User-Management", exact: true,  name: "Admin", component: UserManagement },
    { path:"/Admin/Employee-Management", exact: true,  name: "Admin", component: EmployeeManagement },
    { path:"*",  name: "NotAuthorized", component: NotFound },
]

export default adminRoutes