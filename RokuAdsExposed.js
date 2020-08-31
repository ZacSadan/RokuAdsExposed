// ==UserScript==
// @name         Roku Ads Exposed
// @namespace    https://www.protected.media/
// @version      1.98
// @description  Roku Ads Exposed [ By Protected Media https://www.protected.media/ ]
// @author       Zac Sadan
// @match        https://channelstore.roku.com/*
// @grant        none
// ==/UserScript==

// Sorry about the ugly code ...

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

function parseRokuData (){
	//console.log(this.responseText);

    var isAdSupported_str ="";
    var revenueSources ="";
    var rankByWatched_str = "";
    var secondsWatched_str = "";
    var billing_str = "";
    var AdditionalFees ="";
    var misc_str = "";
    var createdDate_str = "";

	var obj = JSON.parse(this.responseText);

    //----------------
    isAdSupported_str="";
    /*
    if(obj.feedChannel.isAdSupported)
        isAdSupported_str = "<div class='GREEN'>Support Ads By Roku </div>";
    else
        isAdSupported_str = "<div class='ORANGE'>Not Support Ads By Roku ( Might Have Other Ads ) </div>";
     */
    //isAdSupported_str = "<div>" + "RevenueSources:" + obj.details.currentDetail.revenueSources + "</div>";
    //----------------
    if(obj.details.currentDetail.revenueSources && obj.details.currentDetail.revenueSources.toString())
       revenueSources = "Revenue: "+obj.details.currentDetail.revenueSources.toString()+"";
    else
       revenueSources = "Revenue: None";
    //----------------
    if(obj.feedChannel.rankByWatched)
    {
        if(obj.feedChannel.rankByWatched < 10)
            rankByWatched_str = "<div class='GREEN'>Watch Rank: "+obj.feedChannel.rankByWatched+"</div>";
        else if(obj.feedChannel.rankByWatched > 100)
            rankByWatched_str = "<div class='RED'>Watch Rank: "+obj.feedChannel.rankByWatched+"</div>";
        else
            rankByWatched_str = "<div class='NONE'>Watch Rank: "+obj.feedChannel.rankByWatched+"</div>";
    }
    //----------------
    if(obj.feedChannel.secondsWatched)
    {
        if(obj.feedChannel.secondsWatched > 100000 )
            secondsWatched_str = "<div class='GREEN'>"+obj.feedChannel.secondsWatched.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"</div>";
        else if(obj.feedChannel.secondsWatched < 1000 )
            secondsWatched_str = "<div class='RED'>"+obj.feedChannel.secondsWatched.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"</div>";
        else
            secondsWatched_str = "<div class='NONE'>"+obj.feedChannel.secondsWatched.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"</div>";
    }
     //----------------

    if(obj.feedChannel.isInAppPurchaseOffered)  billing_str += "InAppPurchaseOffered,";
    if(obj.feedChannel.isRokuBillingEnabled)    billing_str += "RokuBillingEnabled,";
    if(obj.feedChannel.paymentSchedule&&obj.feedChannel.paymentSchedule!="None")         billing_str += obj.feedChannel.paymentSchedule.toString() +",";
    if(obj.feedChannel.price!=0)                billing_str += obj.feedChannel.price.toString() +",";
    if(obj.feedChannel.recentSales)             billing_str += obj.feedChannel.recentSales.toString() +",";
    if(obj.details.currentDetail.isFree)
        billing_str += "Free,";
    else
        billing_str += "Not Free!,";
    if(obj.details.currentDetail.isSubscription)  billing_str += "Subscription!,";
    if(obj.details.currentDetail.freeTrial)       billing_str += "Free Trial,";
    if(obj.details.currentDetail.priceTier!=0)    billing_str += obj.feedChannel.priceTier.toString() +",";
    //----------------
    if(obj.feedChannel.additionalFees.toString()&&obj.feedChannel.additionalFees.toString()!="None")
       AdditionalFees = "Additional Fees: "+obj.feedChannel.additionalFees.toString()+"<BR>";
    //----------------
    misc_str += obj.details.channelState + "," + obj.details.channelVersionType ;

    if( obj.feedChannel.requiredFeatures && obj.feedChannel.requiredFeatures.toString() && obj.feedChannel.requiredFeatures.toString() != "None" )
       misc_str += " [ RequiredFeatures: " + obj.feedChannel.requiredFeatures.toString() +"]";
    //----------------
    var last3monthsDate =  new Date(); var last2yearsDate =  new Date();

    last3monthsDate =  last3monthsDate.setTime(last3monthsDate.getTime()-((1000 * 60 * 60 * 24)*30)*3);
    last2yearsDate  =  last2yearsDate.setTime (last2yearsDate.getTime() -((1000 * 60 * 60 * 24)*30)*2*12);

    var createdDate = Date.parse(obj.details.createdDate);

    if( createdDate > last3monthsDate )
        createdDate_str = "<div class='RED'>"+ obj.details.createdDate +"</div>";
    else if( createdDate < last2yearsDate )
        createdDate_str = "<div class='GREEN'>"+ obj.details.createdDate +"</div>";
    else
        createdDate_str = "<div class='NONE'>"+ obj.details.createdDate +"</div>";
    //----------------
    var storeCodes_str = "";
    var val = "";
    for (var i = 0; i < obj.details.currentDetail.channelStoreCodes.length; i++)
    {
        val = obj.details.currentDetail.channelStoreCodes[i];
        if ( val == "us" || val == "ca" || val == "gb" || val == "fr" )
            storeCodes_str += "<div style='font-weight:bold;display:inline;'>" + val + "</div>,";
        else
            storeCodes_str +=  val + ", ";
    }
    //----------------

    var str = isAdSupported_str + revenueSources  + "<BR>" +

        //rankByWatched_str + " , Seconds Watched: "+ secondsWatched_str + " ["+ parseInt(obj.feedChannel.secondsWatched/60/60)+" hours]"+ " ["+ parseInt(obj.feedChannel.secondsWatched/60/60/24)+" days]" + "<BR>" +

        "CreatedDate: " + createdDate_str + " , ModifiedDate: " + obj.details.modifiedDate +"<BR>" +

        "StoreCodes: " + storeCodes_str  + "<BR>" +

        "RatingCount: " +
        parseInt(obj.feedChannel.starRatingCount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "  ratings | " + //obj.feedChannel.rankByRating + " | " +
        "Rating: " +
        parseInt(obj.feedChannel.starRating).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "/100" + "<BR>" +

        "Billing: " + billing_str + "<BR>" + AdditionalFees +

        "Misc: " + misc_str + "<BR>" +

        "Protect Your Ad Inventory with <a target='_blank' href='https://www.protected.media/?utm_source=chrome_extension'>Protected Media</a>"

	;
    console.log(str);

    var newDiv = document.createElement("div");
    newDiv.style= " border-color: gray;  border-top-style: dashed; border-bottom-style: dashed;     border-width: thin;";
    newDiv.innerHTML = str;

    // again, because sometimes it is vanished ...
    var inject2Element = document.getElementsByClassName("buttons")[0];
    inject2Element.appendChild(newDiv);

    var footerDiv = document.getElementsByClassName("footer-section-sitemap")[0];
    footerDiv.textAlign = "right";
    footerDiv.innerHTML = footerDiv.innerHTML + "<pre>" + JSON.stringify(obj,null,2) +"</pre>";
}

function getRokuData(){

	var parsedAppIdFromUrl = /details\/(.*)\//.exec(window.location.href)[1] ;
    var parsedCountryAndLang = /channelstore\.roku\.com\/(.*?)\//.exec(window.location.href)[1] ;
    var parsedCountryAndLang_arr = parsedCountryAndLang.split("-");

    var parsedLanguageFromUrl = parsedCountryAndLang_arr[0]; // "en";
	var parsedCountryFromUrl  = parsedCountryAndLang_arr[1].toUpperCase(); // "gb";

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", parseRokuData);
	oReq.open("GET", "https://channelstore.roku.com/api/v6/channels/detailsunion/"+parsedAppIdFromUrl+"?country="+parsedCountryFromUrl+"&language="+parsedLanguageFromUrl);
	oReq.send();
}

var savedUrl = null;

function EndlessLoop(){

    var currentUrl = location.href;
    //console.log("before if: savedUrl="+savedUrl+",currentUrl="+currentUrl);
    if(currentUrl!=savedUrl)
    {
        //console.log("savedUrl="+savedUrl+",currentUrl="+currentUrl);
        var inject2Element = document.getElementsByClassName("buttons")[0];
        if(typeof(inject2Element)!=="undefined")
        {
            getRokuData();
            savedUrl = currentUrl;
        }
    }
    setTimeout(function(){EndlessLoop(); }, 200);
}

addCss ('.RED { display:inline; color: red; }; ' );
addCss ('.GREEN { display:inline; color: green; }; ' );
addCss ('.ORANGE { display:inline; color: orange; }; ' );
addCss ('.NONE { display:inline; }; ' );

EndlessLoop();