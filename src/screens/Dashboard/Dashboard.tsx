import DashboardMain from '../../components/Dashboard/DashboardMain';
import './DashboardStyle.scss';
import Header from '../../components/layout/Header/Header';

const Dashboard = () => {
    return (
        <>
            <p className="opensea_available" >NOW AVAILABLE ON <a href="#" >OPENSEA</a></p>
            <Header />
            <DashboardMain />
        </>
    );
}

export default Dashboard;
