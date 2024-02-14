'use client'

import { useState } from "react"

interface UserPageNavProps {
    selected: 'post' | 'friends',
    selectTab: React.Dispatch<React.SetStateAction<'post' | 'friends'>>

}

export default function UserpageNav ({selected, selectTab}:UserPageNavProps) {

    

    return (
        <ul className="flex upg-nav">
            <li className={`header-li ${selected === 'post' ? 'selected' : ''}`}>
                <button className="head-btn" onClick={() => selectTab('post')}>Post</button>
            </li>
            <li className={`header-li ${selected === 'friends' ? 'selected' : ''}`}>
                <button className="head-btn" onClick={() => selectTab('friends')}>Friends</button>
            </li>
        </ul>
    )
}