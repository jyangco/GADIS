import Index from "../Index"
import Dashboard from "../Dashboard"
import NotFound from "./NotFound"

//GADES
import GADES from "../gades/GADES"

//NOTIFICATIONS
import AllNotifs from "../notifications/AllNotifs"
import SingleNotification from "../notifications/SingleNotification"

//GAD AGENDA
import Agenda from "../agenda/Agenda"
import Annex_A from "../agenda/Annex_A"
import AnnexA_View from '../agenda/AnnexA_View'
import Annex_B from "../agenda/Annex_B"
import AnnexB_TABs from "../agenda/AnnexB_TABs"
import AgendaView from '../agenda/AgendaView'

//PPA
import PPAList from '../ppa/PPAList'
import NewPPA from '../ppa/NewPPA'
import DirectPPAView from "../ppa/DirectPPAView"
import AttributedPPAView from "../ppa/AttributedPPAView"
import PPAStatusList from "../ppa/PPAStatusList"

//GAD ISSUES
import GADIssues from "../ppa/GADIssues"

//BENEFICIARIES
import NewBeneficiaries from '../beneficiaries/NewBeneficiaries'

//BUDGETS
import NewGADBudget from '../budget/NewGADBudget'
import BudgetList from '../budget/BudgetList'
import NWMCBudgetList from '../budget/NWMCBudgetList'

//REPORTS
import ReportView from "../report/ReportView"
import NewReport from "../report/NewReport"
import ReportSubmit from "../report/SubmitGPB"
import SubmitGAR from "../report/SubmitGAR"

//RESPUB
import ResPub from "../respub/ResPub"
import NewResPub from "../respub/NewResPub"

//GALLERY
import GalleryView from "../gallery/GalleryView"
import UploadImages from "../gallery/UploadImages"

//USER
import UserProfile from "../user/UserProfile"

//TRAINING
import TrainingList from "../training/TrainingList"

//ADMIN
import AdminIndex from '../admin/Index'
import AdminAgenda from '../admin/pages/Agenda'
import AdminAnnexB from '../admin/pages/AnnexB'
import AdminPPAs from '../admin/pages/PPAs'
import AdminSinglePPA from '../admin/pages/SinglePPA'
import AdminReports from '../admin/pages/Reports'
import AdminResPubs from '../admin/pages/ResourcesPublications'
import AdminGallery from '../admin/pages/Gallery'

const routes = [
    { path: "/", exact: true, name: "Login", component: Index },
    { path: "/dashboard", exact: true, name: "Dashboard", component: Dashboard },
    //GADES
    { path: "/GADES", exact: true, name: "GADES", component: GADES },
    //NOTIFICATIONS
    { path: "/messages", exact: true, name: "Notifications", component: AllNotifs },
    { path: "/messages/:id", exact: true, name: "Notifications", component: SingleNotification },
    //GAD AGENDA
    { path: "/GAD-agenda", exact: true, name: "GAD Agenda", component: Agenda },
    { path: "/GAD-agenda/:id", exact: true, name: "GAD Agenda", component: AgendaView },
    { path: "/GAD-agenda/New(Annex_A)", exact: true, name: "GAD Agenda Annex A", component: Annex_A },
    { path: "/GAD-agenda/AnnexA/:id", exact: true, name: "GAD Agenda Annex A", component: AnnexA_View },
    { path: "/GAD-agenda/AnnexB/:id", exact: true, name: "GAD Agenda Annex B", component: Annex_B },
    { path: "/GAD-agenda/AnnexB/:type/Annual_T-A-B/:id", exact: true, name: "GAD Agenda Annex B", component: AnnexB_TABs },
    //PPAs
    { path: "/PPA", exact: true, name: "PPA", component: PPAList },
    { path: "/PPA/New", exact: true, name: "PPA", component: NewPPA },
    { path: "/PPA/Direct/:id", exact: true, name: "PPA", component: DirectPPAView },
    { path: "/PPA/Attributed/:id", exact: true, name: "PPA", component: AttributedPPAView },
    //ISSUES
    { path: "/GAD-issues", exact: true, name: "PPA", component: GADIssues },
    //BENEFICIARIES
    { path: "/PPA/Direct/:id/New-beneficiaries", exact: true, name: "PPA", component: NewBeneficiaries },
    //BUDGETS
    { path: "/PPA/Direct/:id/New-budgets", exact: true, name: "Budgets", component: NewGADBudget },
    { path: "/Budget", exact: true, name: "Budgets", component: BudgetList },
    { path: "/Budget/NWMC", exact: true, name: "Budgets", component: NWMCBudgetList },
    //STATUS
    { path: "/Status", exact: true, name: "Status", component: PPAStatusList },
    //REPORTS
    { path: "/Reports", exact: true, name: "Report", component: ReportView },
    { path: "/Reports/New", exact: true, name: "Report", component: NewReport },
    { path: "/Reports/GPB/:id", exact: true, name: "Report", component: ReportSubmit },
    { path: "/Reports/GAR/:id", exact: true, name: "Report", component: SubmitGAR },
    //RESPUBS
    { path: "/Resources-and-Publications", exact: true, name: "ResPubs", component: ResPub },
    { path: "/Resources-and-Publications/New", exact: true, name: "ResPubs", component: NewResPub },
    //GALLERY
    { path: "/Gallery", exact: true, name: "Gallery", component: GalleryView },
    { path: "/Gallery/New", exact: true, name: "Gallery", component: UploadImages },
    //USER
    { path: "/My-profile", exact: true, name: "User", component: UserProfile },
    //TRAINING
    { path: "/Training", exact: true, name: "User", component: TrainingList },
    { path:"*",  name: "NotAuthorized", component: NotFound },

    //ADMIN
    { path:"/Admin/Dashboard", exact: true,  name: "Admin", component: AdminIndex },
    { path:"/Admin/Agenda", exact: true,  name: "Admin", component: AdminAgenda },
    { path:"/Admin/Agenda/:id/AnnexB", exact: true,  name: "Admin", component: AdminAnnexB },
    { path:"/Admin/PPAs", exact: true,  name: "Admin", component: AdminPPAs },
    { path:"/Admin/PPAs/:id", exact: true,  name: "Admin", component: AdminSinglePPA },
    { path:"/Admin/Reports", exact: true,  name: "Admin", component: AdminReports },
    { path:"/Admin/Resources-and-Publications", exact: true,  name: "Admin", component: AdminResPubs },
    { path:"/Admin/Gallery", exact: true,  name: "Admin", component: AdminGallery },
]

export default routes