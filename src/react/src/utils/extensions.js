export function getExtensions(){
    var image = ['jpg', 'png', 'jpeg', 'gif'];
    var video = ['mp4', 'ogg', 'webm', 'wmv', 'avi', 'mpg', 'mpeg'];

    return { image, video }
}

export function extractExtension(filename){
    var extension = filename.substring(filename.lastIndexOf(".") + 1);

    return extension;
}