export default{
    
    filters:{
        toCurrency(value) {
            if(value==undefined){return ''}
          var formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumSignifantDigits: 2
          });
          return formatter.format(value);
            
        },
        obscureFID(value){
            if(value==undefined){return ''}
            /* value=value.replace('-','')
            if(value.length!=4){
            
                value = "***-**-" + value.substring(6)
            } */
            return value

        },
        handleNull(value){
            if(value==undefined){return ''}
            if(value==null){return ''}
            return value
        },
        formatDate(dateString) {
            const date = new Date(dateString);
                // Then specify how you want your dates to be formatted
            return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
        },
        formatDateForInput(dateString){
            if(dateString==null){return null}
            var t= new Date(dateString);

            var dd = String(t.getDate()).padStart(2, '0');
            var mm = String(t.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = t.getFullYear();

            return yyyy + '-' + mm + '-' + dd
        },
        formatDateForInputToday(){

            var t= new Date();

            var dd = String(t.getDate()).padStart(2, '0');
            var mm = String(t.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = t.getFullYear();

            return yyyy + '-' + mm + '-' + dd
        },
        formatDateTime(dateString){
            const t = new Date(dateString);
            var dd = String(t.getDate()).padStart(2, '0');
            var mm = String(t.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yy = t.getFullYear().toString().substr(-2)
            var hh=String(t.getHours()).padStart(2, '0');
            var nn= String(t.getMinutes()).padStart(2, '0');
            var ss=String(t.getSeconds()).padStart(2, '0');

            return mm + '/' + dd + '/' + yy + ' ' + hh + ':' + nn + ':' + ss
        },
        formatDate_short(dateString){
            const t = new Date(dateString);
            var dd = String(t.getDate()).padStart(2, '0');
            var mm = String(t.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yy = t.getFullYear().toString().substr(-2)
            var hh=String(t.getHours()).padStart(2, '0');
            var nn= String(t.getMinutes()).padStart(2, '0');
            var ss=String(t.getSeconds()).padStart(2, '0');

            return mm + '/' + dd + '/' + yy 
        },
        formatPhone(phn) {
            console.log('formatph ' + phn)
            if(phn==null){return ''}
            if(phn==''){return ''}
            phn=phn.replace('-','').replace('(','').replace(')','').replace(' ','')
            console.log('cleannum ' + phn)
    
            if(phn.length==11 && phn.substring(0,1)=='1'){phn=phn.substring(1)}
    
            phn = "(" + phn.substring(0,3) + ")" + phn.substring(3,6) + "-" + phn.substring(6);
            return phn
                
        },
      },
    methods:{
        capitalize(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
          },
        getextension(filename){
            return filename.slice(filename.lastIndexOf('.'))
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
}