import ControlSidebar from "./ControlSidebar";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function BackOffice(props){
    return (
        <>
            <div className="wrapper">
                <Navbar/>
                <Sidebar/>
                <div className="content-wrapper">
                    {props.children}
                </div>
                <Footer/>
                <ControlSidebar/>
            </div>
        </>
    )
}

export default BackOffice;