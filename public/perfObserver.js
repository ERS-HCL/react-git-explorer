function initPerformanceObserver() {
  window._observer = new window.PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      // Display each reported measurement on console
      if (console) {
        console.log(
          'Name: ' +
            entry.name +
            ', Type: ' +
            entry.entryType +
            ', Start: ' +
            entry.startTime +
            ', Duration: ' +
            entry.duration +
            '\n'
        );
      }
    });
  });
  console.log('Observe longtask');
  window._observer.observe({
    entryTypes: [
      'resource',
      'mark',
      'measure',
      'paint',
      'frame',
      'navigation',
      'longtask'
    ],
    buffered: true
  });
}
