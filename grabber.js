//Recent Fixes:
//hotkey is now alt+rmb
//brought back the context menu
//It will now search several layers to find the link. This fixes the problem with the text on the page is actually nested several layers inside of the A. 
//Fixed issue of not showing up in some areas of pluralsight. 
//Added persistence so list of links remains when navigating to other pages. 
//Added "clear" button. 

//todo:

//add verticall scroll bar because nate wants it. 



$(function () {

    var container;
    var holder = document.createElement('div');
    holder.setAttribute('id', 'holder');
    var psmain = document.getElementById('ps-main');
    var psapproot = $('#ps-app-root');
    if (psmain) {
        container = psmain;
    } else {
        container = psapproot;
    }

    container.prepend(holder);

    var linkBox = document.createElement("textarea");
    linkBox.setAttribute('id', 'links');
    linkBox.setAttribute('rows', '5');
    linkBox.setAttribute('cols', '140');

    $("#holder").prepend(linkBox);

    var fromStorage = chrome.storage.sync.get('links', function (data) {
        linkBox.value = data.links;

    });

    //copy button/////////////////////////////////////////////////
    var button = document.createElement("button");
    button.setAttribute('id', 'saveButton');
    button.innerText = "Copy";
    $("#holder").prepend(button);

    button.addEventListener('click', function (e) {
        var copyText = document.getElementById('links');
        copyText.select();
        document.execCommand('Copy');
        //copyText.value = '';

    });

    //clear button/////////////////////////////////////////////////
    var cbutton = document.createElement("button");
    cbutton.setAttribute('id', 'clearButton');
    cbutton.innerText = "Clear";
    $("#holder").prepend(cbutton);

    cbutton.addEventListener('click', function (e) {
        var copyText = document.getElementById('links');
        copyText.value = '';
        chrome.storage.sync.set({
            'links': ''
        });

    });


    document.addEventListener('contextmenu', function (e) {
        if (e.altKey) {
            e.preventDefault()
        }
    });


    document.addEventListener('mousedown', function (e) {
        if (e.which == 3 && e.altKey) {
            var clicked = e.srcElement;
            var count = 5;
            while (clicked.tagName != 'A' && count > 0) {
                clicked = clicked.parentElement;
                count--;
                console.log(clicked);
            }
            if (clicked.tagName == 'A') {
                var url = clicked.href;
                var text = e.srcElement.innerText;
                var string = '=hyperlink("' + url + '","' + text + '")';
                var links = document.getElementById('links');
                links.value += string + '\n';
                chrome.storage.sync.set({
                    'links': links.value
                });
            }
        }
    });
})
