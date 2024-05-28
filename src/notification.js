export const sendMessage = (title, message, data) => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: title,
      message: message,
      buttons: [{ title: 'Review' }, { title: 'Copy' }],
      requireInteraction: true,
    }, (notificationId) => {
        chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
        if (notifId === notificationId) {
          if (btnIdx === 0) {
            alert(data);
          } else if (btnIdx === 1) {
            navigator.clipboard.writeText(data);
            alert('Copied to clipboard');
          }
        }
      });
    });
  };
  


  