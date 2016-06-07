'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage()
{
    // Globals
    // Setup up the context, user, host web url, app web url, set the list name, set the column name, the value to set the column to, and the value of the column to check
    //----------------------------------------------------------------------------------------
    var context        = SP.ClientContext.get_current();
    var user           = context.get_web().get_currentUser();
    var hostWebUrl     = decodeURIComponent(manageQueryStringParameter('SPHostUrl'));
    var appWebUrl      = decodeURIComponent(manageQueryStringParameter('SPAppWebUrl'));
    var listName       = "TestList";
    var columnName     = "Column1";
    var oldColumnValue = "No";
    var newColumnValue = "Yes";

    //----------------------------------------------------------------------------------------
    // Document Ready 
    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    //----------------------------------------------------------------------------------------
    $(document).ready(function () {
        getUserName();

        //Creating the Client Content object using the Url
        var ctx = new SP.ClientContext(appWebUrl);

        //Get the Web site
        var web = ctx.get_web();

        //Get the List using its name
        var list = web.get_lists().getByTitle(listName);

        // **** Are You Sure buttons Yes and No
        // **** set the click for yes to execute            updateItem();
        updateItem();

        // Gets all items and displays in the grid
        //listAllCategories();

        // Set button functions
        // This is where the Are You Sure? button setup would go

        //$("#btn-new").on('click', function () {
        //    $(".c1").val('');
        //});
        //$("#btn-add").on('click', function () {
        //    createCategory();
        //    listAllCategories();
        //});
        //$("#btn-update").on('click', function () {
        //    updateItem();
        //    listAllCategories();
        //});
        //$("#btn-find").on('click', function () {
        //    findListItem();
        //});
        //$("#btn-delete").on('click', function () {
        //    deleteListItem();
        //    listAllCategories();
        //});
    });

    //----------------------------------------------------------------------------------------
    // Helper and Misc Functions
    //----------------------------------------------------------------------------------------

    //---------------------------------------
    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    //---------------------------------------
    function manageQueryStringParameter(paramToRetrieve) {
        var params = document.URL.split("?")[1].split("&");
        var strParams = "";
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve) {
                return singleParam[1];
            }
        }
    }

    //----------------------------------------------------------------------------------------
    // List Operation Functions
    //----------------------------------------------------------------------------------------

    //---------------------------------------
    function listAllCategories() {
        var ctx = new SP.ClientContext(appWebUrl);
        var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);
        var web = appCtxSite.get_web(); //Get the Web 
        var list = web.get_lists().getByTitle(ListName); //Get the List
        var query = new SP.CamlQuery(); //The Query object. This is used to query for data in the List

        // this is required only returns back 1 item
        query.set_viewXml('<View><RowLimit></RowLimit>200</View>');

        var items = list.getItems(query);

        ctx.load(list); //Retrieves the properties of a client object from the server.
        ctx.load(items);

        var table = $("#tblcategories");
        var innerHtml = "<tr><td>ID</td><td>Title</td><td>Column 1</td></tr>";
        table.html(innerHtml);

        //Execute the Query Asynchronously
        ctx.executeQueryAsync(
            Function.createDelegate(this, function () {
                var itemInfo = '';
                var enumerator = items.getEnumerator();
                while (enumerator.moveNext()) {
                    var currentListItem = enumerator.get_current();
                    innerHtml += "<tr><td>" + currentListItem.get_item('ID') + "</td><td>" + currentListItem.get_item('Title') + "</td><td>" + currentListItem.get_item(columnName) + "</td></tr>";
                }
                table.html(innerHtml);
            }),
            Function.createDelegate(this, fail)
            );
    }

    //---------------------------------------
    //function createCategory() {
    //    var ctx = new SP.ClientContext(appWebUrl);//Get the SharePoint Context object based upon the URL
    //    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);
    //    var web = appCtxSite.get_web(); //Get the Site 
    //    var list = web.get_lists().getByTitle("CategoryList"); //Get the List based upon the Title
    //    var listCreationInformation = new SP.ListItemCreationInformation(); //Object for creating Item in the List
    //    var listItem = list.addItem(listCreationInformation);

    //    listItem.set_item("Title", $("#CategoryId").val());
    //    listItem.set_item(columnName, $("#CategoryName").val());
    //    listItem.update(); //Update the List Item
    //    ctx.load(listItem);
    //    //Execute the batch Asynchronously
    //    ctx.executeQueryAsync(
    //        Function.createDelegate(this, success),
    //        Function.createDelegate(this, fail)
    //       );
    //}

    //---------------------------------------
    //function findListItem() {
    //    listItemId = prompt("Enter the Id to be Searched ");
    //    var ctx = new SP.ClientContext(appWebUrl);
    //    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);
    //    var web = appCtxSite.get_web();
    //    var list = web.get_lists().getByTitle(ListName);

    //    ctx.load(list);
    //    listItemToUpdate = list.getItemById(listItemId);
    //    ctx.load(listItemToUpdate);
    //    ctx.executeQueryAsync(
    //        Function.createDelegate(this, function () {
    //            //Display the Data into the TextBoxes
    //            $("#CategoryId").val(listItemToUpdate.get_item('Title'));
    //            $("#CategoryName").val(listItemToUpdate.get_item(columnName));
    //        }),
    //        Function.createDelegate(this, fail)
    //        );
    //}

    //---------------------------------------
    function updateItem() {
        var ctx = new SP.ClientContext(appWebUrl);
        var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);
        var web = appCtxSite.get_web();
        var list = web.get_lists().getByTitle(listName);
        var query = new SP.CamlQuery(); //The Query object. This is used to query for data in the List
       
        query.set_viewXml('<View><RowLimit></RowLimit>200</View>');
        var items = list.getItems(query);

        ctx.load(list); //Retrieves the properties of a client object from the server.
        ctx.load(items);


        //Execute the Query Asynchronously
        ctx.executeQueryAsync(
            Function.createDelegate(this, function () {
                var itemInfo = '';
                var enumerator = items.getEnumerator();

                while (enumerator.moveNext()) {
                    var currentListItem = enumerator.get_current();
                    var currentValue = currentListItem.get_item(columnName);
                    if (currentValue === oldColumnValue) {
                        currentListItem.set_item(columnName, newColumnValue);
                        currentListItem.update();
                    }
                }
                ctx.executeQueryAsync(Function.createDelegate(this, updateSuccess), Function.createDelegate(this, updateFail));
            }),
            Function.createDelegate(this, fail)
            );  
    }

 

    //---------------------------------------
    //function deleteListItem() {
    //    var ctx = new SP.ClientContext(appWebUrl);
    //    var appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);
    //    var web = appCtxSite.get_web();
    //    var list = web.get_lists().getByTitle(ListName);
    //    ctx.load(list);
    //    listItemToUpdate = list.getItemById(listItemId);
    //    ctx.load(listItemToUpdate);
    //    listItemToUpdate.deleteObject();
    //    ctx.executeQueryAsync(
    //        Function.createDelegate(this, success),
    //        Function.createDelegate(this, fail)
    //        );
    //}

    //----------------------------------------------------------------------------------------
    // Callback Functions
    //----------------------------------------------------------------------------------------

    //---------------------------------------
    function success() {
        $("#dvMessage").text("Operation Completed Successfully");
    }

    //---------------------------------------
    function fail() {
        $("#dvMessage").text("Operation failed  " + arguments[1].get_message());
    }

    //----------------------------------
    function updateSuccess() {
        // Update is done and no errors
        // redirect to ?????
        //alert("updatesuccess");
        window.location = "https://bhogs.sharepoint.com/sites/dev/_layouts/15/start.aspx#/SitePages/DevHome.aspx";
    }

    //--------------------------------------
    function updateFail() {
        //alert("updatefail");
        $("#dvMessage").text("Update operation failed:  " + arguments[1].get_message());
    }

    //---------------------------------------
    // Replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        $('#message').text('Hello ' + user.get_title());
        $('#message2').text('     Working on it...');
    }

    //---------------------------------------
    function onGetUserNameFail(sender, args) {
        alert('Failed to get user name. Error:' + args.get_message());
    }
}
