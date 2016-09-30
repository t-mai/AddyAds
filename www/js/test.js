
var app = {
    // Application Constructor
    initialize: function() {
    
        var url = "http://localhost:8080/test/hello";
        
        $("#testAPI").click(function(){
            $.ajax({
                url: url,
                success: handleResult
            }); // use promises
            
            // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator

            function handleResult(result){
                $("#desc").text(result);
            }
        });      
    },
};

app.initialize();