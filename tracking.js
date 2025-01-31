// Form Fill DL Push
window.addEventListener("message", function(event) {
    if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmit') {
      var formId = event.data.id;
      var formEvent;

      switch (formId) {
        case '90349635-8e25-4312-9dca-88630d501ddc':
          formEvent = 'pensions_contact_form';
          break;
        case 'dee0ba67-9ded-44fe-9e22-c3c487847163':
          formEvent = 'refer_friend';
          break;
        case 'f96bdc80-b8cd-4b52-b2e6-e8a168b67f38':
          formEvent = 'become_introducer';
          break;
        case '123749c9-2e68-411b-a5f0-cb9212c7ca4f':
          formEvent = 'popup_subscribe';
          break;
        default:
          formEvent = 'unknown_form';
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': formEvent,
        'event-data': event.data,
        'currentUrl': window.location.href
      });
    }
  });

// Meeting Booked Listener
  window.addEventListener('message', function(event) {
    if (event.data.meetingBookSucceeded) {
      // Push to the dataLayer for pensions meeting
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'pensions_meeting',
        'meeting_type': 'pensions_meeting',
        'meeting_data': event.data
      });
    }
  });
