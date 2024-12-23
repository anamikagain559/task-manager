import { Helmet } from "react-helmet-async";
import LatestSurvey from "../LatestTask";

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Survey App | Home</title>
            </Helmet>
          
            <LatestSurvey></LatestSurvey>
          
           
        </div>
    );
};

export default Home;