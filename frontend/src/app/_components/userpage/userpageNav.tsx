'use client'

import { useState } from "react"


export default function UserpageNav ({selected}) {

    

    return (
        <ul className="flex upg-nav">
            <li className={`header-li ${selected === 'post' ? 'selected' : ''}`}>
                <button className="head-btn">Post</button>
            </li>
            <li className={`header-li ${selected === 'friends' ? 'selected' : ''}`}>
                <button className="head-btn">Friends</button>
            </li>
        </ul>
    )
}