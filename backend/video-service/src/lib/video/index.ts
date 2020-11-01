import ffmpeg from 'ffmpeg';
import path from 'path';

const processVideo = (): void => {
    try {
        // eslint-disable-next-line new-cap
        const process = new ffmpeg(path.join(__dirname, '/rat.mp4'));
        process.then((video) => {
            console.log('The video is ready to be processed');
            console.log(video.metadata);
        }, (err) => {
            console.log('Error 2 processing Video');
            console.error(err);
        });
    } catch (err) {
        console.log('Error processing Video');
        console.error(err);
    }
};

export default processVideo;
