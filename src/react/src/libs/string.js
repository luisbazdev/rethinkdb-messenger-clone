import { getExtensions } from "../utils/extensions";

var extensions = getExtensions();

export function formatMessage(id, _msg, _user){
    let message;

    if(_msg.unsent){
        if(_msg.from === id)
            message = `You unsent a message`;
        else
            message = `${_user} unsent a message`;
    }

    else if(_msg.message){
        if(_msg.from === id)
            message = `You: ${_msg.message}`;
        else
            message = `${_msg.message}`;
    }

    else{
        if(extensions.image.findIndex(_ext => _ext === _msg.file_ext) !== -1){
            if(_msg.from === id)
                message = 'You sent a photo.';
            else
                message = `${_user} sent a photo.`;
        }
        if(extensions.video.findIndex(_ext => _ext === _msg.file_ext) !== -1){
            if(_msg.from === id)
                message = 'You sent a video.';
            else
                message = `${_user} sent a video.`;
        }
    }

    return message;
}

export function formatDate(date){
    let _date = new Date(date);

    let formattedDate = `${_date.toLocaleDateString()} · ${_date.toLocaleTimeString()}`;

    return formattedDate;
}
