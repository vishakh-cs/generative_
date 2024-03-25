import useStore from '@/Stores/store'
import Image from 'next/image'
import React from 'react'
import ProfileIconDropDown from './ProfileIconDropdown'

function ProfileIcon({ workspaceId, pageId }) {
    const profileImage = useStore(state => state.profileImage)
    const userEmail = useStore(state => state.userEmail)
    const user_data=useStore(state=>state.user_data)
    // console.log("use_data",use_data);

    return (
        <div>
            <ProfileIconDropDown user_data={user_data}/>
            
            {!user_data.profileImageUrl && user_data.email && (
                <div className='bg-green-600 w-7 h-7 mr-2 rounded-full'>
                     title={userEmail}
                   
                </div>
            )}
        </div>
    )
}

export default ProfileIcon
