export default{
    
    data(){
        return{
            //colors
            backgroundColor:'#',
            headerColor:'#FFFFFF',
            frameColor:'#FFFFFF',
            buttonColor:'#E32323',
            highlightButtonColor:'#F7C142',
            headerButtonColor:'#E32323',
            
            textColor:'#0E2049',
            lightTextColor:'#FFFFFF',
            buttonTextColor:'#0E2049',
            headerTextColor:'#FFFFFF',
            headerButtonTextColor:'#0E2049',
            alertColor:'#E32323',
            successColor:'#699864',
            inactiveColor:'#C3C3C3',

    
            menuTextColor:'#0E2049',
        }
    },
    methods:{
        setColors(){
            this.backgroundColor=window.BACKGROUND_COLOR
            this.headerColor=window.HEADER_COLOR
            this.frameColor=window.FRAME_COLOR

            this.buttonColor = window.BUTTON_COLOR
            this.highlightButtonColor = window.HIGHLIGHT_BUTTON_COLOR
            this.headerButtonColor=window.HEADER_BUTTON_COLOR

            this.textColor=window.TEXT_COLOR
            this.lightTextColor=window.LIGHT_TEXT_COLOR
            this.buttonTextColor=window.BUTTON_TEXT_COLOR
            this.headerTextColor=window.HEADER_TEXT_COLOR
            this.headerButtonTextColor=window.HEADER_BUTTON_TEXT_COLOR

            this.alertColor=window.ALERT_COLOR
            this.successColor=window.SUCCESS_COLOR
            this.inactiveColor=window.INACTIVE_COLOR
        },
        /* overrideColors(titleText, mainText, menuText,titleBackground,mainBackground){
            this.titleTextColor =titleText
            this.mainTextColor=mainText
            this.menuTextColor=menuText
            this.titleBackgroundColor=titleBackground   
            this.backgroundColor=mainBackground
        },
        overridePrimaryColor(primary){
            this.primaryColor=primary
        },
        overrideHighlightColor(highlight){
            this.highlightColor=highlight
        } */
    },
    computed:{
        configStyle(){
            return{
                '--background-color':this.backgroundColor,
                '--header-color':this.headerColor,
                '--frame-color':this.frameColor,
                '--button-color':this.buttonColor,
                '--highlight-button-color':this.highlightButtonColor,
                '--header-button-color':this.headerButtonColor,
                '--text-color':this.textColor,
                '--light-text-color':this.lightTextColor,
                '--button-text-color':this.buttonTextColor,
                '--header-text-color':this.headerTextColor,
                '--header-button-text-color':this.headerButtonTextColor,
                '--alert-color':this.alertColor,
                '--success-color':this.successColor,
                '--inactive-color':this.inactiveColor,

                '--menu-text-color':this.menuTextColor,

            }
        }
    }
    
}