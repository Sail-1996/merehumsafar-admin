export const validateImageDimensions = (file, width = 500, height = 500, onInvalid) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file selected.");
            return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            if (img.width !== width || img.height !== height) {
                if (onInvalid) {
                    onInvalid(); 
                }
                reject(`Image must be ${width}x${height} pixels.`);
            } else {
                resolve(true); 
            }
        };

        img.onerror = () => {
            reject("Invalid image file.");
        };
    });
};
