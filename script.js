var tasks = {};

//gets todays date
var dateToday = moment().format("dddd, MMMM Do");
$("#currentDay").append(dateToday);



//changes colour 
var scheduleFormats = function() 
{
    
    $(".row").each(function() 
    {
        var hour = parseInt($(this).attr("id").replace("hour-",""));
        
        if (parseInt(moment().format("H")) > hour) 
        {
            $(this).find(".col-10").addClass("past");
        }
        else if (parseInt(moment().format("H")) === hour) 
        {
            $(this).find(".col-10").addClass("present");
        }
        else 
        {
            $(this).find(".col-10").addClass("future");
        }
    });
};

//Loads tasks 
var taskLoad = function() {
    tasks = JSON.parse(localStorage.getItem("daySchedule"));
    
    if (!tasks) 
    {
        tasks = 
        {
            [dateToday]: []
        };
    } else if (!tasks[dateToday]) 
    { 
        tasks[dateToday] = [];
    }
    scheduleFormats();
    $.each(tasks, function(date,arr) 
    {
        
        if (date === dateToday) 
        {
            createTask(arr);
        }
    })
}
//Displays tasks 
var createTask = function(arr) 
{
    $.each(arr, function(index, value) 
    {
        var hourId = "#hour-" + (index+9);
        $(hourId).find(".taskText").text(value);
    })
}



//edit text
$(".col-10").on("click", function() 
{
    var text = $(this).find("p").text().trim();

    var textInput = $("<textarea>").val(text).addClass("addNewTask");
        
    $(this).find("p").replaceWith(textInput);
    textInput.trigger("focus");

});

//Saves task
var saveTasks = function() 
{
    localStorage.setItem("daySchedule", JSON.stringify(tasks));
}


$(".col-10").on("blur", "textarea", function() 
{
   
    var theTextArea = $("textarea");
    
    setTimeout(function() 
    {
        if ($("textarea").length) 
        {
            var hour = theTextArea.closest(".row").attr("id").replace("hour-","");
            var oldText = tasks[dateToday][hour-9];
            var taskP = $("<p>").addClass("taskText").text(oldText);
            theTextArea.replaceWith(taskP);
        }
    }, 300);
});

//save button
$(".saveBtn").on("click", function(event) 
{
    
    if ($(this).closest(".row").find("textarea").length) 
    {
        var newText = $(this).closest(".row").find("textarea").val().trim();

        var hour = $(this).closest(".row").attr("id").replace("hour-","");

        tasks[dateToday][hour-9] = newText;

        var taskP = $("<p>")
        .addClass("taskText")
        .text(newText);

        $(this).closest(".row").find("textarea").replaceWith(taskP);

        saveTasks();
    }
});

taskLoad();

//checks every 3 min
setInterval(function() 
{
    scheduleFormats()    
  }, 180000);