chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'INSERT_TO_QUORA_EDITOR') {
    const quoraEditor = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]');
    if (quoraEditor) {
      quoraEditor.innerHTML = request.text;
    } else {
      console.log('Quora editor not found.');
    }
  }
});
