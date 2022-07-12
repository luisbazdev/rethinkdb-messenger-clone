import React from "react"

import { getExtensions, extractExtension } from "../../utils/extensions"

export default function Preview({file, preview}){

    let extensions = getExtensions();

    const fileExt = extractExtension(file.name);

    return (
        <div>
            {extensions.image.find(_ext => _ext === fileExt) && <img className='selected_file' alt='Preview' src={preview}/>}
            {extensions.video.find(_ext => _ext === fileExt) && <video className='selected_file' src={preview}/>}
        </div>
    )
}