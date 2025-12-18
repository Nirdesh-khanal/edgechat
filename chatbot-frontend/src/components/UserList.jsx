import React from 'react'
import { useCallback } from 'react'

const UserList = () => {
  return (
    <div>
        {users.map((u)=>(
            <button key={u.id} onClick={()=> onselect(u.id)}>
                {useCallback.username}
            </button>
        ))}
    </div>
  )
}

export default UserList