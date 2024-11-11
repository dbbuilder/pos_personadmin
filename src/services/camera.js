

export default {
    data(){
        return{
            imageBlob:'',
            imageUrl:'',
            deviceHasCamera:false,
            isApple:true,
            isMobile:false,
            isAndroid:false,
            deviceOS:'',

        }
    },
    async DeviceHasCamera() {
        this.deviceHasCamera=false;
        if(this.isApple){
            return true;
        }
		if(!navigator.mediaDevices){
            return false;
        }else{

           this.deviceHasCamera = await navigator.mediaDevices.enumerateDevices()
                .then(devices=>{  
                    var foundcamera = false;   
                    devices.forEach(device=> {
                        console.log('device ' + device.kind)
                        if(device.kind=='videoinput'){
                            console.log('hascamera true')
                            foundcamera = true;
                        }
                    });
                    console.log("hascamera " + foundcamera)
                    return foundcamera; 
                }).catch(e=> {
                    console.log(e.name + ": " + e.message)
                    return false;
                });
            
        }
        
        return this.deviceHasCamera;
	},
    GetDeviceInfo(){
        this.isApple=false;
        this.isMobile=false;
        this.isAndroid=false;

        var result = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(macintosh)|(mac os)/i);
        this.deviceOS=navigator.userAgent.toLowerCase();
        
        this.isApple = result != null;

        var resultmobile = this.deviceOS.match(/(mobile)/i);
        this.isMobile = resultmobile !=null;

        var resultandroid = this.deviceOS.match(/(android)/i);
        this.isAndroid = resultandroid !=null;

        return this.isApple;
    },
   
    async resizeImage(image, maxDimension){
        const makeImg = image => {
            return new Promise((resolve, _reject) => {
                const img = new Image();
                img.onload = function() {
                resolve(img);
                };
                img.src = URL.createObjectURL(image);
            });
        };
        const downscaleDimension = ({ height, width }, limit) => {
            if (height > width && height > limit) {
                return { height: limit, width: width * (limit / height) };
            } else if (width > height && width > limit) {
                return { height: height * (limit / width), width: limit };
            } else {
                return { height, width };
            }
        };
        const renameToJpg = fname => {
            const pos = fname.lastIndexOf(".");
            return fname.substr(0, pos < 0 ? fname.length : pos) + ".jpg";
        };

        return new Promise((resolve, _reject) => {
            makeImg(image).then(img => {
            const newD = downscaleDimension(img, maxDimension);
            const canvas = document.createElement("canvas");
            canvas.width = newD.width;
            canvas.height = newD.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newD.width, newD.height);
            ctx.canvas.toBlob(blob => {
                resolve(
                new File([blob], renameToJpg(image.name), {
                    type: "image/jpeg"
                })
                );
            }, "image/jpeg");
            });
        });
    },
    
    
    
}

