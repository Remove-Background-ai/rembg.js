import rembg from "./../";

rembg('input.png').then(({ outputImagePath, cleanup }) => {
    console.log('path', outputImagePath);
    cleanup();
}
);