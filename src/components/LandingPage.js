import React, { useState, useEffect, useContext } from "react"
import Axios from "axios";
import { AuthContext } from '../firebase/Auth'
import { Redirect } from "react-router-dom";
import FollowingTags from "./FollowingTags";
import QuestionCard from "./QuestionCard";

const LandingPage = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [userData,setUserData] = useState(undefined);
    const [refreshCount,setRefreshCount] = useState(0);

    const refreshData = {
        refreshCount : refreshCount,
        setRefreshCount : setRefreshCount
    }

    useEffect(() => {
        const getData = async () => {
            if(currentUser)
            {const {data} = await Axios.get(`http://localhost:8080/users/userInfo/${currentUser.email}`);
            setUserData(data);}
        }
        getData();
    },[]);

    
    if(null === userData)
        return (<Redirect to='/notfound'></Redirect>)
    
    if(undefined === userData)
        return (<div className='loader'></div>);

    return(
        <div className="tag_body">
            <FollowingTags refreshData={refreshData}/>
            <div className='tag_body_main'>
                {userData && userData.questions.map((q) => 
                    <QuestionCard data={q} key={q._id} />
                )}
            </div>
        </div>
    )

    
}

export default LandingPage;