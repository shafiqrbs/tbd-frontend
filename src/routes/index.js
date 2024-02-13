import Dashboard from "../components/modules/sample-module/Dashboard";
import FullForm from "../components/modules/sample-module/FullForm";

const routes = [
    {path: '/', name: 'Dashboard', component: Dashboard},
    {path: '/stock', name: 'Stock', component: FullForm}
]

export default routes