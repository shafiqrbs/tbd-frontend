import Dashboard from "../components/dashboard/Dashboard"
import _Form from "../components/dashboard/_Form";

const routes = [
    {path: '/', name: 'Dashboard', component: Dashboard},
    {path: '/stock', name: 'Stock', component: _Form}
]

export default routes