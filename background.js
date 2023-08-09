chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'toggle-keyboard-layout':
            toggleKeyboardLayout();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});
function toggleKeyboardLayout() {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript(
            {
                target: { tabId },
                function: toggleAndSetKeyboardLayout,
            },
            (results) => {
                if (!chrome.runtime.lastError) {
                    console.log('Keyboard layout toggled successfully.');
                } else {
                    console.error('Error executing script:', chrome.runtime.lastError);
                }
            }
        );
    });
}

function toggleAndSetKeyboardLayout() {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const text = activeElement.value;
        console.log(text);
        const englishLayout = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const ukrainianLayout = 'фисвуапршолдьтщзйкіегмцчняФІСВУАПРШОЛДЬТЩЗЙКІЕГМЦЧНЯ';

        const newLayoutText = text
            .split('')
            .map((char) => {
                const englishIndex = englishLayout.indexOf(char);
                const ukrainianIndex = ukrainianLayout.indexOf(char);
                
                if (englishIndex !== -1) {
                    return ukrainianLayout[englishIndex];
                } else if (ukrainianIndex !== -1) {
                    return englishLayout[ukrainianIndex];
                } else {
                    return char;
                }
            })
            .join('');
        activeElement.value = newLayoutText;
    }
}

